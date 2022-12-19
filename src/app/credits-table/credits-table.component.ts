import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { CreditsTableDataSource } from './credits-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-credits-table',
  templateUrl: './credits-table.component.html',
  styleUrls: ['./credits-table.component.css'],
})
export class CreditsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: CreditsTableDataSource;
  constructor(public stormwater:StormwaterService){}
  displayedColumns = ['field', 'value'];
  creditsSubscription:Subscription;

  ngOnInit() {
    this.dataSource = new CreditsTableDataSource([]);
    this.creditsSubscription = this.stormwater.credits.subscribe(credits => {
      if(credits.length > 0) {
        let credit = credits[0];
        let attributes = [
          {field: 'Controlled Surface', value: credit.ControlledSurface ? credit.ControlledSurface: 0, type: 'area'},
          {field: 'NPDES MS4 Permit /GI/LID/Other (Percentage not to exceed 50%)', value: credit.NpdesPercentage ? credit.NpdesPercentage : 0, type:'percent'},
          {field: 'On Site Credits', value: this.stormwater.checkDomain(4,'OnsitePercentage', null, credit.OnsitePercentage)},
          {field: 'Upstream Credits', value: this.stormwater.checkDomain(4 ,'UpstreamPercentage',null, credit.UpstreamPercentage)},
          {field: 'Inception Date', value: credit.InceptionDate, type: 'date'},
          {field: 'Expires', value: credit.ExpirationDate, type: 'date'},
          {field: 'Approved', value: credit.ApprovalDate, type: 'date'},
          {field: 'Comments', value: credit.Comment}          
        ];
        this.dataSource = new CreditsTableDataSource(attributes);
      } else {
        this.dataSource = new CreditsTableDataSource([]);
      }
    });
  }
  ngOnDestroy() {
    if (this.creditsSubscription) {
      this.creditsSubscription.unsubscribe();
      this.creditsSubscription = null;

    }
  }
}
