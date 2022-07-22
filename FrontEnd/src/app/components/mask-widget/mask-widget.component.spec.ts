import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskWidgetComponent } from './mask-widget.component';

describe('MaskWidgetComponent', () => {
  let component: MaskWidgetComponent;
  let fixture: ComponentFixture<MaskWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaskWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
