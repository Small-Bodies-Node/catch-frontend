import {
  ITableDateRangeFilter,
  ITableFilterState,
  ITableNumberRangeFilter,
  ITableRangeFilterConfig,
  ITableSourceFilterOption,
  TTableRangeFilterColumn,
} from './table-filter.types';
import { apiDataLabels } from '../../../../../utils/apiDataLabels';

interface ISourceFilterDatum {
  source_name: string;
}

interface IDateFilterDatum {
  date: string;
}

type TRangeFilterDatum = Partial<Record<TTableRangeFilterColumn, unknown>>;

export type TTableFilterDatum = ISourceFilterDatum & TRangeFilterDatum & IDateFilterDatum;

function buildRangeFilterConfig(
  column: TTableRangeFilterColumn,
  bounds: Pick<ITableRangeFilterConfig, 'minAllowed' | 'maxAllowed'> = {},
): ITableRangeFilterConfig {
  return {
    column,
    label: apiDataLabels[column]?.label ?? column,
    ...bounds,
  };
}

export const tableRangeFilterConfigs: Record<TTableRangeFilterColumn, ITableRangeFilterConfig> = {
  airmass: buildRangeFilterConfig('airmass', { minAllowed: 0 }),
  ddec: buildRangeFilterConfig('ddec'),
  dec: buildRangeFilterConfig('dec', { minAllowed: -90, maxAllowed: 90 }),
  delta: buildRangeFilterConfig('delta', { minAllowed: 0 }),
  dra: buildRangeFilterConfig('dra'),
  drh: buildRangeFilterConfig('drh'),
  elong: buildRangeFilterConfig('elong', { minAllowed: 0, maxAllowed: 180 }),
  exposure: buildRangeFilterConfig('exposure', { minAllowed: 0 }),
  jd: buildRangeFilterConfig('jd'),
  maglimit: buildRangeFilterConfig('maglimit'),
  mjd_start: buildRangeFilterConfig('mjd_start'),
  mjd_stop: buildRangeFilterConfig('mjd_stop'),
  phase: buildRangeFilterConfig('phase', { minAllowed: 0, maxAllowed: 180 }),
  'ps1:frame_id': buildRangeFilterConfig('ps1:frame_id', { minAllowed: 0 }),
  'ps1:projection_id': buildRangeFilterConfig('ps1:projection_id', { minAllowed: 0 }),
  'ps1:skycell_id': buildRangeFilterConfig('ps1:skycell_id', { minAllowed: 0 }),
  ra: buildRangeFilterConfig('ra', { minAllowed: 0, maxAllowed: 360 }),
  rdot: buildRangeFilterConfig('rdot'),
  rh: buildRangeFilterConfig('rh', { minAllowed: 0 }),
  sangle: buildRangeFilterConfig('sangle', { minAllowed: 0, maxAllowed: 360 }),
  seeing: buildRangeFilterConfig('seeing', { minAllowed: 0 }),
  'skymapper:field_id': buildRangeFilterConfig('skymapper:field_id', { minAllowed: 0 }),
  'skymapper:sb_mag': buildRangeFilterConfig('skymapper:sb_mag'),
  'skymapper:zpapprox': buildRangeFilterConfig('skymapper:zpapprox'),
  true_anomaly: buildRangeFilterConfig('true_anomaly', { minAllowed: 0, maxAllowed: 360 }),
  unc_a: buildRangeFilterConfig('unc_a', { minAllowed: 0 }),
  unc_b: buildRangeFilterConfig('unc_b', { minAllowed: 0 }),
  unc_theta: buildRangeFilterConfig('unc_theta', { minAllowed: 0, maxAllowed: 360 }),
  vangle: buildRangeFilterConfig('vangle', { minAllowed: 0, maxAllowed: 360 }),
  vmag: buildRangeFilterConfig('vmag'),
};

export const tableRangeFilterColumns = Object.keys(
  tableRangeFilterConfigs,
) as TTableRangeFilterColumn[];

export function createEmptyTableFilterState(): ITableFilterState {
  return {
    selectedSourceNames: [],
    numberRanges: {},
    dateRange: { after: null, before: null },
  };
}

