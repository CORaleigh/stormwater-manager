import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Impervious } from './impervious';
import { Apportionment } from './apportionment';
import { Credit } from './credit';
import { Log } from './log';
import { Journal } from './journal';
import { Account } from './account';
import { Feature } from './feature';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { LayerInfo } from './data-element';
import { FieldInfo, Layer, Field, Domain } from './field-info';
import { Parcel } from './parcel';
const httpOptions = {headers: new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded'
})};
@Injectable({
  providedIn: 'root'
})

export class StormwaterService {
  constructor(private http:HttpClient) {}
  url:string = 'https://maps.raleighnc.gov/arcgis/rest/services/Stormwater/Stormwater_Management/FeatureServer/';

  account:BehaviorSubject<Account> = new BehaviorSubject<Account>(null);
  accounts:BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  impervious:BehaviorSubject<Impervious[]> = new BehaviorSubject<Impervious[]>([]);
  apportionments:BehaviorSubject<Apportionment[]> = new BehaviorSubject<Apportionment[]>([]);
  loggedIn:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  logInClicked:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  logOutClicked:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  credentials:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  credits:BehaviorSubject<Credit[]> = new BehaviorSubject<Credit[]>([]);
  logs:BehaviorSubject<Log[]> = new BehaviorSubject<Log[]>([]);
  journals:BehaviorSubject<Journal[]> = new BehaviorSubject<Journal[]>([]);
  parcel:BehaviorSubject<Parcel> = new BehaviorSubject<Parcel>(null);
  fieldInfo:FieldInfo;
  streetName:BehaviorSubject<string> = new BehaviorSubject<string>(null);
  accountSearch:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  accountList:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  accountListSelected:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  apportionedToClicked:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  gisScanSelected: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  gisscan: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  parcels: any = null;
  mapview: any = null;
  applyEdits(id:number, adds?:Array<Feature>, updates?:Array<Feature>, deletes?:Array<number>): Observable<any> {
    
    let params:HttpParams = new HttpParams()
    .set('adds', JSON.stringify(adds))
    .set('updates', JSON.stringify(updates))
    .set('deletes', JSON.stringify(deletes))
    .set('f', 'json')
    .set('token', this.credentials.getValue().token);
    
    return this.http.post<any>(this.url + id + '/applyEdits', params, httpOptions);
  }

  getByObjectId(id:number, oid:number): Observable<any> {
    let params:HttpParams = new HttpParams()
    .set('objectIds', oid.toString())
    .set('outFields', '*')
    .set('returnGeometry', 'false')
    .set('f', 'json')
    .set('token', this.credentials.getValue().token);
    
    return this.http.post<any>(this.url + id + '/query', params, httpOptions);    
  }

  checkApportioned(id:number, premiseId:string): Observable<any> {
    let params:HttpParams = new HttpParams()
    .set('where', "PremiseId = '" + premiseId + "'")
    .set('outFields', '*')
    .set('returnGeometry', 'false')
    .set('f', 'json')
    .set('token', this.credentials.getValue().token);
    
    return this.http.post<any>(this.url + id + '/query', params, httpOptions);    
  }
  searchByStreet(input:string):Observable<any> { 
    let token:string = this.credentials.getValue().token;
    let url = this.url + "/0/query?f=json&outFields=FullStreetName&returnDistinctValues=true&returnGeometry=false&orderByFields=FullStreetName&&token="+ token + "&where=FullStreetName like '" + input.toUpperCase() +"%25'";
    return this.http.get<any>(url);
  }
  searchAccounts(input:string, field:string):Observable<any> { 
    let token:string = this.credentials.getValue().token;
    let url = this.url + "/2/query?f=json&outFields="+field+"&returnDistinctValues=true&returnGeometry=false&orderByFields="+field+"&token="+ token + "&where="+field+" like '" + input.toUpperCase() +"%25'";
    return this.http.get<any>(url);
  }



  getDataElements(token:string):Observable<any> { 
    let url = this.url + "/queryDataElements?f=json&layers=*&token="+ token;
    return this.http.get<any>(url);
  }

  getLayerInfos(result:any) {
    let layerInfo:LayerInfo = result as LayerInfo;
    let fieldInfo:FieldInfo = new FieldInfo();
    fieldInfo.layers = [];
    layerInfo.layerDataElements.forEach(layerElement => {
      let layer = new Layer();
      layer.layerId = layerElement.layerId;
      let fields:Field[] = [];
      layer.fields = fields;
      layerElement.dataElement.fields.fieldArray.forEach(field => {
        let f:Field = new Field();
        f.aliasName = field.aliasName;
        f.isNullable = field.isNullable;
        f.length = field.length;
        f.name = field.name;
        f.type = field.type;
        if (field.domain) {
          let d:Domain = new Domain();
          d.domainName = field.domain.domainName;
          d.description = field.domain.description;
          d.fieldType = field.domain.fieldType;
          if (field.domain.codedValues) {
            d.codedValues = field.domain.codedValues;
          }
          f.domain = d;
        }
        layer.fields.push(f);
      });
      fieldInfo.layers.push(layer);
    });
    this.fieldInfo = fieldInfo;
  }


  public checkDomain(layerId, fieldName, value?, code?): string {
    let layers = this.fieldInfo.layers.filter(layer => {return layerId === layer.layerId});
    let returnValue = '';
    if (value) {
      returnValue = value;
    } else if (code) {
      returnValue = code;
    }
    if (layers.length > 0) {
      let layer = layers[0];
      let fields = layer.fields.filter(field => {return fieldName === field.name});
      if (fields.length > 0) {
        let field = fields[0];
        if (field.domain) {
          if (field.domain.codedValues) {
            let codedvalue = field.domain.codedValues.filter(cv =>
              {
                return value === cv.name || code === cv.code;
              });
              if (codedvalue.length > 0) {
                if (value != null) {
                  returnValue = codedvalue[0].code;
                } else if (code != null) {
                  returnValue = codedvalue[0].name;
                }
                
              }
            }
          }
        }
      }
      return returnValue;
    }

    public getDomain(layerId, fieldName): any {
    
      let layers = this.fieldInfo.layers.filter(layer => {return layerId === layer.layerId});
      let returnValue = '';
      if (layers.length > 0) {
        let layer = layers[0];
        let fields = layer.fields.filter(field => {return fieldName === field.name});
        if (fields.length > 0) {
          let field = fields[0];
          if (field.domain) {
            if (field.domain.codedValues) {
              return field.domain.codedValues;
              }
            }
          }
        }
        return returnValue;
      }

}
