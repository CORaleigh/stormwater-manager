import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ApportionmentsTableDataSource } from './apportionments-table-datasource';
import { StormwaterService } from '../stormwater.service';
import { Apportionment } from '../apportionment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apportionments-table',
  templateUrl: './apportionments-table.component.html',
  styleUrls: ['./apportionments-table.component.css'],
})
export class ApportionmentsTableComponent implements OnInit, OnDestroy{
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  @Output() apportionmentSelected: EventEmitter<Apportionment> = new EventEmitter();
  apportionmentsSubscription: Subscription;
  dataSource: ApportionmentsTableDataSource;
  constructor(private stormwater:StormwaterService) {}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns =  ['OBJECTID', 'PremiseId', 'Address', 'PercentApportioned', 'Sfeu', 'Impervious'];
  rowClicked(row) {
    this.apportionmentSelected.emit(row);
  }
  ngOnInit() {
    this.dataSource = new ApportionmentsTableDataSource(this.paginator, this.sort, []);
    this.apportionmentsSubscription = this.stormwater.apportionments.subscribe(apportionments => {
      if (apportionments) {
        this.dataSource = new ApportionmentsTableDataSource(this.paginator, this.sort, apportionments);
      }
    })
  }
  ngOnDestroy() {
    if (this.apportionmentsSubscription) {
      this.apportionmentsSubscription.unsubscribe();
      this.apportionmentsSubscription = null;

    }    
  }
}
