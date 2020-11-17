import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { ROOT_URL } from '@app/utils/root-url';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { INeatObjectQueryResult } from '@client/app/models/neat-object-query-result.model';
import { INeatObjectQueryResultLabels } from '@client/app/models/neat-object-query-result-labels.model';
import { AppState } from '@client/app/ngrx/reducers';
import { Store } from '@ngrx/store';
import { NeatObjectQuerySetStatus } from '../../../ngrx/actions/neat-object-query.actions';
import { neatObjectQueryResultLabels } from '@client/app/utils/neatObjectQueryResultLabels';
import { DEPLOYMENT_ROOT_URL } from '@client/app/utils/constants';

interface ICatchObjidProbe {
  job_id: string;
  message: string;
  results: string;
  queued: boolean;
}

export type TQueryNeatObject =
  | { status: 'error'; message: string }
  | { status: 'success'; results: INeatObjectQueryResult[] };

type TJobStreamResult =
  | { status: 'error'; message: string }
  | { status: 'success'; job_id: string };

@Injectable({
  providedIn: 'root'
})
export class NeatObjectQueryService {
  constructor(private httpClient: HttpClient, private store: Store<AppState>) {}

  /**
   * Runs sequence of API calls to (i) check for cached data or trigger big query,
   * and (ii) retrieve data
   */
  queryNeatObject(objid: string, isCached?: boolean): Observable<TQueryNeatObject> {
    //
    // Don't allow user to re-compute queries from UI
    isCached = true;

    if (!objid) {
      return of({
        status: 'error',
        message: 'You must provide a target'
      });
    }

    const url =
      DEPLOYMENT_ROOT_URL + `api/query/moving?target=${objid}${isCached ? '' : '&cached=false'}`;

    return this.httpClient.get<ICatchObjidProbe>(url).pipe(
      map((data: ICatchObjidProbe) => {
        return data;
      }),
      // delay(isCached ? 1 * 1000 : 0),
      switchMap(data => {
        if (!data.job_id) {
          throw new Error('No valid job_id was returned');
        }
        // If we did not just trigger a queued query then we can grab results immediately
        if (!data.queued) {
          // console.log('DENIED 1!!!');
          const url2 = DEPLOYMENT_ROOT_URL + `api/caught/${data.job_id}`;
          return this.httpClient
            .get<{ count: number; job_id: string; data: INeatObjectQueryResult[] }>(url2)
            .pipe(
              map(
                (response): TQueryNeatObject => {
                  return { results: response.data, status: 'success' };
                }
              )
            );
        }
        // Else, listen to SSE stream and then grab data
        return from(this.watchJobStream(data.job_id)).pipe(
          switchMap(result => {
            // ------------->>>

            if (result.status === 'error') {
              throw new Error(result.message);
            }

            const job_id = result.job_id;

            const url3 = DEPLOYMENT_ROOT_URL + `api/caught/${job_id}`;
            return this.httpClient
              .get<{ count: number; job_id: string; data: INeatObjectQueryResult[] }>(url3)
              .pipe(
                map(
                  (response): TQueryNeatObject => {
                    // console.log('response.data', response.data);
                    // return response.data;
                    return {
                      results: response.data,
                      status: 'success'
                    };
                  }
                )
              );
          }),
          catchError(
            (e: Error): Observable<TQueryNeatObject> => {
              // Provide info to carry on for now
              return of({
                status: 'error',
                message: e.message
              });
            }
          )
        );
      }),
      catchError(
        (e: Error): Observable<TQueryNeatObject> => {
          // Provide info to carry on for now
          return of({
            status: 'error',
            message: e.message
          });
        }
      )
    );
  }

  watchJobStream(jobId: string): Promise<TJobStreamResult> {
    // ---------------------------------------->>>

    const store = this.store;
    return new Promise<TJobStreamResult>((resolve, reject) => {
      const url = DEPLOYMENT_ROOT_URL + 'api/stream';
      const source = new EventSource(url);
      source.onmessage = function(msgEvent: MessageEvent) {
        try {
          const data: {
            job_prefix: string;
            text: string;
            status: 'success' | 'running' | 'queued' | 'error';
          } = JSON.parse(msgEvent.data);
          const message: string = data.text;

          if (data.status !== 'error' && !!message) {
            store.dispatch(new NeatObjectQuerySetStatus({ message }));
          }
          if (data.status === 'success') {
            this.close(); // Sever connection to SSE route
            resolve({
              status: 'success',
              job_id: jobId
            });
          }
          if (data.status === 'error') {
            this.close();
            console.log('Debug 1', msgEvent.data);
            let errMessage = 'Unknown error occurred while streaming from API';
            if (data.text.includes('Unknown target')) errMessage = 'Unknown Target';
            resolve({
              status: 'error',
              message: errMessage
            });
          }
        } catch (e) {
          console.log('e message', e.message);
          this.close();
          reject(e.message);
        }
      };
    });
  }

  getNeatResultLabels(): Observable<INeatObjectQueryResultLabels> {
    return of(neatObjectQueryResultLabels);
  }
}
