/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RescuetimeFeaturesService } from './rescuetime-features.service';

describe('RescuetimeFeaturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RescuetimeFeaturesService]
    });
  });

  it('should ...', inject([RescuetimeFeaturesService], (service: RescuetimeFeaturesService) => {
    expect(service).toBeTruthy();
  }));
});
