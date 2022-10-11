import { TestBed } from '@angular/core/testing';

import { AlecEcommFormServiceService } from './alec-ecomm-form-service.service';

describe('AlecEcommFormServiceService', () => {
  let service: AlecEcommFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlecEcommFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
