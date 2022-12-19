import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApportionmentsComponent } from './apportionments.component';

describe('ApportionmentsComponent', () => {
  let component: ApportionmentsComponent;
  let fixture: ComponentFixture<ApportionmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApportionmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApportionmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
