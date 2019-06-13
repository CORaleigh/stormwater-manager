import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { CreditsTableDataSource } from './credits-table-datasource';
import { StormwaterService } from '../stormwater.service';

@Component({
  selector: 'app-credits-table',
  templateUrl: './credits-table.component.html',
  styleUrls: ['./credits-table.component.css'],
})
export class CreditsTableComponent implements OnInit {
  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  @ViewChild(MatSort,null) sort: MatSort;
  dataSource: CreditsTableDataSource;
  constructor(public stormwater:StormwaterService){}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['field', 'value'];

  ngOnInit() {
    this.dataSource = new CreditsTableDataSource([]);
    this.stormwater.credits.subscribe(credits => {
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
}
