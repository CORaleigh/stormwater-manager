import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Impervious } from '../impervious';
import moment from 'moment';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY'
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
    selector: 'app-impervious-update-form',
    templateUrl: './impervious-update-form.component.html',
    styleUrls: ['./impervious-update-form.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    standalone: false
})
export class ImperviousUpdateFormComponent implements OnInit {
  @Input() impervious: Impervious;
  @Output() submitted = new EventEmitter<Impervious>();

  form = this.fb.group({
    BuildingImpervious: [null, Validators.required],
    ParkingImpervious: [null, Validators.required],
    RoadTrailImpervious: [null, Validators.required],
    RecreationImpervious: [null, Validators.required],
    MiscImpervious: [null, Validators.required],
    OtherImpervious: [null, Validators.required],
    PermittedImpervious: [null, Validators.required],
    EffectiveDate: [null, Validators.required],
    MethodDate: [null, Validators.required]
  });

  effectiveDate = new UntypedFormControl(moment());
  methodDate = new UntypedFormControl(moment());

  constructor(private fb: UntypedFormBuilder) {}
  ngOnInit() {
    if (this.impervious) {
      this.form.get('BuildingImpervious').setValue(this.impervious.BuildingImpervious);
      this.form.get('ParkingImpervious').setValue(this.impervious.ParkingImpervious);
      this.form.get('RoadTrailImpervious').setValue(this.impervious.RoadTrailImpervious);
      this.form.get('RecreationImpervious').setValue(this.impervious.RecreationImpervious);
      this.form.get('MiscImpervious').setValue(this.impervious.MiscImpervious);
      this.form.get('OtherImpervious').setValue(this.impervious.OtherImpervious);
      this.form.get('PermittedImpervious').setValue(this.impervious.PermittedImpervious);
    }
  }
  onSubmit() {
    this.impervious.BuildingImpervious = this.form.get('BuildingImpervious').value;
    this.impervious.ParkingImpervious = this.form.get('ParkingImpervious').value;
    this.impervious.RoadTrailImpervious = this.form.get('RoadTrailImpervious').value;
    this.impervious.RecreationImpervious = this.form.get('RecreationImpervious').value;
    this.impervious.MiscImpervious = this.form.get('MiscImpervious').value;
    this.impervious.OtherImpervious = this.form.get('OtherImpervious').value;
    this.impervious.PermittedImpervious = this.form.get('PermittedImpervious').value;
    this.impervious.EffectiveDate = this.effectiveDate.value.unix() * 1000;
    this.impervious.MethodDate = this.methodDate.value.unix() * 1000;
    this.submitted.emit(this.impervious);
  }
}
