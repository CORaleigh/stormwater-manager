import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { JournalsTableDataSource, JournalsTableItem } from './journals-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-journals-table',
    templateUrl: './journals-table.component.html',
    styleUrls: ['./journals-table.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class JournalsTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;
  dataSource: JournalsTableDataSource | null = null;;
  constructor(private stormwater:StormwaterService){}
  displayedColumns = ['created_date', 'created_user',  'JournalEntry'];
  journalsSubscription:Subscription | null = null;
  ngOnInit() {
    if (!this.paginator || !this.sort) return;
    this.dataSource = new JournalsTableDataSource(this.paginator, this.sort, []);
    this.journalsSubscription = this.stormwater.journals.subscribe(journals => {
      if (journals && this.paginator && this.sort) {
        this.dataSource = new JournalsTableDataSource(this.paginator, this.sort, journals as JournalsTableItem[]);
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
