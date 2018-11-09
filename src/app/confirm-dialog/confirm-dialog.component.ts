import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor() { }
  @Input() message: string;
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
