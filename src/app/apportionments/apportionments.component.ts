import { Component, OnInit, OnDestroy } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';
import { Apportionment } from '../apportionment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apportionments',
  templateUrl: './apportionments.component.html',
  styleUrls: ['./apportionments.component.css']
})
export class ApportionmentsComponent implements OnInit, OnDestroy {

  constructor(private stormwater: StormwaterService, public dialog: MatDialog) { }
  account:Account = null;
  apportionments:Apportionment[] = [];
  accountSubscription:Subscription;
  apportionmentsSubscription:Subscription;

  ngOnInit() {
    this.accountSubscription = this.stormwater.apportionments.subscribe(apportionments => {
      this.apportionments = apportionments;
    });
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }
  ngOnDestroy() {
    if (this.apportionmentsSubscription) {
      this.apportionmentsSubscription.unsubscribe();
      this.apportionmentsSubscription = null;
    }
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;
    }
  }

  apportionmentSelected(apportionment) {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Apportion', mode:'update', apportionment:apportionment}});
    ref.afterClosed().subscribe((data:any) => {
      this.stormwater.accountListSelected.next(this.account);   
    });
  }
  apportion() {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Apportion', mode:'add', apportionment: null}});
    ref.afterClosed().subscribe((data:any) => {
      this.stormwater.accountListSelected.next(this.account);   
    });
  }
}
