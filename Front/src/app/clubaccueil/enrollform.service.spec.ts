import { TestBed } from '@angular/core/testing';

import { EnrollformService } from './enrollform.service';

describe('EnrollformService', () => {
  let service: EnrollformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
