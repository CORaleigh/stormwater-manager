import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Impervious } from '../impervious';
import { Journal } from '../journal';
import { Credit } from '../credit';
import { Account } from '../account';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    ngOnInit() {
    }

    imperviousSubmitted(impervious:Impervious) {
      this.dialogRef.close(impervious);
    }
    creditSubmitted(credit:Credit) {
      this.dialogRef.close(credit);
    }    
    journalSubmitted(journal:Journal) {
      this.dialogRef.close(journal);
    }    

    apportionmentClosed(event: any) {
      this.dialogRef.close();
    }
    accountSubmitted(account:Account) {
      this.dialogRef.close(account)
    }
    confirmed(confirmed:boolean) {
      this.dialogRef.close(confirmed);
    }
}
