import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillingServiceTableDataSource } from './billing-service-table-datasource';
import { BillService } from '../bill-service';

@Component({
    selector: 'app-billing-service-table',
    templateUrl: './billing-service-table.component.html',
    styleUrls: ['./billing-service-table.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BillingServiceTableComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort | null = null;
  dataSource: BillingServiceTableDataSource | null = null;
  
  @Input('services') 
  set services(services:BillService[]) {
    window.setTimeout(() => {this.dataSource = new BillingServiceTableDataSource(services);}, 100)
    
  };
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['servicePointId', 'spTypeCd', 'spStatusFlag', 'spSourceStatusFlag', 'installDate'];

  ngOnInit() {

    this.dataSource = new BillingServiceTableDataSource([]);
  }
}
