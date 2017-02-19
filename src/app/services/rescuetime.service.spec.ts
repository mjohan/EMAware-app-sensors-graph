/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RescuetimeService } from './rescuetime.service';

describe('RescuetimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RescuetimeService]
    });
  });

  it('should ...', inject([RescuetimeService], (service: RescuetimeService) => {
    expect(service).toBeTruthy();
  }));
});
