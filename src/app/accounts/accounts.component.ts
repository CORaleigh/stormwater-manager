import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Account } from '../account';
import { StormwaterService } from '../stormwater.service';
import { Parcel } from '../parcel';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Feature } from '../feature';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AccountsComponent implements OnInit, OnDestroy {

  constructor(private stormwater:StormwaterService, public dialog: MatDialog) { }
  account:Account | null = null;
  accounts:Account[] = [];
  parcel:Parcel | null = null;
  selectedAccount:Account | null = null;
  accountSubscription: Subscription | null = null;
  parcelSubscription: Subscription | null = null;

  ngOnInit() {
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      if (account) {
        this.accounts = this.stormwater.accounts.getValue();
        this.account = account;
        this.selectedAccount = this.accounts[0];
      }

    });
    this.parcelSubscription = this.stormwater.parcel.subscribe(parcel => {
      
      this.parcel = parcel;
    });
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;

    }
    if (this.parcelSubscription) {
      this.parcelSubscription.unsubscribe();
      this.parcelSubscription = null;

    }  
  }

  getDomain(code: any, field: any, id: any):string {
    
    return this.stormwater.checkDomain(id, field, null, code);
  }

  statusChanged(event: any) {
    this.stormwater.account.next(event.value);
  }

  update() {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Update Account'}});
    ref.afterClosed().subscribe((account:Account) => {
      if (account) {        
        this.stormwater.applyEdits(2, undefined, [new Feature(account)], undefined).subscribe(result => {
          if (result.updateResults.length > 0) {
            if (result.updateResults[0].success) {
              this.stormwater.account.next(account);
              this.stormwater.accountListSelected.next(account);
            }
          }
        });
      }
    });
  }

  sendToCCB() {
    if (!this.account) return;
    this.account.CCBUpdateFlag = 'Y';
    this.stormwater.applyEdits(2, undefined, [new Feature(this.account)], undefined).subscribe(result => {
      if (result.updateResults.length > 0) {
        if (result.updateResults[0].success) {
          this.stormwater.account.next(this.account);
        }
      }
    });
  }
}
