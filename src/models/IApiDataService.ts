import { Observable } from 'rxjs';

import { TJobStreamResult } from './TJobStreamResult';
import { ISearchParamsMoving } from './ISearchParamsMoving';
import { ISearchParamsFixed } from './ISearchParamsFixed';
import { TWrappedApiDataResultOrError } from './TApiDataResultOrError';
import { TApiDataCatchResultOrError } from './TApiDataCatchResultOrError';

/**
 * Interface to constrain service class that pings api
 */
export interface IApiDataService {
  //

  fetchApiDataFixed: (
    input: ISearchParamsFixed
  ) => Observable<TWrappedApiDataResultOrError>;

  /**
   * Wraps around launchCatchJob and apiCaughtRequest
   */
  fetchApiDataMoving: (
    input: ISearchParamsMoving
  ) => Observable<TWrappedApiDataResultOrError>;

  launchCatchJob: (
    input: ISearchParamsMoving
  ) => Observable<TApiDataCatchResultOrError>;

  apiCaughtRequest: (jobId: string) => Observable<TWrappedApiDataResultOrError>;

  watchJobStream: (
    jobId: string,
    searchParamsMoving: ISearchParamsMoving
  ) => Promise<TJobStreamResult>;

  // mockWatchJobStream: (
  //   jobId: string,
  //   searchParamsMoving: ISearchParamsMoving
  // ) => Promise<TJobStreamResult>;
}
