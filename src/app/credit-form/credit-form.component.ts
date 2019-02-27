import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA} from '@angular/material';
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
    ControlledAcreage: [null, Validators.compose([
      Validators.required, Validators.min(0)])
    ],
    NpdesPercentage: [null, Validators.compose([
      Validators.required, Validators.min(0), Validators.max(100)])
    ],
    UpstreamCode: [null, Validators.required],
    OnSiteCode: [null, Validators.required]
  });
  @Input() credit: Credit;
  @Input() mode: string;
  @Output() submitted = new EventEmitter<Credit>();


  inceptionDate = new FormControl(new Date());
  approvalDate = new FormControl(new Date());
 
  oCodes:any = null;
  uCodes:any = null;
  constructor(private fb: FormBuilder, private stormwater:StormwaterService) {}
  dateChanged(event) {
    console.log(event);
  }
  ngOnInit() {
    if (this.credit) {
      this.oCodes = this.stormwater.getDomain(3, 'OnSiteCode');    
      this.uCodes = this.stormwater.getDomain(3, 'UpstreamCode');    

      this.form.get('ControlledSurface').setValue(this.credit.ControlledSurface);
      this.form.get('ControlledAcreage').setValue(this.credit.ControlledAcreage);
      this.form.get('NpdesPercentage').setValue(this.credit.NpdesPercentage);
      this.form.get('UpstreamCode').setValue(this.credit.UpstreamCode);
      this.form.get('OnSiteCode').setValue(this.credit.OnSiteCode);
      this.approvalDate.setValue(new Date(this.credit.ApprovalDate));
      this.inceptionDate.setValue(new Date(this.credit.InceptionDate));
      


    }
  }
  onSubmit() {
    this.credit.ControlledSurface = this.form.get('ControlledSurface').value;
    this.credit.ControlledAcreage = this.form.get('ControlledAcreage').value;
    this.credit.NpdesPercentage = this.form.get('NpdesPercentage').value;
    this.credit.UpstreamCode = this.form.get('UpstreamCode').value;
    this.credit.OnSiteCode = this.form.get('OnSiteCode').value;
    this.credit.ApprovalDate = this.approvalDate.value.unix() * 1000;
    this.credit.InceptionDate = this.inceptionDate.value.unix() * 1000;
    this.submitted.emit(this.credit);
  }
}
