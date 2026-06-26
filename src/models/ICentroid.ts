import { ICatResponseCache } from './ICatResponseCache';

export interface ICentroidRequest {
  file: string;
  target_x: number;
  target_y: number;
  search_radius: number;
  astrometry_center_x?: number;
  astrometry_center_y?: number;
}

export interface ICentroidSearchResults {
  init_guess_x: number;
  init_guess_y: number;
  search_radius: number;
  cent_x: number;
  cent_y: number;
}

export interface ICentroidResponse {
  search_results: ICentroidSearchResults;
  centroid_figure?: string;
  centroid_figure_url?: string;
  centroid_figure_s3_key?: string;
  cache?: ICatResponseCache;
}

export type TCentroidRunStatus = 'running' | 'complete' | 'error';

export interface ICentroidRun {
  id: string;
  productId: string;
  astrometryRunId: string;
  sequence: number;
  status: TCentroidRunStatus;
  inputs: ICentroidRequest;
  createdAt: string;
  completedAt?: string;
  result?: ICentroidResponse;
  error?: string;
}

export type TCentroidRunsState = {
  [productId: string]: {
    [astrometryRunId: string]: ICentroidRun[];
  };
};

export interface ICentroidization {
  productId: string;
  astrometryRunId: string;
  centroidRunId: string;
  initX: number;
  initY: number;
  astrometryCenterX?: number;
  astrometryCenterY?: number;
  centX: number;
  centY: number;
}

export type TCentroidizationState = { [productId: string]: ICentroidization };
