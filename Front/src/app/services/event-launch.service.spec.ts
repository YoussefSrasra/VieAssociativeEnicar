import { TestBed } from '@angular/core/testing';

import { EventLaunchService } from './event-launch.service';

describe('EventLaunchService', () => {
  let service: EventLaunchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventLaunchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
