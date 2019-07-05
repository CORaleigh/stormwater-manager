import { TestBed } from '@angular/core/testing';

import { LodsService } from './lods.service';

describe('LodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LodsService = TestBed.get(LodsService);
    expect(service).toBeTruthy();
  });
});
