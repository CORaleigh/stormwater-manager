import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApportionmentDialogComponent } from './apportionment-dialog.component';

describe('ApportionmentDialogComponent', () => {
  let component: ApportionmentDialogComponent;
  let fixture: ComponentFixture<ApportionmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApportionmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApportionmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
