import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of, concat } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  ApiFixedAction_FetchResult,
  ApiFixedAction_FixedLoaded,
  ApiFixedAction_SetDownloadRowState,
  ApiFixedAction_SetFixed,
  ApiFixedAction_SetSelectedFixum,
  ApiFixedAction_SetStatus,
} from '../actions/api-fixed.actions';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { environment } from '../../../environments/environment';
import { ApiFixedService } from '../../core/services/api-fixed/api-fixed.service';
import { ApiFixedMockService } from '../../core/services/api-fixed/api-fixed-mock.service';
import { TApiFixedResult } from '../../../models/TApiFixedResult';
import { IApiFixum } from '../../../models/IApiFixum';

export const fetchApiFixedResults$ = createEffect(
  (
    actions$ = inject(Actions),
    snackBar = inject(MatSnackBar),
    delayedRouter = inject(DelayedRouterService),
    apiFixedService = environment.apiData === 'mock'
      ? inject(ApiFixedMockService)
      : inject(ApiFixedService)
  ) => {
    return actions$.pipe(
      map((action) => {
        // console.log('Action: ', action, new Date().toUTCString());
        return action;
      }),
      ofType(ApiFixedAction_FetchResult),
      /**
       * switchMap will flatten nested observables and cancel all but
       * the most recently received observable; we use this to prevent
       * multiple instigations of the API service
       */
      switchMap((action) => {
        const {
          ra,
          dec,
          intersectionType,
          radius,
          type,
          startTime: startDate,
          stopTime: stopDate,
          sources,
        } = action;

        return apiFixedService
          .fetchApiFixed(
            ra,
            dec,
            sources,
            intersectionType,
            radius,
            startDate,
            stopDate
          )
          .pipe(
            map((apiResult: TApiFixedResult) => {
              // console.log('Result received', apiResult);
              return apiResult;
            }),
            switchMap((apiResult) => {
              // Handle error
              if (apiResult.status === 'error') {
                // setTimeout(() => router.navigate([''], {}), 5000000);
                console.log('Error occurred:', apiResult.message);
                snackBar.open(`Error occurred: ${apiResult.message}.`, 'Close');
                return concat(
                  of(
                    ApiFixedAction_SetStatus({
                      query: {
                        ra,
                        dec,
                        sources,
                        intersectionType,
                        radius,
                        startTime: startDate,
                        stopTime: stopDate,
                      },
                      code: 'notfound',
                    })
                  )
                );
              }
              // Continue without errors
              const apiFixedResult = apiResult.apiFixedResult;
              const isDataFound = !!apiFixedResult.data.length;

              // After results received we trigger change of route
              if (isDataFound) {
                delayedRouter.delayedRouter('/fixed', {
                  queryParams: {
                    ra,
                    dec,
                    sources,
                    intersection_type: intersectionType,
                    radius,
                    start_date: startDate,
                    stop_date: stopDate,
                  },
                });
              } else {
                // setTimeout(() => router.navigate([''], {}), 50000);
                snackBar.open(
                  `Search did not yield data for ${ra}, ${dec}. `,
                  'Close',
                  {
                    // duration: 5000
                  }
                );
              }

              // Reset the array controlling whether a row is selected for downloading
              const newDownloadRowState = apiFixedResult.data.reduce(
                (acc, el: IApiFixum) => {
                  acc[el.product_id] = false;
                  return acc;
                },
                {} as { [key: string]: boolean }
              );

              /**
               * Return multiple actions in specific order using concat operator
               */
              return concat(
                // Set results array
                of(ApiFixedAction_SetFixed({ apiFixed: apiFixedResult.data })),
                // Set selected datum
                of(
                  ApiFixedAction_SetSelectedFixum({
                    apiFixum: apiFixedResult.data[0],
                  })
                ),
                // Set object to track state of rows to be downloaded
                of(ApiFixedAction_SetDownloadRowState({ newDownloadRowState })),
                // Set status of query
                of(
                  ApiFixedAction_SetStatus({
                    query: {
                      ra,
                      dec,
                      sources,
                      intersectionType,
                      radius,
                      startTime: startDate,
                      stopTime: stopDate,
                    },
                    code: isDataFound ? 'found' : 'notfound',
                  })
                )
              );
            })
          );
      })
    );
  },
  { functional: true, dispatch: true }
);
