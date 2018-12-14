/*
  Copyright 2018 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { getMatFormFieldPlaceholderConflictError } from '@angular/material';
import { Account } from '../account';
import { StormwaterService } from '../stormwater.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Parcel } from '../parcel';
import { BillingService } from '../billing-service';
import { Feature } from '../feature';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;



  private _id: string = 'd8309610f598424b9889d62775b6330c';
  private _portalUrl: string = 'https://mapstest.raleighnc.gov/portal'
  private _esriId:esri.IdentityManager = null;
  private _info:esri.OAuthInfo = null;
  private _search:esri.widgetsSearch;
  private _mapView:esri.MapView;
  private _parcelView:esri.FeatureLayerView;
  private _highlight:any;
  private _parcelGraphics:esri.GraphicsLayer;
  private _lastAccountId:number = null;
  constructor(public stormwater: StormwaterService, private billing:BillingService, private route: ActivatedRoute, private router:Router) { }
  async authenicate() {
    try {
      const [Portal, OAuthInfo, esriId, PortalQueryParams] = await loadModules([
        "esri/portal/Portal",
        "esri/identity/OAuthInfo",
        "esri/identity/IdentityManager",
        "esri/portal/PortalQueryParams"
      ]);
      
      this._info = new OAuthInfo({
        appId: 'u8kxa1iiA6kg2Nhc',
        portalUrl: this._portalUrl,
        popup: false
      });
      this._esriId = esriId;
      this._esriId.registerOAuthInfos([this._info]);
      this.checkSignInStatus();

    } catch (error) {
      console.log('We have an error: ' + error);
    }    
  }

  checkSignInStatus() {
    this._esriId.checkSignInStatus(this._info.portalUrl + '/sharing').then(event => {
      this.stormwater.credentials.next(event);
    });
  }
  

  getCredential() {
    this._esriId.getCredential(this._info.portalUrl + '/sharing');
  }

  async initializeMap() {
    try {
      const [WebMap, MapView, Search, FeatureLayerSearchSource, RelationshipQuery, FeatureLayer, QueryTask, esriRequest, GroupLayer, Expand, LayerList, ActionButton, Collection, GraphicsLayer, config] = await loadModules([
        'esri/WebMap',
        'esri/views/MapView',
        'esri/widgets/Search',
        'esri/widgets/Search/FeatureLayerSearchSource',
        'esri/tasks/support/RelationshipQuery',
        'esri/layers/FeatureLayer',
        'esri/tasks/QueryTask',
        'esri/request', 
        'esri/layers/GroupLayer',
        'esri/widgets/Expand',
        'esri/widgets/LayerList',
        'esri/support/actions/ActionButton',
        'esri/core/Collection',
        'esri/layers/GraphicsLayer',
        'esri/config'
      ]);

      config.portalUrl = this._portalUrl;

      // Set type of map
      const mapProperties: esri.WebMapProperties = {
        portalItem: { 
          id: this._id
        }
      };

      const map: esri.Map = new WebMap(mapProperties);

      // Set type of map view
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        map: map
      };

      this._mapView = new MapView(mapViewProperties);

      // All resources in the MapView and the map have loaded.
      // Now execute additional processes
      this._mapView.when(() => {
        this.mapLoaded.emit(true);
        this._parcelGraphics = new GraphicsLayer();
        this._mapView.map.add(this._parcelGraphics);
        this.configLayerList(LayerList, GroupLayer, Expand, this._mapView);
        this.setupSearch(this._mapView, Search, FeatureLayerSearchSource, RelationshipQuery, QueryTask, esriRequest);
        this.configPopupActions(this._mapView, ActionButton, Collection, RelationshipQuery, QueryTask, esriRequest);

        if (this.route.routeConfig) {
          if (this.route.routeConfig.path === 'account/:id') {
            this.route.params.subscribe(params => {
              if (params.id) {
                this.getByAccountId(params.id, 'AccountId', QueryTask, esriRequest, this._mapView);
              }
            });
          }      
        }        
      });
    } catch (error) {
      console.log('We have an error: ' + error);
    }

  }

  configPopupActions(mapView: esri.MapView, ActionButton: any, Collection: any, RelationshipQuery:any, QueryTask: any, esriRequest: any) {
    let parcels = mapView.map.layers.find(l => {
      return l.title === 'Parcels';
    }) as esri.FeatureLayer;    

    mapView.whenLayerView(parcels).then(layer => {
      let l = layer.layer as esri.FeatureLayer;
  
        let button: esri.ActionButton = new ActionButton({
          title: 'Select',
          id: 'select-parcel',
          className: 'esri-icon-checkbox-checked'
        });        
        
        l.popupTemplate.actions = new Collection();
        l.popupTemplate.actions.add(button);
        mapView.popup.on("trigger-action", event => {
          if(event.action.id === "select-parcel"){
            this.getAccount(RelationshipQuery, mapView.popup.selectedFeature, QueryTask, esriRequest);
            this._search.clear();
            if (this._highlight) {
              this._highlight.remove();
            }
            this.stormwater.accountList.next([]);
            this.stormwater.accountListSelected.next(null);
          }
        });        
    });
    this.configAddressActions(mapView, ActionButton, Collection);

  }

  configAddressActions(mapView:esri.MapView, ActionButton: any, Collection:any) {
    let addresses = mapView.map.layers.find(l => {
      return l.title === 'Address Points';
    }) as esri.FeatureLayer;      
  
    mapView.whenLayerView(addresses).then(layer => {
      let l = layer.layer as esri.FeatureLayer;
  
      let button: esri.ActionButton = new ActionButton({
        title: 'Assign CSA ID',
        id: 'assign-csaid',
        className: 'esri-icon-checkbox-checked'
      });         
      l.popupTemplate.actions = new Collection();
      l.popupTemplate.actions.add(button);  
      mapView.popup.on("trigger-action", event => {
        if(event.action.id === "assign-csaid"){
          if (mapView.popup.selectedFeature.attributes.CSAID) {
            let account = this.stormwater.account.getValue()
            let newCsa = mapView.popup.selectedFeature.attributes.CSAID;
            let oldCsa = account.CSA_ID;
            if (newCsa != oldCsa) {
              account.CSA_ID = newCsa;
              this.stormwater.applyEdits(1, null, [new Feature(account)]).subscribe(result => {
                if (result.updateResults.length > 0) {
                  this.stormwater.account.next(account);
                }
              });
            }
          }
        }
      });    

    });    
  }

  configLayerList(LayerList: any, GroupLayer: any, Expand: any, mapView: esri.MapView) {
    let imperviousGrp:esri.GroupLayer = new GroupLayer();
    imperviousGrp.title = 'Impervious Surface';
    imperviousGrp.visible = false;
    imperviousGrp.layers.addMany(this.getImperviousLayers(mapView));
    mapView.map.layers.add(imperviousGrp, 2);
    let list: esri.LayerList = new LayerList({view: mapView, container: document.createElement('div')});
    let expand: esri.Expand = new Expand({expandIconClass: 'esri-icon-layers', view: mapView, content: list.container});
    mapView.ui.add(expand, 'top-right');
  }

  getImperviousLayers(mapView: esri.MapView): esri.Collection<esri.Layer>{
    return mapView.map.layers.filter(layer=> {
      if (layer.type === 'feature') {
        let fl:esri.FeatureLayer = layer as esri.FeatureLayer;
        if (fl.popupTemplate) {
          let fields = fl.popupTemplate.fieldInfos.filter(info => {
            return info.fieldName === 'IMPERVIOUS';
          });
          return fields.length > 0;
        } else {
          return false;
        }

      } else {
        return false;
      }
       
    });
  }

  getSource (layer: esri.Layer, FeatureLayerSearchSource: any, displayField: string, name: string, where: string, placeholder: string): esri.FeatureLayerSearchSource {
    let source: esri.FeatureLayerSearchSource = new FeatureLayerSearchSource({
      featureLayer: layer,
      searchFields: [displayField],
      displayField: displayField,
      exactMatch: false,
      outFields: ['*'],
      name: name,
      where: where,
      placeholder: placeholder,
      maxResults: 6,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 2,
      popupEnabled: false,
      resultGraphicEnabled: false,
      zoomScale: 5000,
    });
    return source;
  }
  parcels:esri.FeatureLayer = null;
  setupSearch (mapView:esri.MapView, Search: any, FeatureLayerSearchSource: any, RelationshipQuery: any, QueryTask: any, esriRequest: any) {
    this.parcels = mapView.map.layers.find(l => {
      return l.title === 'Parcels';
    }) as esri.FeatureLayer;

    mapView.whenLayerView(this.parcels).then(layerView => {
      this._parcelView = layerView as esri.FeatureLayerView;
    });
    let addresses = mapView.map.layers.find(l => {
      return l.title === 'Address Points';
    }) as esri.FeatureLayer;
  
    let search: esri.widgetsSearch = new Search({view: mapView, includeDefaultSources: false, resultGraphicEnabled: false});
    this._search = search;
    search.sources.push(this.getSource(this.parcels, FeatureLayerSearchSource, 'SiteAddress', 'Site Address', "Account = 'A'", "Search by site address"));
    search.sources.push(this.getSource(this.parcels, FeatureLayerSearchSource, 'RealEstateId', 'REID', "Account = 'A'", "Search by REID"));
    search.sources.push(this.getSource(this.parcels, FeatureLayerSearchSource, 'PinNum', 'PIN', "Account = 'A'", "Search by PIN"));

    search.sources.push(this.getSource(addresses, FeatureLayerSearchSource, 'ADDRESS', 'Address Point', "", "Search by address point" ));
    mapView.ui.add(search, {position: 'top-left', index: 0});
    search.on('select-result', event => {

      if (event.source.name != 'Address Point') {
        this.getAccount(RelationshipQuery, event.result.feature, QueryTask, esriRequest);
        this.highlightSingleParcel(event.result.feature)
        this._highlight.remove();
        this.stormwater.accountList.next([]);
        this.stormwater.accountListSelected.next(null);
      } else {
        
        this.parcels.queryFeatures({returnGeometry: true, outFields: ['*'], geometry: event.result.feature.geometry, outSpatialReference: mapView.spatialReference}).then(result => {
          if (result.features) {
            if (result.features.length > 0) {
              let parcel:Parcel = result.features[0].attributes as Parcel;
              this.stormwater.parcel.next(parcel);                    
              this.getAccount(RelationshipQuery, result.features[0], QueryTask, esriRequest);
              let parcelExtent = result.features[0].geometry.extent.clone().expand(2);
              mapView.goTo(parcelExtent);
              this.highlightSingleParcel(result.features[0]);
            }
          }
        });      }
    });
  }
  getAccount(RelationshipQuery:any, feature: esri.Graphic, QueryTask: any, esriRequest: any) { 
    //@ts-ignore
    let relationship = this.parcels.relationships.find((r:esri.Relationship) => {
      return r.name === 'Account';
    });
    

    if (relationship) {
      let query: esri.RelationshipQuery = new RelationshipQuery();
      query.relationshipId = relationship.id;
      query.returnGeometry = false;
      query.objectIds = [feature.attributes.OBJECTID];
      query.outFields = ['*'];

      this.parcels.queryRelatedFeatures(query).then( result => {
        if (result[feature.attributes.OBJECTID]) {
          let account:Account = result[feature.attributes.OBJECTID].features[0].attributes as Account; 
          this.router.navigate(['/account/' + account.AccountId])
          this.stormwater.account.next(account);
          this.queryTables(this.parcels.url, esriRequest, QueryTask, account.OBJECTID);
        }  
      });
    }
  }

  queryRelatedTables (url: string, relationship: any, QueryTask: any, objectId: number):Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let queryTask: esri.QueryTask = new QueryTask(this.parcels.url + '/1');
      queryTask.executeRelationshipQuery({objectIds: [objectId], relationshipId: relationship.id, outFields:['*']}).then(result => {
        resolve(result);
      });
    })
    return promise;

  }

  queryTables (url: string, esriRequest: any, QueryTask: any, objectId: number) {
    
    esriRequest(url + '/1?f=json', {responseType: 'json'}).then(response => {
      response.data.relationships.forEach(relationship => {
        if (relationship.role === 'esriRelRoleOrigin') {
          this.queryRelatedTables(url, relationship, QueryTask, objectId).then(result => {
            let attributes = [];
            if (result[objectId]) {
              result[objectId].features.forEach(feature => {
                attributes.push(feature.attributes);
              });;
            }
            if (relationship.name.indexOf('ImperviousSurface') > -1) {
              this.stormwater.impervious.next(attributes);
            }
            if (relationship.name.indexOf('Apportionment') > -1) {
              this.stormwater.apportionments.next(attributes);
            }
            if (relationship.name.indexOf('Credit') > -1) {
              this.stormwater.credits.next(attributes);
            }
            if (relationship.name.indexOf('Log') > -1) {
              this.stormwater.logs.next(attributes);              
            }
            if (relationship.name.indexOf('Journal') > -1) {
              this.stormwater.journals.next(attributes);
            }                                     
          });
        }
      });
    });
  }
  queryParcelsRelatedToAccounts (url: string, relationshipId: number, QueryTask: any, objectIds: number[]):Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let queryTask: esri.QueryTask = new QueryTask(url);
      queryTask.executeRelationshipQuery({objectIds: objectIds, relationshipId: relationshipId, outFields:['*'], returnGeometry:true}).then(result => {
        resolve(result);
      });
    })
    return promise;
  }
  getParcel(url: string, esriRequest: any, QueryTask: any, objectId: number, mapView: esri.MapView) {
    esriRequest(url + '/1?f=json', {responseType: 'json'}).then(response => {
      response.data.relationships.forEach(relationship => {
        if (relationship.role === 'esriRelRoleDestination') {
          let queryTask: esri.QueryTask = new QueryTask(this.parcels.url + '/1');
          queryTask.executeRelationshipQuery({objectIds: [objectId], relationshipId: relationship.id, outFields:['OBJECTID'], returnGeometry: false, outSpatialReference: mapView.spatialReference}).then(result => {
            if (result[objectId]) {

              this.parcels.queryFeatures({returnGeometry: true, outFields: ['*'], objectIds: [result[objectId].features[0].attributes.OBJECTID], outSpatialReference: mapView.spatialReference}).then(result => {
                if (result.features) {
                  if (result.features.length > 0) {
                    let parcel:Parcel = result.features[0].attributes as Parcel;
                    this.stormwater.parcel.next(parcel);                    
                    let parcelExtent = result.features[0].geometry.extent.clone().expand(2);
                    mapView.goTo(parcelExtent);
                    this.highlightSingleParcel(result.features[0]);
                  }
                }
              });
            }
          });
        }
      });
    });
  }

  getByAccountId(id: any[], field:string, QueryTask: any, esriRequest: any, mapView: esri.MapView) {
    let queryTask: esri.QueryTask = new QueryTask(this.parcels.url + '/1');
    queryTask.execute({where: field + " in (" + id.toString() + ")", outFields: ['*'], returnGeometry: false}).then(result => {
      if (result.features) {
        if (result.features.length === 1) {
          let account = result.features[0].attributes
          this.stormwater.account.next(account);
          this.queryTables(this.parcels.url, esriRequest, QueryTask, account.OBJECTID);
          this.getParcel(this.parcels.url, esriRequest, QueryTask, account.OBJECTID, mapView);
        } else {
          let oids = [];
          result.features.forEach(feature => {
            oids.push(feature.attributes.OBJECTID);
          })
          this.queryParcelsRelatedToAccounts(this.parcels.url+'/1', 0, QueryTask, oids).then(parcelResult => {
            let data = [];
            result.features.forEach(f => {
              if (parcelResult[f.attributes.OBJECTID]) {
                let feature = parcelResult[f.attributes.OBJECTID].features[0]
                data.push({SiteAddress: feature.attributes.SiteAddress, RealEstateId: feature.attributes.RealEstateId, AccountId: f.attributes.AccountId, Status: f.attributes.Status, TotalImpervious: f.attributes.TotalImpervious, ApportionmentUnits: f.attributes.ApportionmentUnits, geometry: feature.geometry});
              }
            });
            this.stormwater.accountList.next(data);
          });
        }

      }
    });
  }

  zoomToParcels(features, mapView) {
    loadModules([    
    'esri/geometry/geometryEngine'])
      .then(([geometryEngine]) => {
        let geoms = [];
        features.forEach(feature => {
          geoms.push(feature.geometry);
        });
        let result = geometryEngine.union(geoms);
        let extent = result.extent.clone().expand(2);
        mapView.goTo(extent);
    });
  }

  highlightSingleParcel(feature:esri.Graphic) {
    this._parcelGraphics.removeAll();
    let symbol = {
      type: 'simple-fill',
      style: 'none',
      outline: {
        color: 'yellow',
        width: 4
      }
    };
    //@ts-ignore
    feature.symbol = symbol;
    this._parcelGraphics.add(feature);
  }

  queryRelatedParcels(oids:number[], features:any[]) {
    let data = [];
    this.parcels.queryRelatedFeatures({relationshipId: 0, returnGeometry: false, objectIds: oids, outFields: ['*']}).then(relatedResults => {
      features.forEach(feature => {
        
        if (relatedResults[feature.attributes.OBJECTID]) {
          let r = relatedResults[feature.attributes.OBJECTID];
          let f = r.features[0];
          data.push({SiteAddress: feature.attributes.SiteAddress, RealEstateId: feature.attributes.RealEstateId, AccountId: f.attributes.AccountId, Status: f.attributes.Status, TotalImpervious: f.attributes.TotalImpervious, ApportionmentUnits: f.attributes.ApportionmentUnits, geometry: feature.geometry});
        }
      });
      this.stormwater.accountList.next(data);
    });          
    if (this._highlight) {
      this._highlight.remove();
    }
    this._highlight = this._parcelView.highlight(features);
    this.zoomToParcels(features, this._mapView);
  }

  ngOnInit() {
    this.authenicate();
    this.initializeMap();
    this.stormwater.logInClicked.subscribe(logInClicked => {
      if (logInClicked) {
        this.getCredential();
      }
    });
    this.stormwater.logOutClicked.subscribe(logOutClicked => {
      if (logOutClicked) {
        this._esriId.destroyCredentials();
        this.stormwater.credentials.next(null);
      }
    });    
    this.stormwater.credentials.subscribe(credentials => {
      if (credentials) {
        this.stormwater.getDataElements(credentials.token).subscribe(result => {
          this.stormwater.getLayerInfos(result);
        });        
        

      }
    });

    this.stormwater.account.subscribe(account => {


    });
    this.stormwater.streetName.subscribe(streetName => {
      if (streetName) {
              let data = [];
              this.parcels.queryFeatures({where: "FullStreetName = '" + streetName + "'", returnGeometry: true, outFields: ['*'], outSpatialReference: this._mapView.spatialReference }).then(result => {
                let oids = [];
                result.features.forEach(feature => {
                  oids.push(feature.attributes.OBJECTID);

                });
                this.queryRelatedParcels(oids, result.features as Feature[]);
              });
      }
  });
  this.stormwater.accountSearch.subscribe(selection => {
    if (selection) {
      let field:string = '';
      let value:any = null;
      if (selection.accountId) {
        field = 'AccountId';
        value = selection.accountId;
      } else if (selection.premiseId) {
        field = 'PremiseId';
        value = selection.premiseId;
      }
      loadModules([
        'esri/tasks/QueryTask',
        'esri/request', ])
          .then(([QueryTask, request]) =>  {
            this.getByAccountId([value], field, QueryTask, request, this._mapView);
        });
    }
});
  this.stormwater.apportionedToClicked.subscribe(features => {
    if (features.length > 0) {

    loadModules([
      'esri/tasks/QueryTask',
      'esri/request', ])
        .then(([QueryTask, request]) =>  {
          let ids:number[] = [];
          features.forEach(account => {
            
            ids.push(account.attributes.AccountId)
          });
          this.getByAccountId(ids, 'AccountId', QueryTask, request, this._mapView);


      });
    }    
  });


  this.stormwater.accountListSelected.subscribe(row => {
    if (row) {
      loadModules([
      'esri/tasks/QueryTask',
      'esri/request', ])
        .then(([QueryTask, request]) =>  {
          this.getByAccountId([row.AccountId], 'AccountId', QueryTask, request, this._mapView);
      });
    }

  });
  }
}