import { Observable } from 'rxjs';

import { IApiDataCatchResult } from './IApiDataCatchResult';
import { IApiDataCaughtResult } from './IApiDataCaughtResult';
import { TApiDataResult } from './TApiDataResult';
import { TJobStreamResult } from './TJobStreamResult';
import { TControlKeyForSources } from './TControlKeyForSources';

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
    sources: TControlKeyForSources[]
  ) => Observable<TApiDataResult>;

  launchCatchJob: (
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TControlKeyForSources[]
  ) => Observable<IApiDataCatchResult>;

  apiCaughtRequest: (jobId: string) => Observable<IApiDataCaughtResult>;

  watchJobStream: (jobId: string) => Promise<TJobStreamResult>;
}
