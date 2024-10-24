import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Observable,
  of,
  delay,
  switchMap,
  map,
  catchError,
  from,
  concatAll,
  concatMap,
  Subscription,
} from 'rxjs';

import { IApiDataService } from '../../../../models/IApiDataService';
import { IApiServiceStream } from '../../../../models/IApiServiceStream';
import { TJobStreamResult } from '../../../../models/TJobStreamResult';
import { TSources } from '../../../../models/TSources';
import { IAppState } from '../../../ngrx/reducers';
import { TApiDataResult } from '../../../../models/TApiResult';
import { IApiDataCatchResult } from '../../../../models/IApiDataCatchResult';
import { IApiDataCaughtResult } from '../../../../models/IApiDataCaughtResult';
import { mockStreamMessages } from '../../../../utils/mockStreamMessages';
import { ApiDataAction_SetStatus } from '../../../ngrx/actions/api-data.actions';
import { apiDataMockResult } from '../../../../utils/apiDataMockResult';

const mockTime1 = 0;
const mockTime2 = 0;

const numResults = 100;

@Injectable({
  providedIn: 'root',
})
export class ApiDataMockService implements IApiDataService {
  // --->>>

  constructor(private store$: Store<IAppState>) {}

  fetchApiData(
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TSources[]
  ): Observable<TApiDataResult> {
    // --->>

    false &&
      console.log(
        '<< FETCHING MOCK DATA >>',
        target,
        isCached,
        isUncertaintyEllipse,
        padding,
        sources
      );

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

        false && console.log(' << MOCK CATCH REQUEST >> ', apiCatchResult);
        const { job_id, queued } = apiCatchResult;
        if (!job_id) {
          throw new Error('No valid job_id was returned');
        }

        if (!queued) {
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
                return {
                  data,
                  jobId: job_id,
                  status: 'success',
                };
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
            return of({
              status: 'error',
              message: e.message,
              jobId: job_id,
            });
          })
        );
      }),
      catchError((e: Error): Observable<TApiDataResult> => {
        return of({
          status: 'error',
          message: e.message,
          jobId: 'N/A',
        });
      })
    );
  }

  getPanstarrsData(
    target: string,
    isCached: boolean,
    isUncertaintyEllipse: boolean,
    padding: number,
    sources: TSources[]
  ): Observable<IApiDataCatchResult> {
    // --->>

    const result = of({
      job_id: 'e8c4f483ffd34552a58a315f8a65ef92',
      message: isCached
        ? 'Found cached data.  Retrieve from results URL.'
        : `Enqueued search.  Listen to task messaging stream until job completed, then retrieve data from results URL.`,
      message_stream: 'http://catch-dev-api.astro.umd.edu/stream',
      query: {
        cached: isCached,
        padding: 0,
        sources: sources,
        target: '65P',
        type: 'COMET',
        uncertainty_ellipse: isUncertaintyEllipse,
      },
      queued: !isCached,
      results:
        'http://catch-dev-api.astro.umd.edu/caught/e8c4f483ffd34552a58a315f8a65ef92',
      version: '2.0.0-dev0',
    });
    return result;
  }

  apiCaughtRequest(jobId: string): Observable<IApiDataCaughtResult> {
    // --->>

    console.log(' << MOCK CAUGHT REQUEST >> ');
    return of({
      count: 10,
      job_id: jobId,
      data: apiDataMockResult.data
        .filter((_, ind) => {
          // return true;
          return [
            `neat_palomar_tricam`,
            `neat_maui_geodss`,
            `skymapper`,
            `ps1dr2`,
            `catalina_bigelow`,
            `catalina_lemmon`,
            `catalina_kittpeak`,
            `catalina_bokneosurvey`,
            `spacewatch`,
          ].includes(_.source);
        })
        .filter((_, ind) => ind < 50),
    }).pipe(delay<IApiDataCaughtResult>(mockTime1));
  }

  watchJobStream(jobId: string): Promise<TJobStreamResult> {
    // --->>

    const store$ = this.store$;
    let subscription: Subscription;

    return new Promise<TJobStreamResult>((resolve, reject) => {
      // --->>

      subscription = of<IApiServiceStream[]>(mockStreamMessages)
        .pipe(
          concatAll(), // flatten the array into individual next notifications
          concatMap((message) => of(message).pipe(delay(mockTime2)))
        )
        .subscribe(({ job_prefix, status, text }) => {
          console.log('>>>>>', job_prefix, status, text);
          store$.dispatch(ApiDataAction_SetStatus({ message: text }));

          if (status === 'success') {
            resolve({ job_id: jobId, status });
            subscription.unsubscribe();
          }
        });
    });
  }
}
