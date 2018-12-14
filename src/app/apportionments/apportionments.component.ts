import { Component, OnInit } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';
import { Apportionment } from '../apportionment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-apportionments',
  templateUrl: './apportionments.component.html',
  styleUrls: ['./apportionments.component.css']
})
export class ApportionmentsComponent implements OnInit {

  constructor(private stormwater: StormwaterService, public dialog: MatDialog) { }
  account:Account = null;
  apportionments:Apportionment[] = [];

  ngOnInit() {
    this.stormwater.apportionments.subscribe(apportionments => {
      this.apportionments = apportionments;
    });
    this.stormwater.account.subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  apportionmentSelected(apportionment) {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Apportion', mode:'update', apportionment:apportionment}});

  }
  apportion() {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Apportion', mode:'add', apportionment: null}});

  }


}
