import { TestBed } from '@angular/core/testing';

import { StormwaterService } from './stormwater.service';

describe('StormwaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StormwaterService = TestBed.get(StormwaterService);
    expect(service).toBeTruthy();
  });
});
