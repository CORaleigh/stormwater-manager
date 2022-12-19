import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApportionmentSearchComponent } from './apportionment-search.component';

describe('ApportionmentSearchComponent', () => {
  let component: ApportionmentSearchComponent;
  let fixture: ComponentFixture<ApportionmentSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApportionmentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApportionmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
