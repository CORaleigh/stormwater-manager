import { Component, OnInit } from '@angular/core';
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
  searchForm: FormGroup = this.fb.group({searchGroup: ''});
  control: FormControl = new FormControl();

  searchGroups:SearchGroup[] = [{type:'Streets', values:[]}];
  displayFn(user?: any): string | undefined {
    return user ? user.FullStreetName : undefined;
  }
  ngOnInit() {
  }
  inputChanged(event) {
    if (event.target.value.length > 4) {
      if (this.streetChanges) {
        this.streetChanges.unsubscribe();
      }
      this.streetChanges = this.stormwater.searchByStreet(event.target.value).subscribe(result => {
        let values = [];
        if (result.features.length > 0) {
          result.features.forEach(feature => {
              values.push(feature.attributes);
          });
        }
        this.searchGroups[0].values = values;
      });

    }
  }
}
