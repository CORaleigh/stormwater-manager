import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JournalsComponent } from './journals.component';

describe('JournalsComponent', () => {
  let component: JournalsComponent;
  let fixture: ComponentFixture<JournalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
