import { TestBed } from '@angular/core/testing';

import { RiderServiceService } from './rider-service.service';

describe('RiderServiceService', () => {
  let service: RiderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
