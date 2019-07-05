import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { LogsTableDataSource } from './logs-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrls: ['./logs-table.component.css'],
})
export class LogsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  dataSource: LogsTableDataSource;
  constructor(private stormwater:StormwaterService){}
  displayedColumns = ['created_date', 'created_user', 'LogEntry'];
  logsSubscription:Subscription;

  ngOnInit() {
    this.dataSource = new LogsTableDataSource(this.paginator, this.sort, []);
    this.logsSubscription = this.stormwater.logs.subscribe(logs => {
      if (logs) {
        this.dataSource = new LogsTableDataSource(this.paginator, this.sort, logs);
      }
    });    
  }
  ngOnDestroy() {
    if (this.logsSubscription) {
      this.logsSubscription.unsubscribe();
      this.logsSubscription = null;
    }  
  }
}
