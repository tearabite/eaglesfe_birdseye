import { TestBed } from '@angular/core/testing';

import { GameProviderService } from './gameprovider.service';

describe('GameproviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameProviderService = TestBed.get(GameProviderService);
    expect(service).toBeTruthy();
  });
});
