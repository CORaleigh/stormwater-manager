import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
      (imp: Impervious) => {
        return {
          // 1. Keep your main columns
          EffectiveDate: imp.EffectiveDate ?? 0,
          TotalImpervious: imp.TotalImpervious ?? 0,
          MethodUsed: imp.MethodUsed ?? '',
          MethodDate: imp.MethodDate ?? 0,
          Status: imp.Status ?? '',

          // 2. EXPLICITLY PASS THE POPULATED DETAILS!
          BuildingImpervious: imp.BuildingImpervious ?? 0,
          RoadTrailImpervious: imp.RoadTrailImpervious ?? 0,
          ParkingImpervious: imp.ParkingImpervious ?? 0,
          RecreationImpervious: imp.RecreationImpervious ?? 0,
          MiscImpervious: imp.MiscImpervious ?? 0,
          PermittedImpervious: imp.PermittedImpervious ?? 0,
          PermitNumber: imp.PermitNumber ?? ''
        } as ImperviousTableItem;
      },
    );

    // Reconstruct your custom data source helper class with the full payload objects
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
