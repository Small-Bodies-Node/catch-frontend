import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table-filter-toolbar',
  templateUrl: './table-filter-toolbar.component.html',
  styleUrls: ['./table-filter-toolbar.component.scss'],
  imports: [MatButtonModule],
  standalone: true,
})
export class TableFilterToolbarComponent {
  @Input() activeFilterCount = 0;
  @Input() filteredCount = 0;
  @Input() totalCount = 0;
  @Output() clearAll = new EventEmitter<void>();

  get filterSummary(): string {
    const filterNoun = this.activeFilterCount === 1 ? 'filter' : 'filters';
    return `${this.activeFilterCount} ${filterNoun} applied`;
  }
}
