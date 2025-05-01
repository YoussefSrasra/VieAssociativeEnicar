import { TestBed } from '@angular/core/testing';

import { ClubService } from './Club.service';

describe('ClubRequestService', () => {
  let service: ClubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
