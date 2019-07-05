import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ImperviousTableDataSource } from './impervious-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Impervious } from '../impervious';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-impervious-table',
  templateUrl: './impervious-table.component.html',
  styleUrls: ['./impervious-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],  
})
export class ImperviousTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  dataSource: ImperviousTableDataSource;
  imperviousSubscription:Subscription;

  constructor(private stormwater:StormwaterService) {}
  displayedColumns = ['EffectiveDate', 'TotalImpervious', 'MethodUsed', 'MethodDate', 'Status'];
  expandedRow: Impervious;
  rowClick(row) {
    this.expandedRow = row;
  }
  ngOnInit() {
    this.dataSource = new ImperviousTableDataSource(this.paginator, this.sort, []);
    this.imperviousSubscription = this.stormwater.impervious.subscribe(impervious => {
      if (impervious.length) {
        this.dataSource = new ImperviousTableDataSource(this.paginator, this.sort, impervious);
      }
    })
  }
  ngOnDestroy() {
    if (this.imperviousSubscription) {
      this.imperviousSubscription.unsubscribe();
      this.imperviousSubscription = null;
    }
  }
}
