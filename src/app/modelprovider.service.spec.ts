import { TestBed } from '@angular/core/testing';

import { ModelProviderService } from './modelprovider.service';

describe('ModelproviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelProviderService = TestBed.get(ModelProviderService);
    expect(service).toBeTruthy();
  });
});
