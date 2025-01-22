import { IApiFixum } from './IApiFixum';

/**
 * Shape of result from ping to "/caught?job_id=ABCDEF"
 */
export interface IApiFixedResult {
  count: number;
  data: IApiFixum[];
  message: string;
  version: string;
  query: any;
}
