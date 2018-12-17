import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StormwaterService } from '../stormwater.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor(overlayContainer: OverlayContainer, private stormwater:StormwaterService) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }
  selectedIndex:number= 0;
  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      if (account) {
        this.selectedIndex = 0;

        let el = document.getElementById('tabGroup');
        if (el) {
          el.scrollIntoView();

        }
     
      }
    });
    this.stormwater.accountList.subscribe(result => {
      if (result) {
        if (result.length > 0) {
          this.selectedIndex = 1;
        }
      }
    })
  }

}
