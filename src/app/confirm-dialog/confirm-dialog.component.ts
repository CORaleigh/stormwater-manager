import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ConfirmDialogComponent implements OnInit {

  constructor() { }
  @Input() message: string | null = null;
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
