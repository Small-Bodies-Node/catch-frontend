import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ITableDateRangeFilter, ITableFilterState } from '../table-filter.types';
import {
  getProjectedDateRangeFilterCount,
  isDateRangeFilterActive,
  normalizeDateRangeFilter,
  parseTableDateToMs,
  TTableFilterDatum,
} from '../table-filter.utils';

type TDateBoundKind = 'after' | 'before';
type TDateInputValue = string | number | null;

interface IDateBoundInputs {
  year: TDateInputValue;
  month: TDateInputValue;
  day: TDateInputValue;
  hour: TDateInputValue;
  minute: TDateInputValue;
  second: TDateInputValue;
}

interface IParsedDateBound {
  isValid: boolean;
  value: string | null;
  error: string | null;
}

export interface ITableDateFilterDialogData {
  range: ITableDateRangeFilter;
  data: readonly TTableFilterDatum[];
  filters: ITableFilterState;
}

@Component({
  selector: 'app-table-date-filter-dialog',
  templateUrl: './table-date-filter-dialog.component.html',
  styleUrls: ['./table-date-filter-dialog.component.scss'],
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  standalone: true,
})
export class TableDateFilterDialogComponent {
  readonly previewTotal: number;
  private readonly data: readonly TTableFilterDatum[];
  private readonly filters: ITableFilterState;
  afterInputs: IDateBoundInputs = this.createEmptyInputs();
  beforeInputs: IDateBoundInputs = this.createEmptyInputs();

  constructor(
    private dialogRef: MatDialogRef<TableDateFilterDialogComponent, ITableDateRangeFilter>,
    @Inject(MAT_DIALOG_DATA) data: ITableDateFilterDialogData,
  ) {
    this.data = data.data;
    this.filters = data.filters;
    this.previewTotal = data.data.length;
    const range = normalizeDateRangeFilter(data.range);
    this.afterInputs = this.createInputsFromDateValue(range.after) ?? this.createEmptyInputs();
    this.beforeInputs = this.createInputsFromDateValue(range.before) ?? this.createEmptyInputs();
  }

  get validationError(): string | null {
    const after = this.parseBound('after', this.afterInputs);
    const before = this.parseBound('before', this.beforeInputs);

    if (!after.isValid) return after.error;
    if (!before.isValid) return before.error;

    const afterTimestamp = parseTableDateToMs(after.value);
    const beforeTimestamp = parseTableDateToMs(before.value);

    if (afterTimestamp !== null && beforeTimestamp !== null && afterTimestamp > beforeTimestamp) {
      return 'After must be before or equal to before.';
    }

    return null;
  }

  get isApplyDisabled(): boolean {
    return this.validationError !== null || this.isPreviewEmpty;
  }

  get previewCount(): number | null {
    if (this.validationError !== null) {
      return null;
    }

    return getProjectedDateRangeFilterCount(this.data, this.filters, this.getCurrentRange());
  }

  get previewLabel(): string {
    if (this.validationError !== null || this.previewCount === null) {
      return '';
    }

    const range = this.getCurrentRange();
    if (!isDateRangeFilterActive(range)) {
      return `No date range set; ${this.previewCount} of ${this.previewTotal} rows would remain.`;
    }

    return `${this.previewCount} of ${this.previewTotal} rows would remain.`;
  }

  get isPreviewEmpty(): boolean {
    return this.previewCount === 0 && this.validationError === null;
  }

  apply(): void {
    if (this.isApplyDisabled) return;

    this.dialogRef.close({
      ...this.getCurrentRange(),
    });
  }

  clear(): void {
    this.dialogRef.close({ after: null, before: null });
  }

  private parseBound(kind: TDateBoundKind, inputs: IDateBoundInputs): IParsedDateBound {
    if (!this.hasAnyInput(inputs)) {
      return { isValid: true, value: null, error: null };
    }

    const label = kind === 'after' ? 'After' : 'Before';
    const year = this.parseInteger(inputs.year);
    const month = this.parseInteger(inputs.month);
    const day = this.parseInteger(inputs.day);
    const hour = this.parseInteger(inputs.hour) ?? (kind === 'after' ? 0 : 23);
    const minute = this.parseInteger(inputs.minute) ?? (kind === 'after' ? 0 : 59);
    const second = this.parseInteger(inputs.second) ?? (kind === 'after' ? 0 : 59);

    if (year === null || month === null || day === null) {
      return {
        isValid: false,
        value: null,
        error: `${label} requires year, month, and day.`,
      };
    }

    if (![year, month, day, hour, minute, second].every(Number.isInteger)) {
      return { isValid: false, value: null, error: 'Enter whole numbers only.' };
    }

    if (year < 1 || year > 9999) {
      return { isValid: false, value: null, error: `${label} year must be 1 to 9999.` };
    }

    if (month < 1 || month > 12) {
      return { isValid: false, value: null, error: `${label} month must be 1 to 12.` };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, value: null, error: `${label} day must be 1 to 31.` };
    }

    if (hour < 0 || hour > 23) {
      return { isValid: false, value: null, error: `${label} hour must be 0 to 23.` };
    }

    if (minute < 0 || minute > 59 || second < 0 || second > 59) {
      return {
        isValid: false,
        value: null,
        error: `${label} minute and second must be 0 to 59.`,
      };
    }

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return { isValid: false, value: null, error: `${label} date is invalid.` };
    }

    return {
      isValid: true,
      value: date.toISOString().replace('.000Z', 'Z'),
      error: null,
    };
  }

  private getCurrentRange(): ITableDateRangeFilter {
    return {
      after: this.parseBound('after', this.afterInputs).value,
      before: this.parseBound('before', this.beforeInputs).value,
    };
  }

  private createInputsFromDateValue(value: string | null): IDateBoundInputs | null {
    const timestamp = parseTableDateToMs(value);
    if (timestamp === null) return null;

    const date = new Date(timestamp);
    return {
      year: date.getUTCFullYear().toString(),
      month: this.padDatePart(date.getUTCMonth() + 1),
      day: this.padDatePart(date.getUTCDate()),
      hour: this.padDatePart(date.getUTCHours()),
      minute: this.padDatePart(date.getUTCMinutes()),
      second: this.padDatePart(date.getUTCSeconds()),
    };
  }

  private createEmptyInputs(): IDateBoundInputs {
    return {
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
    };
  }

  private hasAnyInput(inputs: IDateBoundInputs): boolean {
    return Object.values(inputs).some((value) => `${value ?? ''}`.trim().length > 0);
  }

  private parseInteger(input: TDateInputValue): number | null {
    const trimmedInput = `${input ?? ''}`.trim();
    if (trimmedInput.length === 0) return null;

    const value = Number(trimmedInput);
    return Number.isInteger(value) ? value : NaN;
  }

  private padDatePart(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
