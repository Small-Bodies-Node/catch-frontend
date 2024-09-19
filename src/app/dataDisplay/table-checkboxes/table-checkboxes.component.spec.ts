import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCheckboxesComponent } from './table-checkboxes.component';

describe('TableCheckboxesComponent', () => {
  let component: TableCheckboxesComponent;
  let fixture: ComponentFixture<TableCheckboxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCheckboxesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCheckboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
