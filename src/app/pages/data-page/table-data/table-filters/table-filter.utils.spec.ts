import {
  applyTableFilters,
  createEmptyTableFilterState,
  getProjectedDateRangeFilterCount,
  getProjectedNumberRangeFilterCount,
} from './table-filter.utils';
import { ITableFilterState } from './table-filter.types';

interface ITestDatum {
  source_name: string;
  date: string;
  ra?: number | string | null;
  dec?: number | string | null;
}

const data: ITestDatum[] = [
  { source_name: 'PanSTARRS 1 DR2', date: '2020-01-01 00:00:00', ra: 0, dec: -10 },
  { source_name: 'SkyMapperDR4', date: '2020-01-02 00:00:00', ra: 10, dec: 0 },
  { source_name: 'Spacewatch', date: '2020-01-03 00:00:00', ra: 'N/A', dec: 10 },
  { source_name: 'PanSTARRS 1 DR2', date: 'bad date', ra: 20, dec: null },
];

describe('table-filter utils', () => {
  it('keeps numeric zero as a valid range-filter value', () => {
    const filters: ITableFilterState = {
      ...createEmptyTableFilterState(),
      numberRanges: { ra: { min: 0, max: 0 } },
    };

    expect(applyTableFilters(data, filters).map((datum) => datum.ra)).toEqual([0]);
  });

  it('excludes non-numeric values while a numeric range filter is active', () => {
    const filters: ITableFilterState = {
      ...createEmptyTableFilterState(),
      numberRanges: { ra: { min: 0, max: 30 } },
    };

    expect(applyTableFilters(data, filters).map((datum) => datum.ra)).toEqual([0, 10, 20]);
  });

  it('projects numeric range filters against the whole active filter set', () => {
    const filters: ITableFilterState = {
      ...createEmptyTableFilterState(),
      selectedSourceNames: ['PanSTARRS 1 DR2'],
    };

    expect(getProjectedNumberRangeFilterCount(data, filters, 'ra', { min: 5, max: 25 })).toBe(1);
  });

  it('projects date range filters against the whole active filter set', () => {
    const filters: ITableFilterState = {
      ...createEmptyTableFilterState(),
      selectedSourceNames: ['PanSTARRS 1 DR2', 'SkyMapperDR4'],
    };

    expect(
      getProjectedDateRangeFilterCount(data, filters, {
        after: '2020-01-02T00:00:00Z',
        before: '2020-01-02T23:59:59Z',
      }),
    ).toBe(1);
  });
});
