import { TestBed } from '@angular/core/testing';

import { NgxJs9Service } from './ngx-js9.service';

describe('NgxJs9Service', () => {
  let service: NgxJs9Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxJs9Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
