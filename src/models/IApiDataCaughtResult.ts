import { IApiDatum } from './IApiDatum';

/**
 * Shape of result from ping to "/caught?job_id=ABCDEF"
 */
export interface IApiDataCaughtResult {
  count: number;
  job_id: string;
  data: IApiDatum[];
  version?: string;
  parameters: any;
  status: any;
}
