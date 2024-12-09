import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { JournalsTableDataSource } from './journals-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-journals-table',
    templateUrl: './journals-table.component.html',
    styleUrls: ['./journals-table.component.css'],
    standalone: false
})
export class JournalsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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
