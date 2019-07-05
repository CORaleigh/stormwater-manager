import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { JournalsTableDataSource } from './journals-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-journals-table',
  templateUrl: './journals-table.component.html',
  styleUrls: ['./journals-table.component.css'],
})
export class JournalsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  dataSource: JournalsTableDataSource;
  constructor(private stormwater:StormwaterService){}
  displayedColumns = ['created_date', 'created_user',  'JournalEntry'];
  journalsSubscription:Subscription;
  ngOnInit() {
    this.dataSource = new JournalsTableDataSource(this.paginator, this.sort, []);
    this.journalsSubscription = this.stormwater.journals.subscribe(journals => {
      if (journals) {
        this.dataSource = new JournalsTableDataSource(this.paginator, this.sort, journals);
      }
    });
  }
  ngOnDestroy() {
    if (this.journalsSubscription) {
      this.journalsSubscription.unsubscribe();
      this.journalsSubscription = null;
    }
  }
}
