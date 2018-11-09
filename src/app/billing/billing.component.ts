import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing-service';
import { StormwaterService } from '../stormwater.service';
import { BillingInfo } from '../billing-info';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {

  constructor(private stormwater:StormwaterService,private billing:BillingService) { }
  billingInfo:BillingInfo;
  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      this.billingInfo = null;
      this.billing.getBillingData(account).then(info => {
        this.billingInfo = info;
      })
    });
  }

}
