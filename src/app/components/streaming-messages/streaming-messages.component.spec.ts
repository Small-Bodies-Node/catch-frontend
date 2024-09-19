import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingMessagesComponent } from './streaming-messages.component';

describe('StreamingMessagesComponent', () => {
  let component: StreamingMessagesComponent;
  let fixture: ComponentFixture<StreamingMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamingMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamingMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
