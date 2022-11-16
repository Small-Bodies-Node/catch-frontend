import { IApiDatum } from '../models/IApiDatum';

/**
 * Shape of result from ping to "/caught?job_id=ABCDEF"
 */
export interface IApiCaughtResult {
  count: number;
  job_id: string;
  data: IApiDatum[];
}
