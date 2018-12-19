import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { Account } from '../account';
import { MatStepper, MatVerticalStepper } from '@angular/material';
import { Feature } from '../feature';
import { Apportionment } from '../apportionment';
import * as moment from 'moment';

@Component({
  selector: 'app-apportionment-dialog',
  templateUrl: './apportionment-dialog.component.html',
  styleUrls: ['./apportionment-dialog.component.css'],
  providers: [{provide: MatStepper}], 

})
export class ApportionmentDialogComponent implements OnInit {

  constructor(private stormwater:StormwaterService) { }
  apportionments:Apportionment[] = [];
  remainingPercent:number = 1;

  ngOnInit() {
    this.stormwater.account.subscribe(account => {
      this.account = account;
    });
    this.stormwater.apportionments.subscribe(apportionments => {
      this.apportionments = apportionments;
    });
    
  }
  account:Account;
  ccbAccount:any;
  @ViewChild('stepper') stepper:MatStepper;
  @Input() mode: string;
  @Input() apportionment: Apportionment;
  @Output() close: EventEmitter<any> = new EventEmitter();
  ccbAccountSelected(ccbAccount:any) {
    this.ccbAccount = ccbAccount;
    this.goToNextStep();
  }

  goToNextStep() {
    
    //this.stepper.next()
    window.setTimeout(() => {this.stepper.next();}, 100)
    
  }


  submitted(apportionment) {
    let updates = [];
    this.apportionment = apportionment;
    apportionment.Impervious = this.account.BillableImpervious * apportionment.Parcent;
    apportionment.Sfeu = this.account.Sfeu * apportionment.Parcent;
    if (this.account.ApportionmentCode === 'EQUAL'){
      this.apportionments.forEach(apportionment => {
        apportionment.Parcent = (100 / this.account.ApportionmentUnits) / 100;
          apportionment.Impervious = this.account.BillableImpervious * apportionment.Parcent;
          apportionment.Sfeu = this.account.Sfeu * apportionment.Parcent;
        updates.push(new Feature(apportionment));
      });
    }

    let adds = [];
    if (this.mode === 'add') {
       adds.push(new Feature(this.apportionment));
       //this.apportionments.push(this.apportionment);
    } else if (this.mode === 'update') {
      updates.push(new Feature(this.apportionment));
    }
    this.stormwater.applyEdits(5, adds, updates, []).subscribe(result => {
      this.ccbAccount = null;
      if (result.addResults.length > 0) {
        let oid = result.addResults[0].objectId;
        apportionment.OBJECTID = oid;
        this.apportionments.push(this.apportionment); 
        this.stormwater.apportionments.next(this.apportionments);  
        this.stepper.reset();
        if (this.apportionments.length === this.account.ApportionmentUnits) {
          this.close.emit();
        }        
      }
      if (result.updateResults.length > 0) {
        this.close.emit();
      }      
  });
  
}

  apportionmentDeleted(apportionment:Apportionment) {
    this.stormwater.applyEdits(5, null, null, [apportionment.OBJECTID]).subscribe(result => {
      if (result.deleteResults.length > 0) {
        let oid = result.deleteResults[0].objectId;
        let apportionments:Apportionment[] = [];
        this.apportionments.forEach(a => {
          if (a.OBJECTID != oid) {
            apportionments.push(a);
          }
        });
        this.stormwater.apportionments.next(apportionments);
        this.close.emit();
      }
    });
  }
}
