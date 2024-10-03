import { Observable } from 'rxjs';

import { IApiDataCatchResult } from './IApiDataCatchResult';
import { IApiDataCaughtResult } from './IApiDataCaughtResult';
import { TApiDataResult } from './TApiResult';
import { TJobStreamResult } from './TJobStreamResult';
import { TSources } from './TSources';

/**
 * Interface to constrain service class that pings api
 */
export interface IApiDataService {
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
  ) => Observable<IApiDataCatchResult>;

  apiCaughtRequest: (jobId: string) => Observable<IApiDataCaughtResult>;

  watchJobStream: (jobId: string) => Promise<TJobStreamResult>;
}
