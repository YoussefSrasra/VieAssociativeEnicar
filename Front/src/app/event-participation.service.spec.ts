import { TestBed } from '@angular/core/testing';

import { EventParticipationService } from './event-participation.service';

describe('EventParticipationService', () => {
  let service: EventParticipationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventParticipationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
