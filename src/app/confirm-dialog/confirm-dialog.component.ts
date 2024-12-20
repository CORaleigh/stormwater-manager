import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
    standalone: false
})
export class ConfirmDialogComponent implements OnInit {

  constructor() { }
  @Input() message: string;
  @Input() yesno: boolean = true;
  @Output() confirmed:EventEmitter<boolean> = new EventEmitter<boolean>();
  ngOnInit() {
  }

  confirmedClicked() {
    this.confirmed.emit(true);
  }

  deniedClicked() {
    this.confirmed.emit(false);
  }

}
