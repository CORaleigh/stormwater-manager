import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchtabComponent } from './searchtab.component';

describe('SearchtabComponent', () => {
  let component: SearchtabComponent;
  let fixture: ComponentFixture<SearchtabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchtabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
