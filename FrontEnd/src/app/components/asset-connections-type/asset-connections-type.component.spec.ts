import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetConnectionsTypeComponent } from './asset-connections-type.component';

describe('AssetConnectionsTypeComponent', () => {
  let component: AssetConnectionsTypeComponent;
  let fixture: ComponentFixture<AssetConnectionsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetConnectionsTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetConnectionsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
