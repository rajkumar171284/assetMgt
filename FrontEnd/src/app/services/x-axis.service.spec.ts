import { TestBed } from '@angular/core/testing';

import { XAxisService } from './x-axis.service';

describe('XAxisService', () => {
  let service: XAxisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XAxisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
