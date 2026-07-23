import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
  ImperviousTableDataSource,
  ImperviousTableItem,
} from "./impervious-table-datasource";
import { StormwaterService } from "../stormwater.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Impervious } from "../impervious";
import { Subscription } from "rxjs";

@Component({
  selector: "app-impervious-table",
  templateUrl: "./impervious-table.component.html",
  styleUrls: ["./impervious-table.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
      ),
    ]),
  ],
  standalone: false,
})
export class ImperviousTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null =
    null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;
  dataSource: ImperviousTableDataSource | null = null;
  imperviousSubscription: Subscription | null = null;

  constructor(private stormwater: StormwaterService) {}
  displayedColumns = [
    "EffectiveDate",
    "TotalImpervious",
    "MethodUsed",
    "MethodDate",
    "Status",
  ];
  expandedRow: Impervious | null = null;
  rowClick(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  ngOnInit() {
    if (!this.paginator || !this.sort) return;
    this.dataSource = new ImperviousTableDataSource(
      this.paginator,
      this.sort,
      [],
    );
    this.imperviousSubscription = this.stormwater.impervious.subscribe(
      (impervious) => {
        if (!this.paginator || !this.sort) return;
        const imperviousItems: ImperviousTableItem[] = impervious.map(
          (impervious: Impervious) => {
            return {
              EffectiveDate: impervious.EffectiveDate,
              TotalImpervious: impervious.TotalImpervious,
              MethodUsed: impervious.MethodUsed,
              MethodDate: impervious.MethodDate,
              Status: impervious.Status,
            } as ImperviousTableItem;
          },
        );
        this.dataSource = new ImperviousTableDataSource(
          this.paginator,
          this.sort,
          imperviousItems,
        );
      },
    );
  }

  ngOnDestroy() {
    if (this.imperviousSubscription) {
      this.imperviousSubscription.unsubscribe();
      this.imperviousSubscription = null;
    }
  }
}
