import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../ngrx/reducers';
import { IApiDataService } from '../../../../models/IApiDataService';
import { TJobStreamResult } from '../../../../models/TJobStreamResult';
import { IApiServiceStream } from '../../../../models/IApiServiceStream';
import {
  ApiDataAction_SetSmallBodyType,
  ApiDataAction_SetStatus,
} from '../../../ngrx/actions/api-data.actions';
import { ISearchParamsMoving } from '../../../../models/ISearchParamsMoving';
import { ISearchParamsFixed } from '../../../../models/ISearchParamsFixed';
import { getUrlForFixedRoute } from '../../../../utils/getUrlForFixedRoute';
import { getUrlForCatchRoute } from '../../../../utils/getUrlForCatchRoute';
import { IApiDataCatchResult } from '../../../../models/IApiDataCatchResult';
import { TWrappedApiDataResultOrError } from '../../../../models/TApiDataResultOrError';
import { TApiDataCatchResultOrError } from '../../../../models/TApiDataCatchResultOrError';
import {
  apiBaseUrl,
  apiStreamTimeoutSecs,
  mockNetworkDelayMs,
} from '../../../../utils/constants';
import { TApiDataResult } from '../../../../models/IApiDataResult';
import { environment } from '../../../../environments/environment';
import { apiMockResultMoving } from '../../../../utils/apiMockResultMoving';
import { getMockCatchResultOrError } from '../../../../utils/getMockCatchResultOrError';
import { apiMockResultFixed } from '../../../../utils/apiMockResultFixed';
import { MockEventSource } from './MockEventSource';
import { networkErrorMessage } from '../../../../utils/networkErrorMessage';

const isMock = environment.apiData === 'mock';

const headers = new HttpHeaders({
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
});

@Injectable({ providedIn: 'root' })
export class ApiDataService implements IApiDataService {
  // --->>>

  constructor(
    private httpClient: HttpClient,
    private store$: Store<IAppState>
  ) {}

  fetchApiDataFixed(
    input: ISearchParamsFixed
  ): Observable<TWrappedApiDataResultOrError> {
    if (isMock) {
      return of({
        status: 'success',
        apiDataResult: apiMockResultFixed,
        job_id: 'N/A',
      } as const).pipe(delay(mockNetworkDelayMs));
    }

    const catchFixedUrl = getUrlForFixedRoute(input);
    const httpRequest$ = this.httpClient
      .get<TApiDataResult>(catchFixedUrl, { headers })
      .pipe(
        map((apiDataResult) => {
          return {
            status: 'success',
            apiDataResult,
            job_id: 'N/A',
          } as const;
        }),
        catchError((error) => {
          console.error('Err:', JSON.stringify(error.message));
          return of({
            status: 'error',
            message: networkErrorMessage(),
            job_id: 'N/A',
          } as const);
        })
      );
    return httpRequest$;
  }

  fetchApiDataMoving(
    searchParamsMoving: ISearchParamsMoving
  ): Observable<TWrappedApiDataResultOrError> {
    if (!searchParamsMoving.target) {
      return of({
        status: 'error',
        message: 'You must provide a target',
        job_id: 'N/A',
      });
    }

    return this.launchCatchJob(searchParamsMoving).pipe(
      switchMap((apiCatchResult) => {
        if (apiCatchResult.status === 'error') {
          console.error('apiCatchResult', apiCatchResult);
          return of({
            status: 'error',
            message: networkErrorMessage(),
            job_id: 'N/A',
          } as const);
        }
        const { apiDataCatchResult } = apiCatchResult;
        const { job_id, queued } = apiDataCatchResult;

        if (!job_id) {
          return of({
            status: 'error',
            message: 'No valid job_id was returned',
            job_id: 'N/A',
          } as const);
        }

        if (!queued) {
          const caughtResult = this.apiCaughtRequest(job_id).pipe(
            map((apiCaughtRequest): TWrappedApiDataResultOrError => {
              if (apiCaughtRequest.status === 'error') {
                console.error(`Err: ${apiCaughtRequest.message}`);
                return {
                  status: 'error',
                  message: networkErrorMessage(job_id),
                  job_id,
                } as const;
              } else {
                return {
                  apiDataResult: apiCaughtRequest.apiDataResult,
                  job_id,
                  status: 'success',
                } as const;
              }
            }),
            catchError((e: Error): Observable<TWrappedApiDataResultOrError> => {
              console.error('apiCaughtRequest error:', e);
              return of({
                job_id,
                status: 'error',
                message: networkErrorMessage(job_id),
              });
            })
          );
          return caughtResult;
        }

        // Else, listen to SSE stream and then grab data
        const watchJobStream = this.watchJobStream(job_id, searchParamsMoving);
        return from(watchJobStream).pipe(
          switchMap((jobStreamResult) => {
            // --->>

            if (jobStreamResult.status === 'error') {
              console.error('jobStreamResult', jobStreamResult);
              return of({
                status: 'error',
                message: jobStreamResult.message,
                job_id,
              } as const);
            }

            return this.apiCaughtRequest(job_id).pipe(
              map((caughtResult): TWrappedApiDataResultOrError => {
                if (caughtResult.status === 'error') {
                  console.error('caughtResult', caughtResult);
                  return {
                    status: 'error',
                    message: networkErrorMessage(job_id),
                    job_id,
                  } as const;
                }
                return caughtResult;
              }),
              catchError(
                (e: Error): Observable<TWrappedApiDataResultOrError> => {
                  console.error('Error in apiCaughtRequest:', e.message);
                  return of({
                    status: 'error',
                    message: networkErrorMessage(job_id),
                    job_id,
                  });
                }
              )
            );
          }),
          catchError((e: Error): Observable<TWrappedApiDataResultOrError> => {
            console.error('Error in watchJobStream:', e.message);
            return of({
              status: 'error',
              message: networkErrorMessage(job_id),
              job_id,
            });
          })
        );
      }),
      catchError((e: Error): Observable<TWrappedApiDataResultOrError> => {
        console.error('Error in fetchApiData:', e.message);
        return of({
          status: 'error',
          message: networkErrorMessage(),
          job_id: 'N/A',
        });
      })
    );
  }

