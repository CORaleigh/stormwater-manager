import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Journal } from '../journal';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.css'],
})
export class JournalFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<Journal>();
  account:Account = null;
  journalForm = this.fb.group({
    JournalEntry: [null, Validators.compose([
      Validators.required, Validators.minLength(1), Validators.maxLength(300)])
    ]
  });

 

  constructor(private fb: FormBuilder, private stormwater:StormwaterService) {}
  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      this.account = account;
    });
  }
  onSubmit() {
    let journal = new Journal(this.account.AccountId, this.journalForm.get('JournalEntry').value);
    this.submitted.emit(journal);
  }
}
