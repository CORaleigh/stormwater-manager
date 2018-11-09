import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ErrorStateMatcher, MatStepper } from '@angular/material';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { BillingInfo } from '../billing-info';
import { Apportionment } from '../apportionment';
import { Account } from '../account';
import { BillingService } from '../billing-service';
import { StormwaterService } from '../stormwater.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'x',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-apportionment-update-form',
  templateUrl: './apportionment-update-form.component.html',
  styleUrls: ['./apportionment-update-form.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]  
})
export class ApportionmentUpdateFormComponent  {
  expirationDate = new FormControl(moment());
  private _account = null;
  private _apportionment = null;

  @Input() ccbAccount:any;
  @Input() mode: string;
  @Input('stepper') 
  set stepper(stepper:MatStepper) {
    stepper.selectionChange.subscribe(event => {
      let account = this.stormwater.account.getValue();
      this.setRemainingPercent(account, null);
      if (!this._apportionment) {
        this.form.get('Parcent').setValue(0);
        this.expirationDate.setValue(moment().add(10, 'years'));   
      }    
    })
  };
  @Input('apportionment') 
  set apportionment(apportionment:Apportionment) {
    this._apportionment = apportionment;
    if (apportionment) {
      this.form.get('Parcent').setValue(this._apportionment.Parcent);
      this.expirationDate.setValue(moment(this._apportionment.ExpirationDate));   
      this.billing.getBillingInfo(apportionment.PremiseId).subscribe(result => {
        this.ccbAccount = result.Results[0];
        this.ccbAccountSelected.emit(this.ccbAccount);

      });
      let account = this.stormwater.account.getValue();
      this.setRemainingPercent(account, apportionment);      
    }


  }
  @Input('account') 
  set account(account: Account) {
    this._account = account;
    if (account.ApportionmentCode === 'EQUAL') {
      this.form.get('Parcent').disable();
    } else {
      this.form.get('Parcent').enable();
    }
  }
  @Output() ccbAccountSelected = new EventEmitter<any>();
  @Output() submitted = new EventEmitter<Apportionment>();
  @Output() deleted = new EventEmitter<Apportionment>();

  form = this.fb.group({
    Parcent: [null, Validators.compose([
      Validators.required, Validators.min(0), Validators.max(1)])
    ],
    ExpirationDate: [null, null]

  });

  constructor(private fb: FormBuilder, private billing:BillingService, private stormwater:StormwaterService) {}

  setRemainingPercent(account:Account, apportionment:Apportionment) {
    if (account.ApportionmentCode === 'WEIGHTED') {
      let apportionments:Apportionment[] = this.stormwater.apportionments.getValue();
      let remaining = 1;
      apportionments.forEach(a => {
        if (apportionment) {
          if (a.OBJECTID != apportionment.OBJECTID) {
            remaining -= a.Parcent;
          }
        } else {
          remaining -= a.Parcent;
        }

      });
      
      this.form.get('Parcent').setValidators(Validators.max(remaining));       

    }
  }

  checkInvalid() {
    return this.expirationDate.invalid || this.form.get('Parcent').invalid;
  }
  onSubmit() {
    if (this.mode === 'add') {
    this._apportionment = new Apportionment();
    this._apportionment.AccountId = this._account.AccountId;
    this._apportionment.SfeuType = this._account.UseClass;
    this._apportionment.Address = this.ccbAccount.address;

      this._apportionment.ApprovalDate = moment().unix() * 1000;
      this._apportionment.ExpirationDate = moment().add(10, 'years').unix() * 1000;


   // this.apportionment.ApprovalUser = this.stormwater.credentials.getValue();
  
    this._apportionment.PremiseId = this.ccbAccount.premId.toString();
    }    
    if (this._account.ApportionmentCode === 'WEIGHTED') {
      this._apportionment.Parcent = this.form.get('Parcent').value;
    } else if (this._account.ApportionmentCode === 'EQUAL') {
      this._apportionment.Parcent = (100 / this._account.ApportionmentUnits)/100;
    }
    this.submitted.emit(this._apportionment);
  }
  delete() {
    this.deleted.emit(this._apportionment);
  }
}
