import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BillingService } from '../billing-service';
import { Apportionment } from '../apportionment';
import { Account } from '../account';

import { StormwaterService } from '../stormwater.service';
export interface SearchGroup {
  type:string,
  values: string[];
}
@Component({
    selector: 'app-apportionment-search',
    templateUrl: './apportionment-search.component.html',
    styleUrls: ['./apportionment-search.component.css'],
    standalone: false
})

export class ApportionmentSearchComponent implements OnInit {

  constructor(private fb: UntypedFormBuilder, private billing:BillingService, private stormwater:StormwaterService) { }
  control: UntypedFormControl = new UntypedFormControl();
  searchForm: UntypedFormGroup = this.fb.group({searchGroup: ''});
  searchGroups:SearchGroup[] = [{type:'Addresses', values:[]}, {type:'Accounts', values:[]}, {type: 'Premise IDs', values:[]}];
  addressChanges:Subscription;
  accountChanges:Subscription;
  premiseChanges:Subscription;
  apportionment:Apportionment;
  @Input() account:Account;
  @Output() ccbAccountSelected:EventEmitter<any> = new EventEmitter();
  ccbAccount:any;
  selectedValue:string = "";
  types = ['ST','WA','WW','WM', 'WA', 'WR'];
  count = 0;
  ngOnInit() {
  }

  getBilling(event, type) {
      if (this.count < this.types.length) {
        this.billing.getBillingInfo(event.option.value.premiseId, type).subscribe(data => {
          console.log(data)
          if (data.results) {
            this.ccbAccount = data.results[0];
            this.ccbAccountSelected.emit(this.ccbAccount);
            this.count = 0;
          } else {
            this.count += 1;
            this.getBilling(event, this.types[this.count])
          }
  
      });
      } else {
        this.count = 0;
      }
  }
   

  accountSelected(event) {
    this.selectedValue = event.option.viewValue;
    this.getBilling(event, this.types[this.count]);

  }
  displayFn(user?: any): string | undefined {
    return user ? user.value : undefined;
  }
  inputChanged(event) {
    if (this.addressChanges) {
      this.addressChanges.unsubscribe();
    }
    if (this.accountChanges) {
      this.accountChanges.unsubscribe();
    }
    if (this.premiseChanges) {
      this.premiseChanges.unsubscribe();
    }        
    this.searchGroups[0].values=[];
    this.searchGroups[1].values=[];
    this.searchGroups[2].values=[];        
    this.addressChanges = this.billing.searchCcbAccounts('address', event.target.value).subscribe(result => {
      if (result.results) {
        result.results.forEach(r => {
          //@ts-ignore
          this.searchGroups[0].values.push({value: r.address, premiseId: r.premiseId, address: r.address});
        });
      }
      this.accountChanges = this.billing.searchCcbAccounts('account', event.target.value).subscribe(result => {
        if (result.results) {
          result.results.forEach(r => {
            if (r.premiseId.length) {
              //@ts-ignore
              this.searchGroups[1].values.push({value: r.accountId, premiseId: r.premiseId, address: r.address});
            }
          });        
        }
          
        this.premiseChanges = this.billing.searchCcbAccounts('premise', event.target.value).subscribe(result => {
          if (result.results) {
            result.results.forEach(r => {
            //@ts-ignore
              this.searchGroups[2].values.push({value: r.premiseId, premiseId: r.premiseId, address: r.address});
            });     
          }
        });
      });
    })
  }

}
