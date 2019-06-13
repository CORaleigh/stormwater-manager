import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { BillingServiceTableDataSource } from './billing-service-table-datasource';
import { BillService } from '../bill-service';

@Component({
  selector: 'app-billing-service-table',
  templateUrl: './billing-service-table.component.html',
  styleUrls: ['./billing-service-table.component.css'],
})
export class BillingServiceTableComponent implements OnInit {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  dataSource: BillingServiceTableDataSource;
  
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
