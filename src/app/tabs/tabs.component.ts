import { Component, OnInit, OnDestroy } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css'],
    standalone: false
})
export class TabsComponent implements OnInit, OnDestroy {
  constructor(overlayContainer: OverlayContainer, private stormwater:StormwaterService) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }
  selectedIndex:number= 0;
  accountSubscription:Subscription;
  accountListSubscription:Subscription;
  ngOnInit() {
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      if (account) {
        this.selectedIndex = 0;
      }
    });
    this.accountListSubscription = this.stormwater.accountList.subscribe(result => {
      if (result) {
        if (result.length > 0) {
          this.selectedIndex = 1;
        }
      }
    })
  }
  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;
    }
    if (this.accountListSubscription) {
      this.accountListSubscription.unsubscribe();
      this.accountListSubscription = null;

    }
  }
}
