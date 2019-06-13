import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { AccountListTableDataSource } from './account-list-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-account-list-table',
  templateUrl: './account-list-table.component.html',
  styleUrls: ['./account-list-table.component.css'],
})
export class AccountListTableComponent implements OnInit {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  constructor(private stormwater:StormwaterService){};
  dataSource: AccountListTableDataSource;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select','SiteAddress', 'RealEstateId', 'AccountId', 'Status', 'TotalImpervious', 'ApportionmentUnits'];
  selection = new SelectionModel<any>(false, []);    

  ngOnInit() {

    this.dataSource = new AccountListTableDataSource(this.paginator, this.sort, []);
    this.stormwater.accountList.subscribe(data => {
      this.dataSource = new AccountListTableDataSource(this.paginator, this.sort, data);
    })
  }

  rowClicked(row) {
    this.stormwater.accountListSelected.next(row);
  };
}
