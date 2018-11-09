import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApportionmentsComponent } from './apportionments.component';

describe('ApportionmentsComponent', () => {
  let component: ApportionmentsComponent;
  let fixture: ComponentFixture<ApportionmentsComponent>;

  beforeEach(async(() => {
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
