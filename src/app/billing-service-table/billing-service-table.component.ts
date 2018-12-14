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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: BillingServiceTableDataSource;

  @Input('services') 
  set services(services:BillService[]) {
    
    this.dataSource = new BillingServiceTableDataSource(services);
  };
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['spId', 'spTyp', 'spStatus', 'spSrcStatus', 'installed'];

  ngOnInit() {
    this.dataSource = new BillingServiceTableDataSource([]);
  }
}
