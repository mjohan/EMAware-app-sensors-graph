/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DatabankService } from './databank.service';

describe('DatabankService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabankService]
    });
  });

  it('should ...', inject([DatabankService], (service: DatabankService) => {
    expect(service).toBeTruthy();
  }));
});
