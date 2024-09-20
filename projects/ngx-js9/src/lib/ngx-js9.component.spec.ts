import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJs9Component } from './ngx-js9.component';

describe('NgxJs9Component', () => {
  let component: NgxJs9Component;
  let fixture: ComponentFixture<NgxJs9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxJs9Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxJs9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
