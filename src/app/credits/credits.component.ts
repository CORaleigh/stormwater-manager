import { Component, OnInit, OnDestroy } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Credit } from '../credit';
import * as moment from 'moment';
import { DialogComponent } from '../dialog/dialog.component';
import { Feature } from '../feature';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit, OnDestroy {

  constructor(private stormwater: StormwaterService, public dialog: MatDialog) { }
  credit:Credit = null;
  credits:Credit[] = [];
  creditsSubscription:Subscription;
  ngOnInit() {
    this.creditsSubscription = this.stormwater.credits.subscribe(credits => this.credits = credits);
  }
  ngOnDestroy() {
    if (this.creditsSubscription) {
      this.creditsSubscription.unsubscribe();
      this.creditsSubscription = null;

    }
  }
  delete() {
    let confirm = this.dialog.open(DialogComponent, {data: {title: 'Confirm', message:'This will delete the credit for this account, would you like to continue?', yesno: true}});
    confirm.afterClosed().subscribe((confirmed:boolean) => {
      if (confirmed) {
        let deletes = [this.credits[0].OBJECTID];
        this.stormwater.applyEdits(4, null, null, deletes).subscribe(result => {
          this.stormwater.credits.next([]);
          this.stormwater.account.getValue().CreditedImpervious = 0;
          this.stormwater.account.getValue().BillableImpervious = this.stormwater.account.getValue().TotalImpervious - 0;          
          this.stormwater.applyEdits(2, null, [{attributes: this.stormwater.account.getValue()} as __esri.Graphic]).subscribe(result => {
            this.stormwater.accountListSelected.next(this.stormwater.account.getValue()); 
          });
        });
      }
    });
  }

  update() {
    let credits = this.stormwater.credits.getValue();
    let account = this.stormwater.account.getValue();    

    if (credits.length > 0) {
      this.credit = credits[0];
    } else {
      this.credit = new Credit(account.AccountId, moment().unix() * 1000, moment('2030-07-01').unix() * 1000 , moment().unix() * 1000, '', 0, 0, 0, 0, 0);
    }
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Update Credit', credit: this.credit}});
    ref.afterClosed().subscribe((data:Credit) => {
      if (data) {
        let feature = new Feature(data, null);
        let updates = [];
        let adds = [];
        if (feature.attributes.OBJECTID) {
          updates.push(feature);
        } else {
          adds.push(feature);
        }
        this.stormwater.applyEdits(4, adds , updates, null).subscribe(result => {
          if(result.updateResults.length > 0) {
            if (result.updateResults[0].success) {
              credits.push(this.credit);
              this.stormwater.credits.next(credits);
            }
          }
          if(result.addResults.length > 0) {
            if (result.addResults[0].success) {
              credits.push(this.credit);
              this.stormwater.credits.next(credits);
            }
          }     
          this.stormwater.accountListSelected.next(account);   
        });
      }
    });
  }
}
