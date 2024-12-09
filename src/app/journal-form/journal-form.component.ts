import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Journal } from '../journal';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-journal-form',
    templateUrl: './journal-form.component.html',
    styleUrls: ['./journal-form.component.css'],
    standalone: false
})
export class JournalFormComponent implements OnInit, OnDestroy {
  @Output() submitted = new EventEmitter<Journal>();
  account:Account = null;
  accountSubscription:Subscription;

  journalForm = this.fb.group({
    JournalEntry: [null, Validators.compose([
      Validators.required, Validators.minLength(1), Validators.maxLength(300)])
    ]
  });
  constructor(private fb: UntypedFormBuilder, private stormwater:StormwaterService) {}
  ngOnInit() {
    this.accountSubscription = this.stormwater.account.subscribe(account => {
      this.account = account;
    });
  }
  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = null;
    }
  }
  onSubmit() {
    let journal = new Journal(this.account.AccountId, this.journalForm.get('JournalEntry').value);
    this.submitted.emit(journal);
  }
}
