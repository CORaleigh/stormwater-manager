import { Component, OnInit, wtfLeave } from '@angular/core';
import { BillingService } from '../billing-service';
import { StormwaterService } from '../stormwater.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
export interface SearchGroup {
  type:string,
  values: string[];
}
@Component({
  selector: 'app-searchtab',
  templateUrl: './searchtab.component.html',
  styleUrls: ['./searchtab.component.css']
})

export class SearchtabComponent implements OnInit {

  constructor(private fb: FormBuilder, private billing:BillingService, private stormwater:StormwaterService) { }
  streetChanges:Subscription;
  accountChanges:Subscription;
  premiseChanges:Subscription;
  csaChanges:Subscription;  
  searchForm: FormGroup = this.fb.group({searchGroup: ''});
  control: FormControl = new FormControl();
  accountList: any[] = [];
  searchGroups:SearchGroup[] = [{type:'Streets', values:[]},{type:'Account IDs', values:[]},{type:'Premise IDs', values:[]},{type:'CSA IDs', values:[]}];
  displayFn(user?: any): string | undefined {
    let value = undefined;
    if (user) {
      if (user.FullStreetName) {
        value = user.FullStreetName;
      } else if (user.AccountId) {
        value = user.AccountId;
      } else if (user.PremiseId) {
        value = user.PremiseId;
      } else if (user.CSA_ID) {
        value = user.CSA_ID;
      }
    }

    return value;
  }
  ngOnInit() {
    this.stormwater.accountList.subscribe(data => {
      this.accountList = data;
    });
  }

  accountSelected($event) {
    
    if ($event.option.value.FullStreetName) {
      this.stormwater.streetName.next($event.option.value.FullStreetName);
    } else if ($event.option.value.AccountId) {
      this.stormwater.accountSearch.next({accountId: $event.option.value.AccountId});
    } else if ($event.option.value.PremiseId) {
      this.stormwater.accountSearch.next({premiseId: $event.option.value.PremiseId});
    } else if ($event.option.value.CSA_ID) {
      this.stormwater.accountSearch.next({csaId: $event.option.value.CSA_ID});
    }
  }  
  inputChanged(event) {
    if (event.target.value.length > 4) {
      if (this.streetChanges) {
        this.streetChanges.unsubscribe();
        this.accountChanges.unsubscribe();
        this.premiseChanges.unsubscribe();
        this.csaChanges.unsubscribe();
      }
      this.searchGroups[0].values=[];
      this.searchGroups[1].values=[];
      this.searchGroups[2].values=[];           
      this.searchGroups[3].values=[];               
      this.streetChanges = this.stormwater.searchByStreet(event.target.value).subscribe(result => {
        let values = [];
        if (result.features.length > 0) {
          result.features.forEach(feature => {
              values.push(feature.attributes);
          });
        }
        this.searchGroups[0].values = values;
      });
      this.accountChanges = this.stormwater.searchAccounts(event.target.value, 'AccountId').subscribe(result => {
        let values = [];
        if (result.features.length > 0) {
          result.features.forEach(feature => {
              values.push(feature.attributes);
          });
        }
        this.searchGroups[1].values = values;
      });
      this.premiseChanges = this.stormwater.searchAccounts(event.target.value, 'PremiseId').subscribe(result => {
        let values = [];
        if (result.features.length > 0) {
          result.features.forEach(feature => {
              values.push(feature.attributes);
          });
        }
        this.searchGroups[2].values = values;
      });
      this.csaChanges = this.stormwater.searchAccounts(event.target.value, 'CSA_ID').subscribe(result => {
        let values = [];
        if (result.features.length > 0) {
          result.features.forEach(feature => {
              values.push(feature.attributes);
          });
        }
        this.searchGroups[3].values = values;
      });      
    }
  }
}
