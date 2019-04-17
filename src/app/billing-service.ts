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
  baseUrl: string = 'https://cityconnecttest.raleighnc.gov/RaleighAPI/ccb/';
  constructor(private http:HttpClient) {
  }  
  
    public getBillingData(account:Account):Promise<BillingInfo> {

    let promise = new Promise<BillingInfo>((resolve, reject) => {
      if (account.PremiseId) {
        
        let info = new BillingInfo();
        info.services = [];
        this.getBillingInfo(account.PremiseId.toString()).subscribe(result => {
          debugger
          if (result) {
            if (result.length > 0) {
              info = result[0] as BillingInfo;
              this.getLastBill(info.accountId).subscribe(result => {
                if (result.length > 0) {
                  info.lastBill = result[0] as Bill;
                  this.getLastSwBill(account.PremiseId.toString(), info.lastBill.billId).subscribe(result => {
                    if (result.length > 0) {
                      info.lastStormwaterBill = result[0] as StormwaterBill;
                    }
                    this.getBillingServices(info.premiseId).subscribe(result => {
                      info.services = result as BillService[];
                      resolve(info);
                    });
                  });
                } else {
                  this.getBillingServices(info.premiseId).subscribe(result => {
                    info.services = result as BillService[];
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
    //let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Information?f=json&premise='+premise
   //let url = this.baseUrl + 'getPremiseAccounts';
    // let body:any = {
    //   "CM-GetPremiseAccounts": {
    //     "premiseId": premise,
    //     "serviceType": "ST"
    //   }
    // } 
    let url = 'https://giststetllv1.ci.raleigh.nc.us:3002/api/accounts/'+premise;
    return this.http.get<any>(url,{headers: {'Content-Type': 'application/json'}});//, body);    
  }
  getLastBill(account:string):Observable<any> {
    //let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Last%20Bill?f=json&account='+account;
    let url = this.baseUrl + 'getLastBillByAccount';
    let body:any = {
      "CM-GetLastBillByAccount": {
        "accountId": account,
        "serviceType": "ST"
      }
    } 
    
    return this.http.post<any>(url, body);    
  }
  getLastSwBill(premise:string, billid: string):Observable<any> {
    //let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Last%20Stormwater%20Bill?f=json&premise='+premise + '&billId='+billid;
    let url = this.baseUrl + 'getBillingByPremise';
    let body:any = {
      "CM-GetBillingByPremise": {
        "premiseId": premise,
        "billId": billid,
        "serviceType": "ST"
      }
    } 
    
    return this.http.post<any>(url, body);    
  }
  getBillingServices(premise:string):Observable<any> {
    //let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20Services?f=json&account='+account;
    let url = this.baseUrl + 'getPremiseSPs';
    let body:any = {
      "CM-GetPremiseSPs": {
        "premiseId": premise,
      }
    } 
    
    return this.http.post<any>(url, body);    
  }

  searchCcbAccounts(type:string, input:string):Observable<any> {
    //let url = 'https://gis.raleighnc.gov/arcgis/rest/services/Stormwater/ImperviousSurface/MapServer/exts/StormwaterSOE/CCB%20AutoComplete?f=json&type='+type+'&input='+input;
    let url = this.baseUrl + 'getPremiseInformation';
    let address = "";
    let premise = "";
    let account = "";
    if (type === 'address') {
      address = input;
    }
    if (type === 'premise') {
      premise = input;
    }
    if (type === 'account') {
      account = input;
    }        
    let body:any = {
      "CM-GetPremiseInformation": {
        "premiseId": premise,
        "accountId": account,
        "address": address
      }
    } 
    
    return this.http.post<any>(url, body);      
  }  
}
