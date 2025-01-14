/**
 * Shape of result from ping to "/catch?target=65P&..."
 */
export interface IApiDataCatchResult {
  job_id: string;
  message: string;
  message_stream: string;
  query: {
    cached: boolean;
    padding: number;
    sources: null | any[];
    target: string;
    type: string;
    uncertainty_ellipse: boolean;
  };
  queued: boolean;
  results: string;
  version: string;
}
