import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { Account } from '../account';
import { StormwaterService } from '../stormwater.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Parcel } from '../parcel';
import { BillingService } from '../billing-service';
import { Feature } from '../feature';
import { Location } from '@angular/common';
import { LodsService } from '../lods.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  private _id: string = '7be33c08a6704e6fb7f8367b24f4cee6';
  private _portalUrl: string = 'https://maps.raleighnc.gov/portal'
  private _esriId:esri.IdentityManager = null;
  private _info:esri.OAuthInfo = null;
  private _search:esri.widgetsSearch;
  private _mapView:esri.MapView;
  private _parcelView:esri.FeatureLayerView;
  private _highlight:any;
  private _parcelGraphics:esri.GraphicsLayer;
  private _selectedParcel:esri.Graphic;
  private _lastAccountId:number = null;
  private _parcels:esri.FeatureLayer = null;  
  streetNameSubscription:Subscription;
  accountSearchSubscription:Subscription;
  accountSubscription:Subscription;
  @Input('account') account:Account;
  constructor(public stormwater: StormwaterService, private billing:BillingService, private route: ActivatedRoute, private router:Router, private location:Location, private lods:LodsService) { }
  async authenicate() {
    try {
      const [OAuthInfo, esriId] = await loadModules([
        "esri/identity/OAuthInfo",
        "esri/identity/IdentityManager"
      ]);
      
      this._info = new OAuthInfo({
        appId: 'xWoMZTo6ZiZVTwcT',
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
      const [WebMap, MapView, GraphicsLayer, config,LOD] = await loadModules([
        'esri/WebMap',
        'esri/views/MapView',
        'esri/layers/GraphicsLayer',
        'esri/config',
        'esri/layers/support/LOD'
      ]);
      config.portalUrl = this._portalUrl;
      const mapProperties: esri.WebMapProperties = {
        portalItem: { 
          id: this._id
        }
      };
      const map: esri.WebMap = new WebMap(mapProperties);

      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        map: map,
        constraints: {
          lods: this.lods.lods
        }
      };

      this.stormwater.mapview = new MapView(mapViewProperties);

      this.stormwater.mapview.when((mapView) => {
        this.mapLoaded.emit(true);
        this._parcelGraphics = new GraphicsLayer({listMode: 'hide'});
        this.stormwater.mapview.map.add(this._parcelGraphics);
        this.stormwater.parcels = mapView.map.layers.find(l => {
          return l.title === 'Parcels';
        }) as esri.FeatureLayer;        
        this.configLayerList(this.stormwater.mapview);
        this.configBasemapGallery(this.stormwater.mapview);        
        this.setupSearch(this.stormwater.mapview);
        this.configPopupActions(this.stormwater.mapview);
        this.stormwater.mapview.on('hold', e => {
          this.getPropertyByGeometry(this.stormwater.mapview, e.mapPoint);

        });
        if (this.route.routeConfig) {
          if (this.route.routeConfig.path === 'account/:id') {
            this.route.params.subscribe(params => {
              if (params.id) {
                //if (params.id != this._lastAccountId) {
                  this._lastAccountId = params.id;
                  this.getByAccountId(params.id, 'AccountId', this.stormwater.mapview, true);
                //}
              }
            });
          }      
        }        
      });
    } catch (error) {
      console.log('We have an error: ' + error);
    }
  }

  configPopupActions(mapView: esri.MapView) {
    loadModules([    
      'esri/support/actions/ActionButton',
      'esri/core/Collection'
    ])
    .then(([ActionButton, Collection]) => {
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
              this.getAccount(mapView.popup.selectedFeature);
              this._search.clear();
              this.clearResultsList();
              this.stormwater.accountListSelected.next(null);
            }
          });        
      });
      this.configAddressActions(mapView);
    });
  }

  configAddressActions(mapView:esri.MapView) {
    loadModules([    
      'esri/support/actions/ActionButton',
      'esri/core/Collection'])
      .then(([ActionButton, Collection]) => {
        let addresses = mapView.map.layers.find(l => {
          return l.title === 'Address Points';
        }) as esri.FeatureLayer;      
      
        mapView.whenLayerView(addresses).then(layer => {
          let l = layer.layer as esri.FeatureLayer;
          mapView.popup.watch('selectedFeature', (e) => {
            if (e) {
              if (e.sourceLayer) {
                if (e.sourceLayer.title === 'Address Points') {
                  if (this._selectedParcel) {
                    let pt:esri.Point = e.geometry;
                    let poly:esri.Polygon = this._selectedParcel.geometry as esri.Polygon;
                      e.sourceLayer.popupTemplate.actions.items[0].visible = poly.contains(pt)
                  }
                }
              }
            }
          })
          let button: esri.ActionButton = new ActionButton({
            title: 'Assign CSA ID',
            id: 'assign-csaid',
            className: 'esri-icon-checkbox-checked',
            visible: false
          });         
          l.popupTemplate.actions = new Collection();
          l.popupTemplate.actions.add(button);  
          mapView.popup.on("trigger-action", event => {
            if(event.action.id === "assign-csaid"){
              if (mapView.popup.selectedFeature.attributes.CSAID) {
                let account = this.stormwater.account.getValue()
                let newCsa = mapView.popup.selectedFeature.attributes.CSAID;
                let oldCsa = account.CsaId;
                if (newCsa != oldCsa) {
                  account.CsaId = newCsa;
                  this.stormwater.applyEdits(2, null, [new Feature(account)]).subscribe(result => {
                    if (result.updateResults.length > 0) {
                      this.account = account;
                      
                      this.stormwater.account.next(account);
                      this.stormwater.accountListSelected.next(account);
                    }
                  });
                }
              }
            }
          });    
        });             
    });
  }

  async configLayerList(mapView: esri.MapView) {
    try {
      const [LayerList, Legend, Expand] = await loadModules([
        "esri/widgets/LayerList",
        "esri/widgets/Legend",
        "esri/widgets/Expand"
      ]);
      let list: esri.LayerList = new LayerList({view: mapView, container: document.createElement('div')});
      let expand: esri.Expand = new Expand({expandIconClass: 'esri-icon-layers', view: mapView, content: list.container});
      mapView.ui.add(expand, 'top-right');
      let legend: esri.Legend = new Legend({view: mapView, container: document.createElement('div')});

      mapView.ui.add(expand, 'top-right');
      mapView.ui.add(new Expand({expandIconClass: 'esri-icon-legend', view: mapView, content: legend.container}), 'top-right')
    } catch (error) {
      console.log('We have an error: ' + error);
    }        
  }

  async configBasemapGallery(mapView: esri.MapView) {
    try {
      const [BasemapGallery, Expand] = await loadModules([
        "esri/widgets/BasemapGallery",
        "esri/widgets/Expand"
      ]);
      let gallery: esri.BasemapGallery = new BasemapGallery({view: mapView, container: document.createElement('div')});
      let expand: esri.Expand = new Expand({expandIconClass: 'esri-icon-basemap', view: mapView, content: gallery.container});
      mapView.ui.add(expand, 'top-right');

    } catch (error) {
      console.log('We have an error: ' + error);
    }        
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

  getSource (layer: esri.Layer, LayerSearchSource: any, displayField: string, name: string, where: string, placeholder: string): esri.LayerSearchSource {
    let source: esri.LayerSearchSource = new LayerSearchSource({
      layer: layer,
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

  addStreetSource(search:esri.widgetsSearch) {
    loadModules([    
      'esri/widgets/Search/SearchSource'])
    .then(([SearchSource]) => {
      let source = new SearchSource({
        name: 'Street name',
        placeholder: 'Search by street name',
        displayField: 'FullStreetName',
        getSuggestions: params => {
          return this.stormwater.parcels.queryFeatures({returnDistinctValues: true, where: "FullStreetName like '%" + params.suggestTerm.toUpperCase() + "%'", outFields: ["FullStreetName"], returnGeometry: false, orderByFields: ["FullStreetName"]})
          .then(
            results => {
              return results.features.map(function(feature) {
                return {
                  key: "FullStreetName",
                  text: feature.attributes.FullStreetName,
                  sourceIndex: params.sourceIndex
                };
              }
            );
          });
        },
        getResults: params => {
          this.stormwater.streetName.next(params.suggestResult.text)
        }
      });
      search.sources.push(source);
    });
  }

  async setupSearch (mapView:esri.MapView) {
    try {
      const [Search, LayerSearchSource, query, esriRequest, FeatureLayer] = await loadModules([
        'esri/widgets/Search',
        'esri/widgets/Search/LayerSearchSource',
        'esri/rest/query',
        'esri/request',
        'esri/layers/FeatureLayer'

      ]);
      //@ts-ignore
      let accounts = mapView.map.tables.find(l => {
        return l.title === 'Stormwater_Management - Account';
      }) as esri.FeatureLayer;
      mapView.whenLayerView(this.stormwater.parcels).then(layerView => {
        this._parcelView = layerView as esri.FeatureLayerView;
      });
      let addresses = mapView.map.layers.find(l => {
        return l.title === 'Address Points';
      }) as esri.FeatureLayer;
      let search: esri.widgetsSearch = new Search({view: mapView, includeDefaultSources: false, resultGraphicEnabled: false});
      this._search = search;
      search.sources.push(this.getSource(this.stormwater.parcels, LayerSearchSource, 'SiteAddress', 'Site Address', "Account = 'A'", "Search by site address"));
      //search.sources.push(this.getSource(this.stormwater.parcels, LayerSearchSource, 'RealEstateId', 'REID', "Account = 'A'", "Search by REID"));
      //search.sources.push(this.getSource(this.stormwater.parcels, LayerSearchSource, 'PinNumber', 'PIN', "Account = 'A'", "Search by PIN"));
      search.sources.push(new LayerSearchSource({
        layer: new FeatureLayer({
        url: 'https://maps.raleighnc.gov/arcgis/rest/services/Stormwater/Stormwater_Management/FeatureServer/2'}),
        searchFields: ["RealEstateId"],
        displayField: "RealEstateId",
        exactMatch: false,
        outFields: ["*"],
        name: "REID",
        placeholder: "Search by REID",
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 3,
        popupEnabled: false
      }));      
      //@ts-ignore
      search.sources.push(new LayerSearchSource({
        layer: new FeatureLayer({
        url: 'https://maps.raleighnc.gov/arcgis/rest/services/Stormwater/Stormwater_Management/FeatureServer/0'}),
        searchFields: ["PinNumber"],
        displayField: "PinNumber",
        exactMatch: false,
        outFields: ["*"],
        name: "PIN",
        placeholder: "Search by PIN",
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 3,
        popupEnabled: false
      }));
      //@ts-ignore
      search.sources.push(new LayerSearchSource({
        layer: new FeatureLayer({
        url: 'https://maps.raleighnc.gov/arcgis/rest/services/Stormwater/Stormwater_Management/FeatureServer/2'}),
        searchFields: ["AccountId"],
        displayField: "AccountId",
        exactMatch: false,
        outFields: ["*"],
        name: "AccountId",
        placeholder: "Search by Account ID",
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 3,
        popupEnabled: false
      }));
      //@ts-ignore
      search.sources.push(new LayerSearchSource({
        layer: new FeatureLayer({
        url: 'https://maps.raleighnc.gov/arcgis/rest/services/Stormwater/Stormwater_Management/FeatureServer/2'}),
        searchFields: ["PremiseId"],
        displayField: "PremiseId",
        exactMatch: false,
        outFields: ["*"],
        name: "PremiseId",
        placeholder: "Search by Premise ID",
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 3,
        popupEnabled: false
      }));    
      //@ts-ignore
      search.sources.push(new LayerSearchSource({
        layer: new FeatureLayer({
        url: 'https://maps.raleighnc.gov/arcgis/rest/services/Stormwater/Stormwater_Management/FeatureServer/2'}),
        searchFields: ["CsaId"],
        displayField: "CsaId",
        exactMatch: false,
        outFields: ["*"],
        name: "CsaId",
        placeholder: "Search by CSA ID",
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 3,
        popupEnabled: false
      }));       
      this.addStreetSource(search); 
      search.sources.push(this.getSource(addresses, LayerSearchSource, 'ADDRESS', 'Address Point', "", "Search by address point" ));
      mapView.ui.add(search, {position: 'top-left', index: 0});
      search.goToOverride = (view:esri.MapView, params:any) => {
        debugger
        if (params.target.target.layer.title.indexOf('Stormwater Management - ') > -1 && params.target.target.layer.isTable) {
          this.account = params.target.target.attributes as Account;
          this.stormwater.accounts.next([this.account]);
          
          this.stormwater.account.next(params.target.target.attributes as Account);
          this.clearResultsList();
          
          this.getParcel(this.stormwater.parcels.url,esriRequest, query, params.target.target.attributes.OBJECTID, view);
          this._search.clear();
        } else {
          this.getParcelByObjectId(params.target.target.attributes.OBJECTID, mapView);
          // this.highlightSingleParcel(params.target.target);
          // let target = params.target.target.geometry;
          // if (params.target.target.geometry.extent) {
          //   target = params.target.target.geometry.extent.clone().expand(2);      
          // }
          // params.options.duration = 1500;
          // params.options.easing = 'ease-in';
          // return view.goTo(target, params.options);        
        }
      };
      search.on('select-result', event => {
        
        if (event.source.name != 'Address Point' && !event.source.layer.isTable) {
          this.getAccount(event.result.feature);
          debugger
          this.stormwater.parcel.next(event.result.feature.attributes as Parcel);
          this.clearResultsList();
          this.account = null;
          this.stormwater.accountListSelected.next(null);
        } else if (event.source.name === 'Address Point'){
          this.getPropertyByGeometry(this.stormwater.mapview, event.result.feature.geometry);
        } 
        this._search.clear();
      });
    } catch (error) {
      console.log('We have an error: ' + error);
    }    
  }

  getPropertyByGeometry(mapView:esri.MapView, geometry:esri.Geometry) {
    this.stormwater.parcels.queryFeatures({returnGeometry: true, outFields: ['*'], geometry, outSpatialReference: mapView.spatialReference}).then(result => {
      if (result.features) {
        if (result.features.length > 0) {
          let parcel:Parcel = result.features[0].attributes as Parcel;
          debugger
          this.stormwater.parcel.next(parcel);                    
          this.getAccount(result.features[0]);
          let parcelExtent = result.features[0].geometry.extent.clone().expand(2);
          mapView.goTo(parcelExtent,{duration: 1500, easing:'ease-in'});
            this.highlightSingleParcel(result.features[0]);
        } 
      } 
    });            
  }

  getAccount(feature: esri.Graphic) { 
    loadModules([    
      'esri/rest/support/RelationshipQuery',
      'esri/rest/query',
      'esri/request'
    ])
      .then(([RelationshipQuery, query, esriRequest]) => {
      //@ts-ignore
      let relationship = this.stormwater.parcels.relationships.find((r:esri.Relationship) => {
        return r.name === 'Account';
      });
      this.clearResultsList(); 
      
      if (relationship) {
        let query: esri.RelationshipQuery = new RelationshipQuery();
        query.relationshipId = relationship.id;
        query.returnGeometry = false;
        query.objectIds = [feature.attributes.OBJECTID];
        query.outFields = ['*'];
        this.stormwater.parcels.queryRelatedFeatures(query).then( result => {
          if (result[feature.attributes.OBJECTID]) {
            let accounts:Account[] = [];
            result[feature.attributes.OBJECTID].features.forEach(f => {
              accounts.push(f.attributes as Account);
            });
            accounts.sort((a,b) => (a.Status > b.Status) ? 1 : ((b.Status > a.Status) ? -1 : 0)); 
            this.stormwater.accounts.next(accounts);
            let account:Account = accounts[0]; 
            this.account = account;
            
            this.stormwater.account.next(account);
            // let path = window.location.origin + '/account/';
            // if (!path.includes('localhost')) {
            //   path = window.location.origin + '/stormwater-manager/account/'
            // }
            // window.history.pushState({'id':'account'},'', path + account.AccountId);
            // this.stormwater.account.next(account);
            // this.queryTables(this.stormwater.parcels.url, esriRequest, QueryTask, account.OBJECTID);
 
          } else {
            this.stormwater.account.next(null);
          }
        });
      }
    });    
  }

  queryRelatedTables (url: string, relationship: any, query: esri.query, objectId: number):Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      //let query: esri.query = new query(this.stormwater.parcels.url + '/2');
      query.executeRelationshipQuery(this.stormwater.parcels.url + '/2', {objectIds: [objectId], relationshipId: relationship.id, outFields:['*']}).then(result => {
        resolve(result);
      });
    })
    return promise;
  }

  queryTables (url: string, esriRequest: any, query: esri.query, objectId: number) {
    esriRequest(url + '/2?f=json', {responseType: 'json'}).then(response => {
      response.data.relationships.forEach(relationship => {
        if (relationship.role === 'esriRelRoleOrigin') {
          this.queryRelatedTables(url, relationship, query, objectId).then(result => {
            let attributes = [];
            if (result[objectId]) {
              result[objectId].features.forEach(feature => {
                attributes.push(feature.attributes);
              });
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
  queryParcelsRelatedToAccounts (url: string, relationshipId: number, query: esri.query, objectIds: number[]):Promise<any> {
    
    let promise = new Promise<any>((resolve, reject) => {
      //let query: esri.query = new query(url);
      query.executeRelationshipQuery(url, {objectIds: objectIds, relationshipId: relationshipId, outFields:['*'], returnGeometry:true}).then(result => {
        resolve(result);
      });
    })
    return promise;
  }
  getParcelByObjectId(objectId:number,mapView: esri.MapView) {
    this.stormwater.parcels.queryFeatures({returnGeometry: true, outFields: ['*'], objectIds: [objectId], outSpatialReference: mapView.spatialReference,}).then(result => {
      if (result.features) {
        if (result.features.length > 0) {
          let parcel:Parcel = result.features[0].attributes as Parcel;
          debugger
          this.stormwater.parcel.next(parcel);                    
          let parcelExtent = result.features[0].geometry.extent.clone().expand(2);
          mapView.goTo(parcelExtent,{duration: 1500, easing:'ease-in'});
          this.highlightSingleParcel(result.features[0]);
        }
      }});
  }
  getParcel(url: string, esriRequest: any, query: esri.query, objectId: number, mapView: esri.MapView) {
    esriRequest(url + '/2?f=json', {responseType: 'json'}).then(response => {
      response.data.relationships.forEach(relationship => {
        if (relationship.role === 'esriRelRoleDestination') {
         // let query: esri.query = new query(this.stormwater.parcels.url + '/2');
          query.executeRelationshipQuery(this.stormwater.parcels.url + '/2', {objectIds: [objectId], relationshipId: relationship.id, outFields:['OBJECTID'], returnGeometry: false, outSpatialReference: mapView.spatialReference}).then(result => {
            
            if (result[objectId]) {
              this.getParcelByObjectId(result[objectId].features[0].attributes.OBJECTID, mapView);
            } else {
              debugger
              this.stormwater.parcel.next(null); 
              this._parcelGraphics.removeAll();
            }
          });
        }
      });
    });
  }

  getByAccountId(id: any[], field:string, mapView: esri.MapView, zoom:boolean) {
    loadModules([    
      'esri/rest/query',
      'esri/request',
    ])
    .then(([query, esriRequest]) => {
      
      if (this.stormwater.parcels) {
        //let queryTask: esri.query = new query(this.stormwater.parcels.url + '/2');
        
        query.executeQueryJSON(this.stormwater.parcels.url + '/2', {where: field + " in (" + id.toString() + ")", outFields: ['*'], returnGeometry: false}).then(result => {
          if (result.features) {
            if (result.features.length < 2) {
              let account = result.features[0].attributes;
              
              this.stormwater.account.next(account);
              //this.queryTables(this.stormwater.parcels.url, esriRequest, QueryTask, account.OBJECTID);
              if (zoom) {
                this.getParcel(this.stormwater.parcels.url, esriRequest, query, account.OBJECTID, mapView);
              }
            } else if (result.features.length > 1) {
              let oids = [];
              result.features.forEach(feature => {
                oids.push(feature.attributes.OBJECTID);
              });
              let relationship = this.stormwater.parcels.relationships.find((r:esri.Relationship) => {
                return r.name === 'Account';
              });    
              if (relationship) {
                this.queryParcelsRelatedToAccounts(this.stormwater.parcels.url+'/2', relationship.id, query, oids).then(parcelResult => {
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

            } else {
              this.stormwater.account.next(null);
              this.clearResultsList();       
            }
          }
        });
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
        
        mapView.goTo(extent,{duration: 1500, easing:'ease-in'});
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
    this._selectedParcel = feature;
  }

  queryRelatedParcels(oids:number[], features:any[]) {
    let data = [];
    let relationship = this.stormwater.parcels.relationships.find((r:esri.Relationship) => {
      return r.name === 'Account';
    });    
    this.stormwater.parcels.queryRelatedFeatures({relationshipId: relationship.id, returnGeometry: true, objectIds: oids, outFields: ['*']}).then(relatedResults => {
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
    this.zoomToParcels(features, this.stormwater.mapview);
  }

  clearResultsList() {
    this.stormwater.accountList.next([]);
    if (this._highlight) {
      this._highlight.remove();
    }    
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
    this.accountSubscription = this.stormwater.account.subscribe(account => {
        loadModules([
        'esri/rest/query',
        'esri/request', ])
          .then(([query, esriRequest]) =>  {
            if (account) {
              let path = window.location.origin + '/account/';
              if (!path.includes('localhost')) {
                path = window.location.origin + '/stormwater-manager/account/'
              }
              window.history.pushState({'id':'account'},'', path + account.AccountId);
              this.queryTables(this.stormwater.parcels.url, esriRequest, query, account.OBJECTID);
   
         } else {
           this.stormwater.impervious.next([]);
           this.stormwater.apportionments.next([]);
           this.stormwater.credits.next([]);
           this.stormwater.logs.next([]);
           this.stormwater.journals.next([]);
         }
        }); 
    });

    this.streetNameSubscription = this.stormwater.streetName.subscribe(streetName => {
      if (streetName && this.stormwater.parcels) {
        this.stormwater.parcels.queryFeatures({where: "FullStreetName = '" + streetName + "'", returnGeometry: true, outFields: ['*'], outSpatialReference: this.stormwater.mapview.spatialReference }).then(result => {
          let oids = [];
          result.features.forEach(feature => {
            oids.push(feature.attributes.OBJECTID);

          });
          this.queryRelatedParcels(oids, result.features as Feature[]);
        });
      }
    });
    this.accountSearchSubscription = this.stormwater.accountSearch.subscribe(selection => {
      if (selection) {
        let field:string = '';
        let value:any = null;
        if (selection.accountId) {
          field = 'AccountId';
          value = selection.accountId;
        } else if (selection.premiseId) {
          field = 'PremiseId';
          value = selection.premiseId;
        } else if (selection.csaId) {
          field = 'CsaId';
          value = selection.csaId;
        } else if (selection.status) {
          field = 'Status';
          value = selection.status;
        }
        if (this._lastAccountId != value) {
          this._lastAccountId = value;
          this.getByAccountId([value], field, this.stormwater.mapview, true);
        }
      }
    });
    this.stormwater.apportionedToClicked.subscribe(features => {
      if (features.length > 0) {
        let ids:number[] = [];
        features.forEach(account => {
          ids.push(account.attributes.AccountId)
        });
        this.getByAccountId(ids, 'AccountId', this.stormwater.mapview, true);
      }    
    });
    this.stormwater.accountListSelected.subscribe(row => {
      if (row) {
        loadModules([
        'esri/rest/query',
        'esri/request', ])
          .then(([query, request]) =>  {
            this.getByAccountId([row.AccountId], 'AccountId', this.stormwater.mapview, true);
        });
      }
    });
    this.stormwater.gisScanSelected.subscribe(reid => {
      if (this.stormwater.mapview) {
        let impLyr = this.stormwater.mapview.map.layers.find(l => {
          return l.title === 'Impervious Area By Parcel';
        }) as esri.FeatureLayer;
        impLyr.queryFeatures({
            where: "RealEstateId = '" + reid + "'",
            returnGeometry: true, 
            outFields:['*']
        }).then(result => {
   
          if (result) {
            loadModules([    
              'esri/geometry/geometryEngine'])
                .then(([geometryEngine]) => {
                  let data =[];
                  let features = result.features;
                  let area:number = null;
                  features.forEach(f => {
                    area = geometryEngine.planarArea(f.geometry, 'square-feet');
                    //area = f.attributes['Shape.STArea()'];
                    data.push({area:area, category:f.attributes.CATEGORY, updated:f.attributes.UPDATE_DATE});
                  });
                this.stormwater.gisscan.next(data);         
              });                   
          }
        });           
      }
    });
  }


  ngOnDestroy() {
    if (this.streetNameSubscription) {
      this.streetNameSubscription.unsubscribe();
      this.streetNameSubscription = null;
    }
    if (this.accountSearchSubscription) {
      this.accountSearchSubscription.unsubscribe();
      this.accountSearchSubscription = null;

    }
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;

    }
       
  }
}