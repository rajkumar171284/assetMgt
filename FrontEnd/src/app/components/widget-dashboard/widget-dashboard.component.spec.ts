import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDashboardComponent } from './widget-dashboard.component';

describe('WidgetDashboardComponent', () => {
  let component: WidgetDashboardComponent;
  let fixture: ComponentFixture<WidgetDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
