import { Component, OnInit, OnDestroy } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-infotab',
    templateUrl: './infotab.component.html',
    styleUrls: ['./infotab.component.css'],
    standalone: false
})
export class InfotabComponent implements OnInit, OnDestroy {
  constructor(private stormwater:StormwaterService) { }
  account:Account = null;
  accountSubscription:Subscription;

  ngOnInit() {
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      if (account) {
        this.account = account;
      } else {
        this.account = null;
      }
    });
  }
  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;
    }
  }
}