export function getSourceFilterOptions<T extends ISourceFilterDatum>(
  data: readonly T[],
  formatSourceName: (sourceName: string) => string,
): ITableSourceFilterOption[] {
  const sourceCounts = data.reduce((counts, datum) => {
    counts.set(datum.source_name, (counts.get(datum.source_name) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return Array.from(sourceCounts.entries())
    .map(([value, count]) => ({
      value,
      label: formatSourceName(value),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function applySourceFilter<T extends ISourceFilterDatum>(
  data: readonly T[],
  selectedSourceNames: readonly string[],
): T[] {
  if (selectedSourceNames.length === 0) {
    return [...data];
  }

  const selectedSources = new Set(selectedSourceNames);
  return data.filter((datum) => selectedSources.has(datum.source_name));
}

export function isNumberRangeFilterActive(range: ITableNumberRangeFilter | undefined): boolean {
  return (
    (range?.min !== null && range?.min !== undefined) ||
    (range?.max !== null && range?.max !== undefined)
  );
}

export function normalizeNumberRangeFilter(
  range: ITableNumberRangeFilter,
): ITableNumberRangeFilter {
  return {
    min: Number.isFinite(range.min) ? range.min : null,
    max: Number.isFinite(range.max) ? range.max : null,
  };
}

export function isDateRangeFilterActive(range: ITableDateRangeFilter | undefined): boolean {
  return !!range?.after || !!range?.before;
}

export function normalizeDateRangeFilter(
  range: ITableDateRangeFilter | undefined,
): ITableDateRangeFilter {
  const after = parseTableDateToMs(range?.after) === null ? null : (range?.after ?? null);
  const before = parseTableDateToMs(range?.before) === null ? null : (range?.before ?? null);

  return { after, before };
}

export function applyNumberRangeFilters<T extends TRangeFilterDatum>(
  data: readonly T[],
  numberRanges: ITableFilterState['numberRanges'],
): T[] {
  return tableRangeFilterColumns.reduce(
    (filteredData, column) => {
      const range = numberRanges[column];
      const min = range?.min ?? null;
      const max = range?.max ?? null;

      if (min === null && max === null) {
        return filteredData;
      }

      return filteredData.filter((datum) => {
        const value = datum[column];
        if (typeof value !== 'number' || !Number.isFinite(value)) return false;
        if (min !== null && value < min) return false;
        if (max !== null && value > max) return false;
        return true;
      });
    },
    [...data],
  );
}

export function applyDateRangeFilter<T extends IDateFilterDatum>(
  data: readonly T[],
  dateRange: ITableDateRangeFilter,
): T[] {
  const normalizedRange = normalizeDateRangeFilter(dateRange);
  const after = parseTableDateToMs(normalizedRange.after);
  const before = parseTableDateToMs(normalizedRange.before);

  if (after === null && before === null) {
    return [...data];
  }

  return data.filter((datum) => {
    const value = parseTableDateToMs(datum.date);
    if (value === null) return false;
    if (after !== null && value < after) return false;
    if (before !== null && value > before) return false;
    return true;
  });
}

export function parseTableDateToMs(input: string | null | undefined): number | null {
  const trimmedInput = `${input ?? ''}`.trim();
  if (!trimmedInput) return null;

  const dateTimeInput = trimmedInput.includes('T')
    ? trimmedInput
    : trimmedInput.replace(/\s+/, 'T');
  const timezoneSuffixPattern = /(Z|[+-]\d{2}:?\d{2})$/i;
  const normalizedInput = timezoneSuffixPattern.test(dateTimeInput)
    ? dateTimeInput
    : `${dateTimeInput}Z`;
  const timestamp = Date.parse(normalizedInput);

  return Number.isFinite(timestamp) ? timestamp : null;
}

export function applyTableFilters<T extends TTableFilterDatum>(
  data: readonly T[],
  filters: ITableFilterState,
): T[] {
  return applyDateRangeFilter(
    applyNumberRangeFilters(
      applySourceFilter(data, filters.selectedSourceNames),
      filters.numberRanges,
    ),
    filters.dateRange,
  );
}

export function getProjectedNumberRangeFilterCount<T extends TTableFilterDatum>(
  data: readonly T[],
  filters: ITableFilterState,
  column: TTableRangeFilterColumn,
  range: ITableNumberRangeFilter,
): number {
  const normalizedRange = normalizeNumberRangeFilter(range);
  const numberRanges = { ...filters.numberRanges };

  if (isNumberRangeFilterActive(normalizedRange)) {
    numberRanges[column] = normalizedRange;
  } else {
    delete numberRanges[column];
  }

  return applyTableFilters(data, {
    ...filters,
    numberRanges,
  }).length;
}

export function getProjectedDateRangeFilterCount<T extends TTableFilterDatum>(
  data: readonly T[],
  filters: ITableFilterState,
  dateRange: ITableDateRangeFilter,
): number {
  return applyTableFilters(data, {
    ...filters,
    dateRange: normalizeDateRangeFilter(dateRange),
  }).length;
}
