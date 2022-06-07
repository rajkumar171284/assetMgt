import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMacDetailsComponent } from './add-mac-details.component';

describe('AddMacDetailsComponent', () => {
  let component: AddMacDetailsComponent;
  let fixture: ComponentFixture<AddMacDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMacDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMacDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
