/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GraphEventService } from './graph-event.service';

describe('GraphEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphEventService]
    });
  });

  it('should ...', inject([GraphEventService], (service: GraphEventService) => {
    expect(service).toBeTruthy();
  }));
});
