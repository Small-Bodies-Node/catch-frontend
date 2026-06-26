import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ITableSourceFilterOption } from '../table-filter.types';

export interface ITableFilterDialogData {
  sourceOptions: readonly ITableSourceFilterOption[];
  selectedSourceNames: readonly string[];
}

@Component({
  selector: 'app-table-filter-dialog',
  templateUrl: './table-filter-dialog.component.html',
  styleUrls: ['./table-filter-dialog.component.scss'],
  imports: [MatButtonModule, MatCheckboxModule, MatDialogModule],
  standalone: true,
})
export class TableFilterDialogComponent {
  readonly sourceOptions: readonly ITableSourceFilterOption[];
  private selectedSourceNames: Set<string>;

  constructor(
    private dialogRef: MatDialogRef<TableFilterDialogComponent, string[]>,
    @Inject(MAT_DIALOG_DATA) data: ITableFilterDialogData,
  ) {
    this.sourceOptions = data.sourceOptions;
    this.selectedSourceNames = new Set(
      data.selectedSourceNames.length > 0
        ? data.selectedSourceNames
        : data.sourceOptions.map((option) => option.value),
    );
  }

  get selectedSourceCount(): number {
    return this.selectedSourceNames.size;
  }

  get isApplyDisabled(): boolean {
    return this.selectedSourceCount === 0;
  }

  get areAllSourcesSelected(): boolean {
    return this.selectedSourceCount === this.sourceOptions.length;
  }

  get sourceSelectionToggleLabel(): string {
    return this.areAllSourcesSelected ? 'Deselect all' : 'Select all';
  }

  isSourceSelected(sourceName: string): boolean {
    return this.selectedSourceNames.has(sourceName);
  }

  setSourceSelected(sourceName: string, isSelected: boolean): void {
    if (isSelected) {
      this.selectedSourceNames.add(sourceName);
    } else {
      this.selectedSourceNames.delete(sourceName);
    }
  }

  toggleAllSources(): void {
    this.selectedSourceNames = this.areAllSourcesSelected
      ? new Set()
      : new Set(this.sourceOptions.map((option) => option.value));
  }

  apply(): void {
    if (this.isApplyDisabled) return;
    this.dialogRef.close(this.getNormalizedSelectedSourceNames());
  }

  private getNormalizedSelectedSourceNames(): string[] {
    if (this.selectedSourceNames.size === this.sourceOptions.length) {
      return [];
    }

    return Array.from(this.selectedSourceNames);
  }
}
