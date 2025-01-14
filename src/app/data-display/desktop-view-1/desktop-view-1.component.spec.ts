import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopView1Component } from './desktop-view-1.component';

describe('DesktopViewComponent', () => {
  let component: DesktopView1Component;
  let fixture: ComponentFixture<DesktopView1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopView1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(DesktopView1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
