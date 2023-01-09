import { TestBed } from '@angular/core/testing';

import { FFMPEGService } from './ffmpeg.service';

describe('FFMPEGService', () => {
  let service: FFMPEGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FFMPEGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
