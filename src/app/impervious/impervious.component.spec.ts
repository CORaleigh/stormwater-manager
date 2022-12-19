import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImperviousComponent } from './impervious.component';

describe('ImperviousComponent', () => {
  let component: ImperviousComponent;
  let fixture: ComponentFixture<ImperviousComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImperviousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImperviousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
