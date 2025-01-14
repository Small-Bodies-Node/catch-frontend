import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableThumbnailComponent } from './table-thumbnail.component';

describe('TableThumbnailComponent', () => {
  let component: TableThumbnailComponent;
  let fixture: ComponentFixture<TableThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableThumbnailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
