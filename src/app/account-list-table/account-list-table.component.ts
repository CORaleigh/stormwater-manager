import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { AccountListTableDataSource } from './account-list-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-list-table',
  templateUrl: './account-list-table.component.html',
  styleUrls: ['./account-list-table.component.css'],
})

export class AccountListTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private stormwater:StormwaterService){};
  dataSource: AccountListTableDataSource;
  displayedColumns = ['select','SiteAddress', 'RealEstateId', 'AccountId', 'Status', 'TotalImpervious', 'ApportionmentUnits'];
  selection = new SelectionModel<any>(false, []);  
  accountListSubscription: Subscription;
    
  ngOnInit() {
    this.dataSource = new AccountListTableDataSource(this.paginator, this.sort, []);
    this.accountListSubscription = this.stormwater.accountList.subscribe(data => {
      this.dataSource = new AccountListTableDataSource(this.paginator, this.sort, data);
    })
  }
  ngOnDestroy() {
    if (this.accountListSubscription) {
      this.accountListSubscription.unsubscribe();
      this.accountListSubscription = null;

    }
  }
  rowClicked(row) {
    this.stormwater.accountListSelected.next(row);
  };
}
