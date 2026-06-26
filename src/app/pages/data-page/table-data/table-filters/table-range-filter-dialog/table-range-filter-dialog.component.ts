import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  ITableFilterState,
  ITableNumberRangeFilter,
  ITableRangeFilterConfig,
} from '../table-filter.types';
import {
  getProjectedNumberRangeFilterCount,
  isNumberRangeFilterActive,
  normalizeNumberRangeFilter,
  TTableFilterDatum,
} from '../table-filter.utils';

export interface ITableRangeFilterDialogData {
  config: ITableRangeFilterConfig;
  range: ITableNumberRangeFilter;
  data: readonly TTableFilterDatum[];
  filters: ITableFilterState;
}

@Component({
  selector: 'app-table-range-filter-dialog',
  templateUrl: './table-range-filter-dialog.component.html',
  styleUrls: ['./table-range-filter-dialog.component.scss'],
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  standalone: true,
})
export class TableRangeFilterDialogComponent {
  readonly config: ITableRangeFilterConfig;
  readonly previewTotal: number;
  private readonly data: readonly TTableFilterDatum[];
  private readonly filters: ITableFilterState;
  minInput: string | number | null = '';
  maxInput: string | number | null = '';
  previewCount: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<TableRangeFilterDialogComponent, ITableNumberRangeFilter>,
    @Inject(MAT_DIALOG_DATA) data: ITableRangeFilterDialogData,
  ) {
    this.config = data.config;
    this.data = data.data;
    this.filters = data.filters;
    this.previewTotal = data.data.length;
    const range = normalizeNumberRangeFilter(data.range);
    this.minInput = range.min?.toString() ?? '';
    this.maxInput = range.max?.toString() ?? '';
    this.updatePreview();
  }

  get validationError(): string | null {
    const min = this.parseInput(this.minInput);
    const max = this.parseInput(this.maxInput);

    if (!min.isValid || !max.isValid) {
      return 'Enter numeric values only.';
    }

    if (
      this.config.minAllowed !== undefined &&
      min.value !== null &&
      min.value < this.config.minAllowed
    ) {
      return `${this.config.label} minimum must be at least ${this.config.minAllowed}.`;
    }

    if (
      this.config.maxAllowed !== undefined &&
      max.value !== null &&
      max.value > this.config.maxAllowed
    ) {
      return `${this.config.label} maximum must be at most ${this.config.maxAllowed}.`;
    }

    if (min.value !== null && max.value !== null && min.value > max.value) {
      return 'Minimum must be less than or equal to maximum.';
    }

    return null;
  }

  get isApplyDisabled(): boolean {
    return this.validationError !== null || this.isPreviewEmpty;
  }

  get previewLabel(): string {
    if (this.validationError !== null || this.previewCount === null) {
      return '';
    }

    const range = this.getCurrentRange();
    if (!isNumberRangeFilterActive(range)) {
      return `No range set; ${this.previewCount} of ${this.previewTotal} rows would remain.`;
    }

    return `${this.previewCount} of ${this.previewTotal} rows would remain.`;
  }

  get isPreviewEmpty(): boolean {
    return this.previewCount === 0 && this.validationError === null;
  }

  setMinInput(value: string | number | null): void {
    this.minInput = value;
    this.updatePreview();
  }

  setMaxInput(value: string | number | null): void {
    this.maxInput = value;
    this.updatePreview();
  }

  updatePreview(): void {
    if (this.validationError !== null) {
      this.previewCount = null;
      return;
    }

    this.previewCount = getProjectedNumberRangeFilterCount(
      this.data,
      this.filters,
      this.config.column,
      this.getCurrentRange(),
    );
  }

  apply(): void {
    if (this.isApplyDisabled) return;

    this.dialogRef.close(this.getCurrentRange());
  }

  clear(): void {
    this.dialogRef.close({ min: null, max: null });
  }

  private parseInput(input: string | number | null): { isValid: boolean; value: number | null } {
    const trimmedInput = `${input ?? ''}`.trim();
    if (trimmedInput.length === 0) {
      return { isValid: true, value: null };
    }

    const value = Number(trimmedInput);
    return Number.isFinite(value) ? { isValid: true, value } : { isValid: false, value: null };
  }

  private getCurrentRange(): ITableNumberRangeFilter {
    return {
      min: this.parseInput(this.minInput).value,
      max: this.parseInput(this.maxInput).value,
    };
  }
}
