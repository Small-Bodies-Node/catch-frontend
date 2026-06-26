import { ICatResponseCache } from './ICatResponseCache';

export type TAstrometryRunStatus = 'running' | 'complete' | 'error';

export type TAstrometryBand = 'g' | 'r' | 'i' | 'z' | 'y';

export type TAstrometryResultStatus = 'success' | 'partial_success';

export type TAstrometryPlotType = 'color_correction' | 'image_overlay';

export interface IAstrometryInputs {
  image_url: string;
  ra: number;
  dec: number;
  use_ra_dec: true;
  pixel_scale: number;
  scale_low: number | null;
  scale_high: number | null;
  search_radius: number;
  snr_threshold: number;
  aperture_radius: number;
  catalog: 'PanSTARRS1';
  obs_band: TAstrometryBand;
  cal_band: TAstrometryBand;
  return_plot: boolean;
  plot_type: TAstrometryPlotType;
}

export interface IAstrometryResult {
  status?: TAstrometryResultStatus;
  astrometry: {
    status?: 'success';
    center_dec_deg: number;
    center_ra_deg: number;
    pixel_scale: number;
  };
  photometry?: IAstrometryPhotometrySuccess | IAstrometryPhotometryFailure;
  sources: {
    detected: number | null;
    matched: number | null;
  };
  request_id?: string;
  image_url?: string;
  cache?: ICatResponseCache;
}

export interface IAstrometryPhotometrySuccess {
  status?: 'success';
  color_term: number;
  uncertainty: number;
  zero_point: number;
}

export interface IAstrometryPhotometryFailure {
  status: 'failed';
  error_type?: string;
  message: string;
  stage?: string;
}

export interface IAstrometryErrorResponse {
  status?: string;
  message?: string;
  error_type?: string;
  request_id?: string;
  stage?: string;
  image_url?: string | null;
  astrometry_data?: unknown;
}

export interface IAstrometryRun {
  id: string;
  productId: string;
  sequence: number;
  status: TAstrometryRunStatus;
  inputs: IAstrometryInputs;
  createdAt: string;
  completedAt?: string;
  result?: IAstrometryResult;
  error?: string;
}

export type TAstrometryRunsState = { [productId: string]: IAstrometryRun[] };

export interface IAstrometryCentralization {
  productId: string;
  runId: string;
  centerRaDeg: number;
  centerDecDeg: number;
}

export type TAstrometryCentralizationsState = { [productId: string]: IAstrometryCentralization };
