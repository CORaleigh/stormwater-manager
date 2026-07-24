import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
import { StormwaterService } from "../stormwater.service";
import { Impervious } from "../impervious";
import { Account } from "../account";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../dialog/dialog.component";
import { Feature } from "../feature";
import { Subscription } from "rxjs";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "app-impervious",
  templateUrl: "./impervious.component.html",
  styleUrls: ["./impervious.component.css"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ImperviousComponent implements OnInit, OnDestroy {
  constructor(
    private stormwater: StormwaterService,
    public dialog: MatDialog,
  ) {}
  impervious: Impervious[] = [];
  account: Account | null = null;
  apportionedTo: Feature[] = [];
  selectedIndex: number = 0;
  imperviousSubscription: Subscription | null = null;
  accountSubscription: Subscription | null = null;
  indexChanged(event: any) {
    
    // 1. Always update the active index first so the UI stays synchronized
    this.selectedIndex = event;

    // 2. Run your specific side-effect logic strictly when conditions match
    
    if (this.account && event === 1) {
      this.stormwater.gisScanSelected.next(this.account.RealEstateId);
    }
  }
  ngOnInit() {
    this.imperviousSubscription = this.stormwater.impervious.subscribe(
      (impervious) => {
        this.impervious = impervious;
      },
    );
    this.accountSubscription = this.stormwater.account.subscribe((account) => {
      this.account = account;
      this.apportionedTo = [];
      if (this.account && this.account.PremiseId) {
        this.stormwater
          .checkApportioned(5, this.account.PremiseId.toString())
          .subscribe((result) => {
            if (result.features.length > 0) {
              this.apportionedTo = result.features;
            }
          });
      }
      if (this.selectedIndex === 1 && this.account) {
        this.stormwater.gisScanSelected.next(this.account.RealEstateId);
      }
    });
  }
  ngOnDestroy() {
    if (this.imperviousSubscription) {
      this.imperviousSubscription.unsubscribe();
      this.imperviousSubscription = null;
    }
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;
    }
  }

  apportionedToClicked() {
    this.stormwater.apportionedToClicked.next(this.apportionedTo);
  }

  updateClicked() {
    let data: Impervious | null = null;
    let i = this.impervious.filter((item) => {
      return (item as Impervious).Status === "C";
    });
    if (i.length > 0) {
      let record = i[0];
      data = new Impervious(
        record.AccountId,
        record.TotalImpervious as number,
        record.BuildingImpervious,
        record.MiscImpervious,
        record.OtherImpervious,
        record.RecreationImpervious,
        record.RoadTrailImpervious,
        record.ParkingImpervious,
        record.PermittedImpervious,
        record.MethodUsed,
        record.MethodDate,
        record.EffectiveDate,
        record.Status,
        record.ImperviousId,
        record.created_user,
        record.created_date,
        record.last_edited_user,
        record.last_edited_date,
        record.OBJECTID,
        record.GlobalId,
      );
    }
    if (!data && this.account) {
      data = new Impervious(this.account.AccountId, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    if (data) {
      data.MethodUsed = "MANUAL";
      data.Status = "P";
      let ref = this.dialog.open(DialogComponent, {
        data: { title: "Update Impervious", impervious: data },
      });
      ref.afterClosed().subscribe((data: Impervious) => {
        if (data) {
          data.TotalImpervious =
            data.BuildingImpervious +
            data.ParkingImpervious +
            data.RoadTrailImpervious +
            data.RecreationImpervious +
            data.MiscImpervious +
            data.OtherImpervious +
            data.PermittedImpervious;
          let feature = new Feature(data, null);
          this.stormwater
            .applyEdits(3, [feature], undefined, undefined)
            .subscribe((result) => {
              if (result.addResults) {
                if (result.addResults[0].success) {
                  this.impervious.push(data);
                  this.stormwater.impervious.next(this.impervious);
                }
              }
            });
        }
      });
    }
  }
}
