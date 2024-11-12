import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { IApiDataService } from '../../../../models/IApiDataService';
import { IAppState } from '../../../ngrx/reducers';
import { TSources } from '../../../../models/TSources';
import { TApiDataResult } from '../../../../models/TApiResult';
import { TJobStreamResult } from '../../../../models/TJobStreamResult';
import { IApiServiceStream } from '../../../../models/IApiServiceStream';
import { ApiDataAction_SetStatus } from '../../../ngrx/actions/api-data.actions';
import { IApiDataCatchResult } from '../../../../models/IApiDataCatchResult';
import { IApiDataCaughtResult } from '../../../../models/IApiDataCaughtResult';
import { apiBaseUrl, apiStreamTimeoutSecs } from '../../../../utils/constants';

@Injectable({ providedIn: 'root' })
export class ApiDataService implements IApiDataService {
  // --->>>

  constructor(
    private httpClient: HttpClient,
    private store$: Store<IAppState>
  ) {}

  /**
   * Description: trigger a search for target in specified data set sources,
   *  receive a jobId which can be used to stream progress of search, and to
   *  fetch finalized results
   *
   * Route: /catch
   *
   * Query Params:
   *  - target
   *  - sources
   *  - uncertainty_ellipse
   *  - padding
   *
   * Return Body:
   * {
   *  "job_id": "b17e9124ef594d22b711f72531f6741f",
   *  "message": "Enqueued search. ...",
   *  "message_stream": "http://catch-v2.astro-prod-it.aws.umd.edu/stream",
   *  "query": {
   *    "cached": true,
   *    "padding": 0,
   *    "sources": [
   *      ...
   *    ],
   *    "target": "65P",
   *    "type": "COMET",
   *    "uncertainty_ellipse": false
   *  },
   *  "queued": true,
   *  ...
   * }
   */
  getPanstarrsData(
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TSources[]
  ): Observable<IApiDataCatchResult> {
    const sourceStr = sources.reduce((acc, source) => {
      acc += '&sources=' + source;
      return acc;
    }, '');

    // Need this hack for now because API will refuse padding <= 0
    const effectivePadding = padding < 0.01 ? '' : `&padding=${padding}`;

    console.log('padding', padding, typeof padding);
    console.log('effectivePadding', effectivePadding, typeof effectivePadding);
    console.log('sourceStr', sourceStr);

    let catchUrl =
      apiBaseUrl +
      `/catch?cached=${isCached ? 'true' : 'false'}` +
      `&target=${target}` +
      `&uncertainty_ellipse=${isUncertaintyEllipse ? 'true' : 'false'}` +
      effectivePadding +
      sourceStr;

    // catchUrl = `https://catch-dev-api.astro.umd.edu/catch?target=562273&cached=true`;

    // fetch(catchUrl)
    //   .then((response) => response.json())
    //   .then((data) => console.log('Fetch succeeded:', data))
    //   .catch((error) => console.log('Fetch failed:', error));

    console.log('catchUrl >>> ', catchUrl);

    return this.httpClient
      .get<IApiDataCatchResult>(catchUrl, {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        }),
      })
      .pipe(
        map((_) => {
          console.log(_);
          return _;
        }),
        catchError((error) => {
          console.error('HTTP Error:', error);
          console.log('Full error object:', error);
          console.log('Response headers:', error?.headers);
          console.log('Status:', error?.status);
          console.log('Type:', error?.type);
          // Prevent the app from reloading by returning an observable
          return of({
            job_id: 'XXX',
            message: '',
            message_stream: '',
            query: {
              cached: true,
              padding: 0,
              sources: [],
              target: '',
              type: '',
              uncertainty_ellipse: false,
            },
            queued: true,
            results: '',
            version: '',
          }); // or some default value matching IApiDataCatchResult
        })
      );
  }

  /**
   * Description: ping route to get computed data for a given job
   *
   * Route: /caught/JOBID
   *
   * Return Body:
   * {
   *  "count": 0,
   *  "data": [...]
   * }
   */
  apiCaughtRequest(jobId: string): Observable<IApiDataCaughtResult> {
    const caughtUrl = apiBaseUrl + `/caught/${jobId}`;
    console.log('caughtUrl >>> ', caughtUrl);
    // return this.httpClient.get<IApiDataCaughtResult>(caughtUrl);
    let x: any;
    try {
      x = this.httpClient.get<IApiDataCaughtResult>(caughtUrl).pipe(
        catchError((error) => {
          console.error('HTTP Error details:', error);
          // debugger; // This will pause execution if devtools is open
          // throw error; // Re-throw to maintain error flow
          return of({});
        })
      );
      // .subscribe({
      //   next: (data) => console.log('Data received:', data),
      //   error: (err) => console.error('Subscription error:', err),
      //   complete: () => console.log('HTTP call completed'),
      // });
    } catch (e) {
      console.error('Outer try-catch caught:', e);
      debugger;
    }
    return x;
  }

  /**
   * Runs sequence of API calls to:
   * (i) check for cached data or trigger big query,
   * (ii) retrieve data
   */
  fetchApiData(
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TSources[]
  ): Observable<TApiDataResult> {
    // --->>

    console.log('<< FETCHING REAL DATA >>');

    if (!target) {
      return of({
        status: 'error',
        message: 'You must provide a target',
        jobId: 'N/A',
      });
    }

    return this.getPanstarrsData(
      target,
      isCached,
      isUncertaintyEllipse,
      padding,
      sources
    ).pipe(
      switchMap((apiCatchResult) => {
        // --->>

        console.log(JSON.stringify(apiCatchResult, null, 2));

        const { job_id, queued } = apiCatchResult;
        if (!job_id) {
          throw new Error('No valid job_id was returned');
        }

        if (!queued) {
          return this.apiCaughtRequest(job_id).pipe(
            map(({ data, job_id }): TApiDataResult => {
              console.log('apiCaughtRequest data:', data);
              return { data, jobId: job_id, status: 'success' };
            }),
            catchError((e: Error): Observable<TApiDataResult> => {
              console.log('apiCaughtRequest error:', e);
              return of({
                jobId: job_id,
                status: 'error',
                message: e.message,
              });
            })
          );
        }

        // Else, listen to SSE stream and then grab data
        return from(this.watchJobStream(job_id)).pipe(
          switchMap((jobStreamResult) => {
            // --->>

            if (jobStreamResult.status === 'error') {
              throw new Error(jobStreamResult.message);
            }

            return this.apiCaughtRequest(job_id).pipe(
              map(({ data }): TApiDataResult => {
                return { data, jobId: job_id, status: 'success' };
              }),
              catchError((e: Error): Observable<TApiDataResult> => {
                return of({
                  status: 'error',
                  message: e.message,
                  jobId: job_id,
                });
              })
            );
          }),
          catchError((e: Error): Observable<TApiDataResult> => {
            console.error('Error in watchJobStream:', e.message);
            return of({
              status: 'error',
              message: e.message,
              jobId: job_id,
            });
          })
        );
      }),
      catchError((e: Error): Observable<TApiDataResult> => {
        console.error('Error in fetchApiData:', e.message);
        return of({
          status: 'error',
          message: e.message,
          jobId: 'N/A',
        });
      })
    );
  }

  /**
   * - Watches route /stream
   * - When message is received, it updates store$ so that message shows
   *    on search page; sort of a side-effect
   * - When message received with status "success", promise is resolved
   *    (allowing subsequent action to be taken)
   */
  watchJobStream(jobId: string): Promise<TJobStreamResult> {
    // --->>

    // Need handle on store$ for use within callback
    const store$ = this.store$;

    return new Promise<TJobStreamResult>((resolve, reject) => {
      // --->>

      console.log('watchJobStream jobId', jobId);
      const streamUrl = apiBaseUrl + `/stream`;
      const source = new EventSource(streamUrl);
      const start = new Date();
      const timer = setTimeout(() => {
        console.log(
          'Query taking too long; go to results...',
          +new Date() - +start
        );
        resolve({ status: 'success', job_id: jobId });
        source.close();
      }, apiStreamTimeoutSecs * 1000);

      source.onmessage = function (msgEvent: MessageEvent) {
        try {
          const data: IApiServiceStream = JSON.parse(msgEvent.data);
          const { job_prefix, status, text } = data;
          console.log('Data stream:', data);

          if (
            status !== 'error' &&
            !!text &&
            !text.includes('Obtained ephemeris')
          ) {
            store$.dispatch(ApiDataAction_SetStatus({ message: text }));
          }
          if (status === 'success' && jobId.includes(job_prefix)) {
            this.close(); // Sever connection to SSE route
            resolve({ status: 'success', job_id: jobId });
            console.log('timer', timer);
            clearTimeout(timer);
          }
          if (status === 'error') {
            this.close();
            let errMessage = 'Unknown error occurred while streaming from API';
            if (text.includes('Unknown target')) errMessage = 'Unknown Target';
            resolve({ status: 'error', message: errMessage });
            clearTimeout(timer);
          }
        } catch (e: any) {
          console.log('e message', e.message);
          this.close();
          reject(e.message);
          clearTimeout(timer);
        }
      };
    });
  }
}
