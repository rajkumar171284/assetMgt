import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonChart1Component } from './common-chart1.component';

describe('CommonChart1Component', () => {
  let component: CommonChart1Component;
  let fixture: ComponentFixture<CommonChart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonChart1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
