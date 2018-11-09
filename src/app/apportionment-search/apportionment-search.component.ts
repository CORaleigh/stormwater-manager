import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BillingService } from '../billing-service';
import { Apportionment } from '../apportionment';
import { Account } from '../account';
import * as moment from 'moment';

import { StormwaterService } from '../stormwater.service';
export interface SearchGroup {
  type:string,
  values: string[];
}
@Component({
  selector: 'app-apportionment-search',
  templateUrl: './apportionment-search.component.html',
  styleUrls: ['./apportionment-search.component.css']
})

export class ApportionmentSearchComponent implements OnInit {

  constructor(private fb: FormBuilder, private billing:BillingService, private stormwater:StormwaterService) { }
  control: FormControl = new FormControl();
  searchForm: FormGroup = this.fb.group({searchGroup: ''});
  searchGroups:SearchGroup[] = [{type:'Addresses', values:[]}, {type:'Accounts', values:[]}, {type: 'Premise IDs', values:[]}];
  addressChanges:Subscription;
  accountChanges:Subscription;
  premiseChanges:Subscription;
  apportionment:Apportionment;
  @Input() account:Account;
  @Output() ccbAccountSelected:EventEmitter<any> = new EventEmitter();
  ccbAccount:any;
  selectedValue:string = "";
  
  ngOnInit() {
  }

  accountSelected(event) {
    this.selectedValue = event.option.viewValue;
    this.billing.getBillingInfo(event.option.value.prem_id).subscribe(data => {
      if (data.Results.length > 0) {
        this.ccbAccount = data.Results[0];
        debugger
        this.ccbAccountSelected.emit(this.ccbAccount);
      }
    });
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
      this.searchGroups[0].values = result.Results;
      this.accountChanges = this.billing.searchCcbAccounts('account', event.target.value).subscribe(result => {
        this.searchGroups[1].values = result.Results;
        this.premiseChanges = this.billing.searchCcbAccounts('premise', event.target.value).subscribe(result => {
          this.searchGroups[2].values = result.Results;
        });
      });
    })
  }

}
