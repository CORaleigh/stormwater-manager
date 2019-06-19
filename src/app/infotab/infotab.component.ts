import { Component, OnInit } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';

@Component({
  selector: 'app-infotab',
  templateUrl: './infotab.component.html',
  styleUrls: ['./infotab.component.css']
})
export class InfotabComponent implements OnInit {
  constructor(private stormwater:StormwaterService) { }
  account:Account = null;
  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }
}
