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
  baseUrl: string = 'https://gis.raleighnc.gov/stormwater-ccb-api/';
  constructor(private http:HttpClient) {
  }  

  types = ['ST','WA','WW','WM', 'WA', 'WR'];
  count = 0;


  public getBilling(premise:string, type: string):Promise<BillingInfo> {
    let promise = new Promise<BillingInfo>((resolve, reject) => {
      if (this.count < this.types.length) {
        
        this.getBillingInfo(premise, type).subscribe(data => {
          if (data) {          
            if (data.rowCount > 0) {
              this.count = 0;
              resolve(data.results[0]);
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
          debugger
          if (result) {
            info = result as BillingInfo;
            this.getLastBill(info.accountId).subscribe(result => {
    
              if (result.rowCount > 0) {
                info.lastBill = result.results[0] as Bill;
                this.getLastSwBill(account.PremiseId.toString(), info.lastBill.billId).subscribe(result => {
                  if (result.rowCount > 0) {
                    info.lastStormwaterBill = result.results[0] as StormwaterBill;
                  }
                  this.getBillingServices(info.premiseId).subscribe(result => {
                    info.services = result.results as BillService[];
                    resolve(info);
                  });
                });
              } else {
                this.getBillingServices(info.premiseId).subscribe(result => {
                  info.services = result.results as BillService[];
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
    const url = `${this.baseUrl}getPremiseAccounts`;
    const params = { premiseId: premise, serviceType };
    return this.http.get<any>(url, { params });
  }

  getLastBill(account:string):Observable<any> {
    const url = `${this.baseUrl}getLastBillByAccount`;

    const params = { accountId: account, serviceType: "ST" };

    return this.http.get<any>(url, { params });
  }

  getLastSwBill(premise:string, billid: string):Observable<any> {
    const url = `${this.baseUrl}getBillingByPremise`;

   
    const params = { premiseId: premise, billId: billid, serviceType: "ST" };

    return this.http.get<any>(url, { params });
  }
  getBillingServices(premise:string):Observable<any> {
    const url = `${this.baseUrl}getServicePoints`;
    const params = { premiseId: premise };
    return this.http.get<any>(url, { params });
  }

  searchCcbAccounts(type: string, input: string): Observable<any> {
    const url = `${this.baseUrl}getPremiseInfo`;

    let params: any = {};
    if (type === 'address') {
      params.address = input;
    } else if (type === 'premise') {
      params.premiseId = input;
    } else if (type === 'account') {
      params.accountId = input;
    }

    return this.http.get<any>(url, { params });
  }
}
