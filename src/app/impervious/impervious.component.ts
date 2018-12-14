import { Component, OnInit } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { Impervious } from '../impervious';
import { Account } from '../account';
import { Apportionment } from '../apportionment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Feature } from '../feature';

@Component({
  selector: 'app-impervious',
  templateUrl: './impervious.component.html',
  styleUrls: ['./impervious.component.css']
})
export class ImperviousComponent implements OnInit {

  constructor(private stormwater: StormwaterService, public dialog: MatDialog) { }
  impervious: Impervious[] = [];
  account: Account = null;
  apportionedTo:Feature[] = [];
  ngOnInit() {
    this.stormwater.impervious.subscribe(impervious => {
      this.impervious = impervious;
    });
    this.stormwater.account.subscribe(account => {
      this.account = account;
      this.apportionedTo = [];
      if (this.account.PremiseId) {
        this.stormwater.checkApportioned(4,this.account.PremiseId.toString()).subscribe(result => {
          if (result.features.length > 0) {
              this.apportionedTo = result.features;

            }
        });
      }      
    });    


  }

  apportionedToClicked() {
    this.stormwater.apportionedToClicked.next(this.apportionedTo);
  }

  updateClicked() {
    let data:Impervious = null;
    let i = this.impervious.filter(item => {
      return (item as Impervious).Status === 'C';
    });
    if (i.length > 0) {
      let record = i[0];
      data = new Impervious(record.AccountId, record.TotalImpervious, record.Building,record.MiscImpervious,record.OtherImpervious, record.RecreationImpervious, record.RoadTrailImpervious, record.ParkingImpervious, record.PermittedImpervious, record.MethodUsed, record.MethodDate, record.EffectiveDate, record.Status, record.ImperviousId, record.created_user, record.created_date, record.last_edited_user, record.last_edited_date, record.OBJECTID, record.GlobalId);
    
    }
    if (!data) {
      data = new Impervious(this.account.AccountId, 0,0,0,0,0,0,0,0);
    } 
    data.MethodUsed = 'MANUAL';
    data.Status = 'P';
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Update Impervious', impervious: data}});
    ref.afterClosed().subscribe((data:Impervious) => {
      let feature = new Feature(data, null);
      this.stormwater.applyEdits(2, [feature], null, null).subscribe(result => {
        if(result.addResults) {
          if (result.addResults[0].success) {
            data.TotalImpervious = data.Building + data.ParkingImpervious + data.RoadTrailImpervious + data.RecreationImpervious + data.MiscImpervious + data.OtherImpervious + data.PermittedImpervious;
            this.impervious.push(data);
            this.stormwater.impervious.next(this.impervious);
          }
        }
      });
    });

  }

}