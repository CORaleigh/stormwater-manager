import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ImperviousGisTableDataSource } from './impervious-gis-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-impervious-gis-table',
  templateUrl: './impervious-gis-table.component.html',
  styleUrls: ['./impervious-gis-table.component.css'],
})
export class ImperviousGisTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: ImperviousGisTableDataSource;
  total:number = 0;
  displayedColumns = ['category', 'area', 'updated'];
  gisscanSubscription:Subscription;
  constructor(private stormwater:StormwaterService) {}
  getTotal() {
    return this.dataSource.data.map(t => t.area).reduce((acc, value) => acc + value, 0);
  }
  ngOnInit() {
    this.dataSource = new ImperviousGisTableDataSource([]);    
    this.gisscanSubscription = this.stormwater.gisscan.subscribe(gisscan => {
        this.dataSource = new ImperviousGisTableDataSource(gisscan);
        this.total = 0;
        gisscan.forEach(item => {
          this.total += item
        });
    })  
  }
  ngOnDestroy() {
    if (this.gisscanSubscription) {
      this.gisscanSubscription.unsubscribe();
      this.gisscanSubscription = null;

    }
  }
}
