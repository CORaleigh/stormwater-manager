import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LogsTableDataSource } from './logs-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-logs-table',
    templateUrl: './logs-table.component.html',
    styleUrls: ['./logs-table.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LogsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;
  dataSource: LogsTableDataSource| null = null;
  constructor(private stormwater:StormwaterService){}
  displayedColumns = ['created_date', 'created_user', 'LogEntry'];
  logsSubscription:Subscription| null = null;

  ngOnInit() {
    if (!this.paginator || !this.sort) return;
    this.dataSource = new LogsTableDataSource(this.paginator, this.sort, []);
    this.logsSubscription = this.stormwater.logs.subscribe(logs => {
      if (logs && this.paginator && this.sort) {
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
