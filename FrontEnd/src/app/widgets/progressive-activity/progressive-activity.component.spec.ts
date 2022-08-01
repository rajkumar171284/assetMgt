import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressiveActivityComponent } from './progressive-activity.component';

describe('TableComponent', () => {
  let component: ProgressiveActivityComponent;
  let fixture: ComponentFixture<ProgressiveActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressiveActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressiveActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
