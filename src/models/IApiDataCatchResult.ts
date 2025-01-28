import { TControlKeyForSources } from './TControlKeyForSources';

/**
 * Shape of result from ping to "/catch?target=65P&..."
 */
export interface IApiDataCatchResult {
  job_id: string;
  message: string;
  query: {
    target: string;
    cached: boolean;
    padding: number;
    type: string;
    sources: TControlKeyForSources[];
    uncertainty_ellipse: boolean;
    start_date: string | null;
    stop_date: string | null;
  };
  queued: boolean;
  results: string;
  version: string;
}
