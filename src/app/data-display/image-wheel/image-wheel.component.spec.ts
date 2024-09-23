import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWheelComponent } from './image-wheel.component';

describe('ImageWheelComponent', () => {
  let component: ImageWheelComponent;
  let fixture: ComponentFixture<ImageWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageWheelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
