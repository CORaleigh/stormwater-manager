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
  apportionments: Apportionment[] = [];
  ngOnInit() {
    this.stormwater.impervious.subscribe(impervious => {
      this.impervious = impervious;
    });
    this.stormwater.account.subscribe(account => {
      this.account = account;
    });    
    this.stormwater.apportionments.subscribe(apportionments => {
      this.apportionments = apportionments;
    });    
  }

  updateClicked() {
    let data:Impervious = null;
    let i = this.impervious.filter(item => {
      return (item as Impervious).Status === 'C';
    });
    if (i.length > 0) {
      data = i[0];
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
