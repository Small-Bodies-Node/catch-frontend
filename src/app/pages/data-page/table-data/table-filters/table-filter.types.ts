export interface ITableSourceFilterOption {
  value: string;
  label: string;
  count: number;
}

export type TTableRangeFilterColumn =
  | 'airmass'
  | 'ddec'
  | 'dec'
  | 'delta'
  | 'dra'
  | 'drh'
  | 'elong'
  | 'exposure'
  | 'jd'
  | 'maglimit'
  | 'mjd_start'
  | 'mjd_stop'
  | 'phase'
  | 'ps1:frame_id'
  | 'ps1:projection_id'
  | 'ps1:skycell_id'
  | 'ra'
  | 'rdot'
  | 'rh'
  | 'sangle'
  | 'seeing'
  | 'skymapper:field_id'
  | 'skymapper:sb_mag'
  | 'skymapper:zpapprox'
  | 'true_anomaly'
  | 'unc_a'
  | 'unc_b'
  | 'unc_theta'
  | 'vangle'
  | 'vmag';

export interface ITableNumberRangeFilter {
  min: number | null;
  max: number | null;
}

export interface ITableDateRangeFilter {
  after: string | null;
  before: string | null;
}

export interface ITableRangeFilterConfig {
  column: TTableRangeFilterColumn;
  label: string;
  minAllowed?: number;
  maxAllowed?: number;
}

export interface ITableFilterState {
  selectedSourceNames: string[];
  numberRanges: Partial<Record<TTableRangeFilterColumn, ITableNumberRangeFilter>>;
  dateRange: ITableDateRangeFilter;
}
