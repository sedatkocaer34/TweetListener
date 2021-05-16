/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SocketioService } from './socketio.service';

describe('Service: Socketio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketioService]
    });
  });

  it('should ...', inject([SocketioService], (service: SocketioService) => {
    expect(service).toBeTruthy();
  }));
});
