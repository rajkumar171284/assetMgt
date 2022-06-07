import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacReportsComponent } from './mac-reports.component';

describe('MacReportsComponent', () => {
  let component: MacReportsComponent;
  let fixture: ComponentFixture<MacReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
