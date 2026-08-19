import { ICatResponseCache } from './ICatResponseCache';

export type TAstrometryRunStatus = 'running' | 'complete' | 'error';

export interface IAstrometryInputs {
  image_url: string;
  ra: number | null;
  dec: number | null;
  use_ra_dec: true;
  pixel_scale: number;
  scale_low: number | null;
  scale_high: number | null;
  search_radius: number;
  snr_threshold: number;
}

export interface IAstrometryResult {
  status: 'success';
  wcs_image_url: string;
  wcs_image_s3_key: string;
  sources_detected: number;
  center_ra_deg: number;
  center_dec_deg: number;
  pixel_scale: number;
  request_id: string;
  cache: ICatResponseCache;
}

export interface IAstrometryErrorResponse {
  status?: string;
  message?: string;
  error_type?: string;
  request_id?: string;
  stage?: string;
  image_url?: string | null;
  wcs_image_url?: string | null;
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
