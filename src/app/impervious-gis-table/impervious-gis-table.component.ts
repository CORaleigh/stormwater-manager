import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ImperviousGisTableDataSource } from './impervious-gis-table-datasource';
import { StormwaterService } from '../stormwater.service';

@Component({
  selector: 'app-impervious-gis-table',
  templateUrl: './impervious-gis-table.component.html',
  styleUrls: ['./impervious-gis-table.component.css'],
})
export class ImperviousGisTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ImperviousGisTableDataSource;
  total:number = 0;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['category', 'area', 'updated'];
  constructor(private stormwater:StormwaterService) {}
  getTotal() {
    return this.dataSource.data.map(t => t.area).reduce((acc, value) => acc + value, 0);
  }
  ngOnInit() {
    this.dataSource = new ImperviousGisTableDataSource( []);
    
    this.stormwater.gisscan.subscribe(gisscan => {
      
        
        this.dataSource = new ImperviousGisTableDataSource(gisscan);
        this.total = 0;
        gisscan.forEach(item => {
          this.total += item
        });
    })  }
}
