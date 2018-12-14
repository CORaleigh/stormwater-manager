import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface AccountListTableItem {
  SiteAddress: string;
  RealEstateId: string;
  AccountId: number;
  Status: string;
  TotalImpervious: number;
  ApportionmentUnits: number;
}


/**
 * Data source for the AccountListTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AccountListTableDataSource extends DataSource<AccountListTableItem> {

  constructor(private paginator: MatPaginator, private sort: MatSort, public data: AccountListTableItem[]) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AccountListTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginator's length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: AccountListTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: AccountListTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'SiteAddress': return compare(a.SiteAddress, b.SiteAddress, isAsc);
        case 'RealEstateId': return compare(a.RealEstateId, b.RealEstateId, isAsc);
        case 'AccountId': return compare(a.AccountId, b.AccountId, isAsc);
        case 'Status': return compare(a.Status, b.Status, isAsc);
        case 'TotalImpervious': return compare(a.TotalImpervious, b.TotalImpervious, isAsc);
        case 'ApportionmentUnits': return compare(a.ApportionmentUnits, b.ApportionmentUnits, isAsc);                
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
