import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable } from '@angular/material';
import { AccountTableDataSource } from './account-table-datasource';
import { StormwaterService } from '../stormwater.service';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.css'],
})
export class AccountTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: AccountTableDataSource;
  constructor(public stormwater:StormwaterService){}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['field', 'value'];

  ngOnInit() {
    this.dataSource = new AccountTableDataSource([]);
    this.stormwater.account.subscribe(account => {
      if (account) {
        let attributes = [
          {field: 'Account ID', value: account.AccountId},
          {field: 'CSA ID', value: account.CsaId},          
          {field: 'Premise ID', value: account.PremiseId},       
          {field: 'Status', value: account.Status},     
          {field: 'SFEU', value: account.Sfeu},
          {field: 'Use Class', value: account.UseClass},
          {field: 'Billing Tier', value: account.BillingTier},          
          // {field: 'Parcel Address', value: this.parcel.SiteAddress},   
          // {field: 'Parcel Owner', value: this.parcel.Owner},       
          // {field: 'REID', value: this.parcel.RealEstateId},
          // {field: 'PIN #', value: this.parcel.PinNum} 
        ]
        this.dataSource = new AccountTableDataSource(attributes);

      }
    });
  }
}
