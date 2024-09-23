import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarOverlayComponent } from './star-overlay.component';

describe('StarOverlayComponent', () => {
  let component: StarOverlayComponent;
  let fixture: ComponentFixture<StarOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
