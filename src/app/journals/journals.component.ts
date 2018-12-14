import { Component, OnInit } from '@angular/core';
import { StormwaterService } from '../stormwater.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Journal } from '../journal';
import { MatDialog } from '@angular/material';
import { Feature } from '../feature';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css']
})
export class JournalsComponent implements OnInit {

  constructor(private dialog: MatDialog, private stormwater:StormwaterService) { }
  
  ngOnInit() {

  }

  add() {
    let ref = this.dialog.open(DialogComponent, {data: {title: 'Add Journal Entry'}});
    ref.afterClosed().subscribe((data:Journal) => {
      let feature = new Feature(data, null);
      this.stormwater.applyEdits(5, [feature], null, null).subscribe(result => {
        if(result.addResults) {
          if (result.addResults[0].success) {
            this.stormwater.getByObjectId(5, result.addResults[0].objectId).subscribe(result => {
              if (result.features) {
                if (result.features.length > 0) {
                  let journals: Journal[] = this.stormwater.journals.getValue();
                  journals.push(result.features[0].attributes);
                  this.stormwater.journals.next(journals);                  
                }
              }
            });

          }
        }
      });
    });
  }
}