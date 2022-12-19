import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import * as moment from 'moment';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Credit } from '../credit';
import { StormwaterService } from '../stormwater.service';
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
  selector: 'app-credit-form',
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]    
})
export class CreditFormComponent implements OnInit {
  form = this.fb.group({
    ControlledSurface: [null, Validators.compose([
      Validators.required, Validators.min(0)])
    ],
    NpdesPercentage: [null, Validators.compose([
      Validators.required, Validators.min(0), Validators.max(50)])
    ],
    UpstreamPercentage: [null, Validators.required],
    OnsitePercentage: [null, Validators.required]
  });
  @Input() credit: Credit;
  @Input() mode: string;
  @Output() submitted = new EventEmitter<Credit>();
  inceptionDate = new UntypedFormControl(moment());
  approvalDate = new UntypedFormControl(moment());
  oCodes:any = null;
  uCodes:any = null;
  constructor(private fb: UntypedFormBuilder, private stormwater:StormwaterService) {}
  dateChanged(event) {
    console.log(event);
  }
  ngOnInit() {
    if (this.credit) {
      this.oCodes = this.stormwater.getDomain(4, 'OnsitePercentage');    
      this.uCodes = this.stormwater.getDomain(4, 'UpstreamPercentage');  
      this.form.get('ControlledSurface').setValue(this.credit.ControlledSurface);
      this.form.get('NpdesPercentage').setValue(this.credit.NpdesPercentage * 100);
      this.form.get('UpstreamPercentage').setValue(this.credit.UpstreamPercentage);
      this.form.get('OnsitePercentage').setValue(this.credit.OnsitePercentage);
      this.approvalDate.setValue(moment(new Date(this.credit.ApprovalDate)));
      this.inceptionDate.setValue(moment(new Date(this.credit.InceptionDate)));
    }
  }
  onSubmit() {
    this.credit.ControlledSurface = this.form.get('ControlledSurface').value;
    this.credit.NpdesPercentage = this.form.get('NpdesPercentage').value/100;
    this.credit.UpstreamPercentage = this.form.get('UpstreamPercentage').value;
    this.credit.OnsitePercentage = this.form.get('OnsitePercentage').value;
    this.credit.ApprovalDate = this.approvalDate.value.unix() * 1000;
    this.credit.InceptionDate = this.inceptionDate.value.unix() * 1000;
    this.submitted.emit(this.credit);
  }
}
