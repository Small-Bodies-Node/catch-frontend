import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Js9DevComponent } from './js9-dev.component';

describe('Js9DevComponent', () => {
  let component: Js9DevComponent;
  let fixture: ComponentFixture<Js9DevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Js9DevComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Js9DevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
