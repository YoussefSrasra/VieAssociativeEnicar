import { TestBed } from '@angular/core/testing';

import { ClubMembershipService } from './club-membership.service';

describe('ClubMembershipService', () => {
  let service: ClubMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubMembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
