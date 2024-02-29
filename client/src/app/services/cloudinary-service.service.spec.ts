import { TestBed } from '@angular/core/testing';

import { CloudinaryServiceService } from './cloudinary-service.service';

describe('CloudinaryServiceService', () => {
  let service: CloudinaryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
