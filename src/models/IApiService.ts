import { Observable } from 'rxjs';
import { IApiCatchResult } from '../utils/IApiCatchResult';
import { IApiCaughtResult } from '../utils/IApiCaughtResult';
import { TApiDataResult } from '../utils/TApiResult';
import { TJobStreamResult } from './TJobStreamResult';
import { TSources } from './TSources';

/**
 * Interface to constrain service class that pings api
 */
export interface IApiService {
  //

  fetchApiData: (
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TSources[]
  ) => Observable<TApiDataResult>;

  apiCatchRequest: (
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TSources[]
  ) => Observable<IApiCatchResult>;

  apiCaughtRequest: (jobId: string) => Observable<IApiCaughtResult>;

  watchJobStream: (jobId: string) => Promise<TJobStreamResult>;
}
