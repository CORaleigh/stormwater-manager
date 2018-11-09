import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
})
export class AccountFormComponent implements OnInit {
  form = this.fb.group({
    status: [null, Validators.required]
  });
  @Output() submitted = new EventEmitter<Account>();
  statuses:any[];
  account:Account;

  constructor(private fb: FormBuilder, private stormwater:StormwaterService) {}
  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      this.account = account;
      this.statuses = this.stormwater.getDomain(1, 'Status');
      this.form.get('status').setValue(account.Status);
    });
  }
  onSubmit() {
    this.account.Status = this.form.get('status').value;
    this.submitted.emit(this.account);
  }
}
