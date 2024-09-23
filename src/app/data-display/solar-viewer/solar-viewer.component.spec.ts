import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarViewerComponent } from './solar-viewer.component';

describe('SolarViewerComponent', () => {
  let component: SolarViewerComponent;
  let fixture: ComponentFixture<SolarViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
