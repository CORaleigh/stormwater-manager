import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Account } from '../account';
import { StormwaterService } from '../stormwater.service';
import { Feature } from '../feature';
import { Apportionment } from '../apportionment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-apportionment-form',
  templateUrl: './apportionment-form.component.html',
  styleUrls: ['./apportionment-form.component.css'],
})
export class ApportionmentFormComponent implements OnInit {
  apptForm = this.fb.group({
    code: [null, null],
    units: [null, null],
  });

  @Input() apportionments:Apportionment[];

  codes = [
    {name: 'N/A', code: 'NA'},
    {name: 'Equal', code: 'EQUAL'},
    {name: 'Weighted', code: 'WEIGHTED'}
  ];

  constructor(private fb: FormBuilder, private stormwater:StormwaterService, private dialog:MatDialog) {}

  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      if (account) {
        this.apptForm.get('code').setValue(account.ApportionmentCode);
        this.apptForm.get('units').setValue(account.ApportionmentUnits);
        if (account.ApportionmentCode === 'NA') {
          this.apptForm.controls.units.disable();
        } else {
          this.apptForm.controls.units.enable();
        }
      }
    });
  } 

  codeChanged(event) {
    let account = this.stormwater.account.getValue();
    account.ApportionmentCode = this.apptForm.get('code').value;
    if (account.ApportionmentCode === 'NA') {
      let ref = this.dialog.open(DialogComponent, {data: {title: 'Confirm', message:'Setting apportionment code to NA will delete all apportionments associated with this account.  Would you like to continue?'}});
      ref.afterClosed().subscribe((confirmed:boolean) => {
        if (confirmed) {
          let deletes = [];
          this.apportionments.forEach(a => {
            deletes.push(a.OBJECTID);
          });
          this.stormwater.applyEdits(5, null, null, deletes).subscribe(result => {
            this.stormwater.apportionments.next([]);
            this.stormwater.account.next(account);
          });
        }
      });
      this.apptForm.controls.units.disable();
      account.ApportionmentUnits = 0;

    } else {
      this.apptForm.controls.units.enable();

    }
    this.stormwater.applyEdits(2, null, [new Feature(account, null)]).subscribe(result => {
      this.updateApportionments(account);
    });
  }
  unitsChanged(event) {
    let account = this.stormwater.account.getValue();
    account.ApportionmentUnits = this.apptForm.get('units').value;
    this.stormwater.applyEdits(2, null, [new Feature(account, null)]).subscribe(result => {
      console.log(result);
      this.updateApportionments(account);
      
    });
  }

  checkCode() {
    if (this.apptForm.get('code').value === 'NA' || !this.apptForm.get('code').value) {
      return true;
    }
  }

  updateApportionments(account:Account) {
    if (account.ApportionmentCode === 'EQUAL') {
      let updates = [];
      this.apportionments.forEach(apportionment => {
        apportionment.Parcent = (100/account.ApportionmentUnits)/100;
        apportionment.Sfeu = apportionment.Parcent * account.Sfeu;
        apportionment.Impervious = apportionment.Parcent * account.BillableImpervious;
        updates.push(new Feature(apportionment));
      });
      this.stormwater.apportionments.next(this.apportionments);
      this.stormwater.applyEdits(5, [], updates, []).subscribe(result => {

      });
    }
  }
}
