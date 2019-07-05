import { Component, OnInit, OnDestroy } from '@angular/core';
import { BillingService } from '../billing-service';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-searchtab',
  templateUrl: './searchtab.component.html',
  styleUrls: ['./searchtab.component.css']
})

export class SearchtabComponent implements OnInit, OnDestroy {
  constructor(private billing:BillingService, private stormwater:StormwaterService) { }
  accountList: any[] = [];
  accountListSubscription:Subscription;
  ngOnInit() {
    this.accountListSubscription = this.stormwater.accountList.subscribe(data => {
      this.accountList = data;
    });
  }
  ngOnDestroy() {
    if (this.accountListSubscription) {
      this.accountListSubscription.unsubscribe();
      this.accountListSubscription = null;

    }
  }
}
