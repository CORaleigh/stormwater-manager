import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { LogsTableDataSource } from './logs-table-datasource';
import { StormwaterService } from '../stormwater.service';

@Component({
  selector: 'app-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrls: ['./logs-table.component.css'],
})
export class LogsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: LogsTableDataSource;
  constructor(private stormwater:StormwaterService){}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created_date', 'created_user', 'LogEntry'];

  ngOnInit() {
    this.dataSource = new LogsTableDataSource(this.paginator, this.sort, []);
    this.stormwater.logs.subscribe(logs => {
      if (logs) {
        this.dataSource = new LogsTableDataSource(this.paginator, this.sort, logs);
      }
    });    
  }
}
