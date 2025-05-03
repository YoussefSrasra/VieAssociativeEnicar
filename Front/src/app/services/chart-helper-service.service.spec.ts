import { TestBed } from '@angular/core/testing';

import { ChartHelperServiceService } from './chart-helper-service.service';

describe('ChartHelperServiceService', () => {
  let service: ChartHelperServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartHelperServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
