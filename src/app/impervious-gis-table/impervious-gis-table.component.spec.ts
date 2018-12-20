import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { ImperviousGisTableComponent } from './impervious-gis-table.component';

describe('ImperviousGisTableComponent', () => {
  let component: ImperviousGisTableComponent;
  let fixture: ComponentFixture<ImperviousGisTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImperviousGisTableComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImperviousGisTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
