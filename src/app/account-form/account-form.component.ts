import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-account-form',
    templateUrl: './account-form.component.html',
    styleUrls: ['./account-form.component.css'],
    standalone: false
})
export class AccountFormComponent implements OnInit, OnDestroy {
  accountSubscription:Subscription;
  form = this.fb.group({
    status: [null, Validators.required],
    useclass: [null, Validators.required],
    premiseid: [],
    csaid: []
  });
  @Output() submitted = new EventEmitter<Account>();
  statuses:any[];
  useclasses:any[];
  account:Account;

  constructor(private fb: UntypedFormBuilder, private stormwater:StormwaterService) {}
  ngOnInit() {
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      this.account = account;
      
      this.statuses = this.stormwater.getDomain(2, 'Status');
      this.form.get('status').setValue(account.Status);
      this.useclasses = this.stormwater.getDomain(2, 'UseClass');
      this.form.get('useclass').setValue(account.UseClass);     
      this.form.get('premiseid').setValue(account.PremiseId); 
      this.form.get('csaid').setValue(account.CsaId); 

    });
  }
  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;

    }
  }
  onSubmit() {
    this.account.Status = this.form.get('status').value;
    this.account.UseClass = this.form.get('useclass').value;
    this.account.PremiseId = this.form.get('premiseid').value;
    this.account.CsaId = this.form.get('csaid').value;    
    this.submitted.emit(this.account);
  }
}