  launchCatchJob(
    searchParamsMoving: ISearchParamsMoving
  ): Observable<TApiDataCatchResultOrError> {
    if (isMock) {
      this.store$.dispatch(
        ApiDataAction_SetSmallBodyType({ smallBodyType: 'comet' })
      );
      return getMockCatchResultOrError(searchParamsMoving).pipe(
        delay(mockNetworkDelayMs)
      );
    }

    const movingTargetUrl = getUrlForCatchRoute(searchParamsMoving);
    const httpRequest$ = this.httpClient
      .get<IApiDataCatchResult>(movingTargetUrl, { headers })
      .pipe(
        map((apiDataCatchResult) => {
          const { type } = apiDataCatchResult.query;
          this.store$.dispatch(
            ApiDataAction_SetSmallBodyType({
              smallBodyType: type === 'ASTEROID' ? 'asteroid' : 'comet',
            })
          );
          return {
            status: 'success',
            apiDataCatchResult,
          } as const;
        }),
        catchError((error) => {
          console.error('HTTP Error details:', error);
          return of({
            status: 'error',
            message: networkErrorMessage(),
          } as const);
        })
      );
    return httpRequest$;
  }

  apiCaughtRequest(job_id: string): Observable<TWrappedApiDataResultOrError> {
    if (isMock) {
      return of({
        status: 'success',
        apiDataResult: apiMockResultMoving,
        job_id,
      } as const).pipe(delay(mockNetworkDelayMs));
    }

    const caughtUrl = apiBaseUrl + `/caught/${job_id}`;
    try {
      const httpRequest$ = this.httpClient.get<TApiDataResult>(caughtUrl).pipe(
        map((apiDataResult) => {
          return {
            status: 'success',
            apiDataResult,
            job_id,
          } as const;
        }),
        catchError((error) => {
          console.error('HTTP Error details:', error.message);
          return of({
            status: 'error',
            message: networkErrorMessage(job_id),
            job_id,
          } as const);
        })
      );
      return httpRequest$;
    } catch (e) {
      return of({
        status: 'error',
        message: networkErrorMessage(job_id),
        job_id,
      } as const);
    }
  }

  watchJobStream(
    job_id: string,
    searchParamsMoving: ISearchParamsMoving
  ): Promise<TJobStreamResult> {
    // --->>

    // Need handle on store$ for use within callback
    const store$ = this.store$;

    return new Promise<TJobStreamResult>((resolve, reject) => {
      // --->>

      console.log('watchJobStream jobId', job_id);
      const streamUrl = apiBaseUrl + `/stream`;
      console.log('streamUrl', streamUrl);

      const source = isMock
        ? new MockEventSource(job_id, searchParamsMoving)
        : new EventSource(streamUrl);

      const start = new Date();

      // Close shop after waiting long time
      const timer = setTimeout(() => {
        console.log(
          'Query taking too long; go to results...',
          +new Date() - +start
        );
        resolve({
          status: 'error',
          job_id: job_id,
          message: 'Message stream timeout',
        });
        source.close();
      }, apiStreamTimeoutSecs * 1000);

      source.onerror = function (errEvent: Event) {
        console.error(
          `Error handling message stream: ${JSON.stringify(errEvent)}`
        );
        resolve({
          status: 'error',
          job_id: job_id,
          message: networkErrorMessage(job_id),
        });
        clearTimeout(timer);
      };

      // Process streamed messages
      source.onmessage = function (msgEvent: MessageEvent) {
        try {
          // console.log('msgEvent', msgEvent);
          const data: IApiServiceStream = JSON.parse(msgEvent.data);
          const { job_prefix, status, text } = data;

          const isThisJob = job_id.includes(job_prefix);

          // if (isThisJob) console.log('Data stream:', data);

          if (isThisJob && status !== 'error' && !!text) {
            store$.dispatch(
              ApiDataAction_SetStatus({
                message: text,
                code: 'searching',
                search: {
                  searchType: 'moving',
                  searchParams: searchParamsMoving,
                },
              })
            );
          }
          if (isThisJob && status === 'success') {
            this.close(); // Sever connection to SSE route
            resolve({ status: 'success', job_id: job_id });
            console.log('timer', timer);
            clearTimeout(timer);
          }
          if (isThisJob && status === 'error') {
            this.close();
            const errMessage = `Error from server: ${
              text || 'No error message included'
            }`;
            resolve({ status: 'error', message: errMessage, job_id: job_id });
            clearTimeout(timer);
          }
        } catch (e: any) {
          console.error('e message', e.message);
          this.close();
          reject(e.message);
          clearTimeout(timer);
        }
      };
    });
  }
}
