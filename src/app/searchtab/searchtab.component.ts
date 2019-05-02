import { Component, OnInit, wtfLeave } from '@angular/core';
import { BillingService } from '../billing-service';
import { StormwaterService } from '../stormwater.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-searchtab',
  templateUrl: './searchtab.component.html',
  styleUrls: ['./searchtab.component.css']
})

export class SearchtabComponent implements OnInit {
  constructor(private billing:BillingService, private stormwater:StormwaterService) { }
  accountList: any[] = [];
  ngOnInit() {
    this.stormwater.accountList.subscribe(data => {
      this.accountList = data;
    });
  }
}
