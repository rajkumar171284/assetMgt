import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSensorSubcategoryComponent } from './add-sensor-subcategory.component';

describe('AddSensorSubcategoryComponent', () => {
  let component: AddSensorSubcategoryComponent;
  let fixture: ComponentFixture<AddSensorSubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSensorSubcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSensorSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
