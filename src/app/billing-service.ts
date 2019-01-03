import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BillingInfo } from './billing-info';
import { StormwaterBill } from './stormwater-bill';
import { Account } from './account';
import { Bill } from './bill';
import { BillService } from './bill-service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http:HttpClient) {
  }  
  
    public getBillingData(account:Account):Promise<BillingInfo> {

    let promise = new Promise<BillingInfo>((resolve, reject) => {
      if (account.PremiseId) {
        
        let info = new BillingInfo();
        info.services = [];
        this.getBillingInfo(account.PremiseId.toString()).subscribe(result => {
          if (result.Results) {
            if (result.Results.length > 0) {
              info = result.Results[0] as BillingInfo;
              this.getLastBill(info.acctId).subscribe(result => {
                if (result.Results.length > 0) {
                  info.lastBill = result.Results[0] as Bill;
                  this.getLastSwBill(account.PremiseId.toString(), info.lastBill.billId).subscribe(result => {
                    if (result.Results.length > 0) {
                      info.lastStormwaterBill = result.Results[0] as StormwaterBill;
                    }
                    this.getBillingServices(info.premId).subscribe(result => {
                      info.services = result.Results as BillService[];
                      resolve(info);
                    });
                  });
                } else {
                  this.getBillingServices(info.premId).subscribe(result => {
                    info.services = result.Results as BillService[];
                    resolve(info);
                  });
                }
              });
            } else {
              resolve(info);
            }
          }else {
            resolve(info);
          }

        });
      } else {
        resolve(null);
      }
    });
    return promise;
  }

  getBillingInfo(premise:string):Observable<any> {
    let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Information?f=json&premise='+premise
    return this.http.get<any>(url);    
  }
  getLastBill(account:string):Observable<any> {
    let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Last%20Bill?f=json&account='+account;
    return this.http.get<any>(url);    
  }
  getLastSwBill(premise:string, billid: string):Observable<any> {
    let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Last%20Stormwater%20Bill?f=json&premise='+premise + '&billId='+billid;
    return this.http.get<any>(url);    
  }
  getBillingServices(account:string):Observable<any> {
    let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Services?f=json&account='+account;
    return this.http.get<any>(url);    
  }

  searchCcbAccounts(type:string, input:string):Observable<any> {
    let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20AutoComplete?f=json&type='+type+'&input='+input;
    return this.http.get<any>(url);    
  }  
}
