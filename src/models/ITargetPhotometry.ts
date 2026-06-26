import { ICatResponseCache } from './ICatResponseCache';

export type TTargetPhotometryApertureShape = 'Circular' | 'Circular_Annulus' | 'Rectangular';

export interface ITargetPhotometryApertureParams {
  shape: TTargetPhotometryApertureShape;
  position: [number, number];
  size: number;
  inner_r: number;
  outer_r: number;
  w?: number;
  h?: number;
  theta?: number;
}

export interface ITargetPhotometryRequest {
  file: string;
  target_aperture_params: ITargetPhotometryApertureParams;
  background_aperture_params: ITargetPhotometryApertureParams;
}

export interface ITargetPhotometryResponse {
  aperture_flux: number;
  aperture_fluxerr: number;
  aperture_figure?: string;
  aperture_figure_url?: string;
  aperture_figure_s3_key?: string;
  cache?: ICatResponseCache;
}

export type TTargetPhotometryRunStatus = 'running' | 'complete' | 'error';

export interface ITargetPhotometryRun {
  id: string;
  productId: string;
  astrometryRunId: string;
  centroidRunId: string;
  sequence: number;
  status: TTargetPhotometryRunStatus;
  inputs: ITargetPhotometryRequest;
  createdAt: string;
  completedAt?: string;
  result?: ITargetPhotometryResponse;
  error?: string;
}

export type TTargetPhotometryRunsState = {
  [productId: string]: {
    [astrometryRunId: string]: {
      [centroidRunId: string]: ITargetPhotometryRun[];
    };
  };
};
