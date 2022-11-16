import { IApiDatum } from '../models/IApiDatum';

/**
 * Shape of data to be returned by the api-service method that wraps around individual calls to the api; this is the neat, summary result of going from input to output, e.g. "65P" => TApiDataResult
 */
export type TApiDataResult =
  | { status: 'error'; message: string }
  | { status: 'success'; data: IApiDatum[] };
