import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { StormwaterService } from '../stormwater.service';
import { Parcel } from '../parcel';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Feature } from '../feature';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  constructor(private stormwater:StormwaterService, public dialog: MatDialog) { }
  account:Account;
  accounts:Account[] = [];
  parcel:Parcel;
  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      this.account = account;
      this.accounts = this.stormwater.accounts.getValue();
    });
    this.stormwater.parcel.subscribe(parcel => {
      
      this.parcel = parcel;
    });
  }

  getDomain(code, field, id):string {
    return this.stormwater.checkDomain(id, field, null, code);
  }

  statusChanged(event) {
    console.log(event);
    this.stormwater.account.next(event.value);
  }

  update() {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Update Account'}});
    ref.afterClosed().subscribe((account:Account) => {
      this.stormwater.applyEdits(2, null, [new Feature(account)], null).subscribe(result => {
        if (result.updateResults.length > 0) {
          if (result.updateResults[0].success) {
            this.stormwater.account.next(account);
            this.stormwater.accountListSelected.next(account);
          }
        }
      });
    });
  }

  sendToCCB() {
    //this.account.CCBUpdateFlag = 'Y';
    this.stormwater.applyEdits(2, null, [new Feature(this.account)], null).subscribe(result => {
      if (result.updateResults.length > 0) {
        if (result.updateResults[0].success) {
          this.stormwater.account.next(this.account);
        }
      }
    });
  }

}
