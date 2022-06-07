import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetConfigComponent } from './add-asset-config.component';

describe('AddAssetConfigComponent', () => {
  let component: AddAssetConfigComponent;
  let fixture: ComponentFixture<AddAssetConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssetConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
