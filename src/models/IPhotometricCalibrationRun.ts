import { ICatResponseCache } from './ICatResponseCache';

export const photometricCalibrationCatalogs = ['PanSTARRS1', 'Gaia', 'SkyMapper'] as const;

export type TPhotometricCalibrationCatalog = (typeof photometricCalibrationCatalogs)[number];
export type TPhotometricCalibrationBand =
  'u' | 'v' | 'g' | 'r' | 'i' | 'z' | 'y' | 'G' | 'bp' | 'rp';

export interface IPhotometricCalibrationInputs {
  wcs_image_url: string;
  snr_threshold: number;
  aperture_radius: number;
  catalog: TPhotometricCalibrationCatalog;
  cal_band: TPhotometricCalibrationBand;
  color_term: string;
}

export interface IPhotometricCalibrationResult {
  status: 'success';
  photometry: {
    zero_point: number;
    color_term: number;
    uncertainty: number;
    color_index: string;
    catalog: string;
    cal_band: string;
  };
  sources: {
    detected: number;
    matched: number;
  };
  photometry_image_url: string;
  photometry_image_s3_key: string;
  plots: {
    color_correction: {
      url: string;
      s3_key: string;
    };
    image_overlay: {
      url: string;
      s3_key: string;
    };
  };
  request_id: string;
  cache: ICatResponseCache;
}

export type TPhotometricCalibrationRunStatus = 'running' | 'complete' | 'error';

export interface IPhotometricCalibrationRun {
  id: string;
  productId: string;
  astrometryRunId: string;
  sequence: number;
  status: TPhotometricCalibrationRunStatus;
  inputs: IPhotometricCalibrationInputs;
  createdAt: string;
  completedAt?: string;
  result?: IPhotometricCalibrationResult;
  error?: string;
}

export type TPhotometricCalibrationRunsState = {
  [productId: string]: {
    [astrometryRunId: string]: IPhotometricCalibrationRun[];
  };
};
