import { Component, OnInit, OnDestroy } from '@angular/core';
import { BillingService } from '../billing-service';
import { StormwaterService } from '../stormwater.service';
import { BillingInfo } from '../billing-info';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.css'],
    standalone: false
})
export class BillingComponent implements OnInit, OnDestroy {

  constructor(private stormwater:StormwaterService,private billing:BillingService) { }
  billingInfo:BillingInfo;
  accountSubscription: Subscription;

  ngOnInit() {
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      if (account) {
        this.billingInfo = null;
        this.billing.getBillingData(account).then(info => {
          
          this.billingInfo = info;
        })
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
