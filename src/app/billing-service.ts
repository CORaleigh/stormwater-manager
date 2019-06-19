import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BillingInfo } from './billing-info';
import { StormwaterBill } from './stormwater-bill';
import { Account } from './account';
import { Bill } from './bill';
import { BillService } from './bill-service';
const options = {
  headers: new HttpHeaders({
    'Content-Type':  'text/plain'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  baseUrl: string = 'https://cityconnecttest.raleighnc.gov/RaleighAPI/ccb/';
  constructor(private http:HttpClient) {
  }  

  types = ['ST','WA','WW','WM', 'WA', 'WR'];
  count = 0;


  public getBilling(premise:string, type: string):Promise<BillingInfo> {
    let promise = new Promise<BillingInfo>((resolve, reject) => {
      if (this.count < this.types.length) {
        this.getBillingInfo(premise, type).subscribe(data => {
          if (data) {          
            if (data.length > 0) {
              this.count = 0;
              resolve(data[0]);
            } else {
              this.count += 1;
              this.getBilling(premise, this.types[this.count])
            }
          }
      });
      } else {
        this.count = 0;
      }
    });
    return promise;
  }
  public getBillingData(account:Account):Promise<BillingInfo> {
    let promise = new Promise<BillingInfo>((resolve, reject) => {
      if (account.PremiseId) {        
        let info = new BillingInfo();
        info.services = [];
        this.count = 0;
        this.getBilling(account.PremiseId.toString(), this.types[this.count]).then(result => {
          if (result) {
            info = result as BillingInfo;
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

  getBillingInfo(premise:string, serviceType: string):Observable<any> {
   let url = this.baseUrl + 'getPremiseAccounts';
    let body:any = {
      "CM-GetPremiseAccounts": {
        "premiseId": premise,
        "serviceType": serviceType
      }
    } 
    return this.http.post<any>(url, body, options);    
  }

  getLastBill(account:string):Observable<any> {
    let url = this.baseUrl + 'getLastBillByAccount';
    let body:any = {
      "CM-GetLastBillByAccount": {
        "accountId": account,
        "serviceType": "ST"
      }
    } 
    return this.http.post<any>(url, body, options);    
  }

  getLastSwBill(premise:string, billid: string):Observable<any> {
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
    let url = this.baseUrl + 'getPremiseSPs';
    let body:any = {
      "CM-GetPremiseSPs": {
        "premiseId": premise,
      }
    }     
    return this.http.post<any>(url, body, options);    
  }

  searchCcbAccounts(type:string, input:string):Observable<any> {
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
    return this.http.post<any>(url, body, options);      
  }  
}
