import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Observable, of, concat } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  ApiDataAction_FetchResult,
  ApiDataAction_SetData,
  ApiDataAction_SetDownloadRowState,
  ApiDataAction_SetJobId,
  ApiDataAction_SetSelectedDatum,
  ApiDataAction_SetStatus,
} from '../actions/api-data.actions';
import { ApiService } from '../../core/services/api/api.service';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { TApiDataResult } from '../../models/TApiResult';

export const fetchApiDataResults$ = createEffect(() => {
  const actions$ = inject(Actions);
  const apiDataService = inject(ApiService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const delayedRouter = inject(DelayedRouterService);

  return actions$.pipe(
    map((action) => {
      // console.log('Action: ', action, new Date().toUTCString());
      return action;
    }),
    ofType(ApiDataAction_FetchResult),
    /**
     * switchMap will flatten nested observables and cancel all but
     * the most recently received observable; we use this to prevent
     * multiple instigations of the API service
     */
    switchMap((action) => {
      const { target, isCached, isUncertaintyEllipse, padding, sources } =
        action;

      return apiDataService
        .fetchApiData(target, isCached, isUncertaintyEllipse, padding, sources)
        .pipe(
          map((apiResult: TApiDataResult) => {
            // console.log('Result received', apiResult);
            return apiResult;
          }),
          switchMap((apiResult) => {
            // Handle error
            if (apiResult.status === 'error') {
              setTimeout(() => router.navigate([''], {}), 50);
              snackBar.open(
                `Error occurred: ${apiResult.message}. JobId: ${apiResult.jobId}`,
                'Close',
                {
                  // duration: 15000,
                }
              );
              return concat(
                of(
                  ApiDataAction_SetStatus({
                    query: {
                      target,
                      isCached,
                      isUncertaintyEllipse,
                      padding,
                      sources,
                    },
                    code: 'notfound',
                  })
                )
              );
            }
            // Continue without errors
            const apiData = apiResult.data;
            const jobId = apiResult.jobId;
            const isDataFound = !!apiData.length;

            // After results received we trigger change of route
            if (isDataFound) {
              delayedRouter.delayedRouter('/data', {
                queryParams: {
                  target,
                  uncertainty_ellipse: isUncertaintyEllipse,
                  cached: isCached,
                  padding,
                  sources,
                },
              });
            } else {
              setTimeout(() => router.navigate([''], {}), 50);
              snackBar.open(
                `Search did not yield data for ${target}. JobId: ${jobId}`,
                'Close',
                {
                  // duration: 5000
                }
              );
            }

            // Reset the array controlling whether a row is selected for downloading
            const newDownloadRowState = apiData.reduce((acc, el) => {
              acc[el.product_id] = false;
              return acc;
            }, {} as { [key: string]: boolean });

            /**
             * Return multiple actions in specific order using concat operator
             */
            return concat(
              // Set results array
              of(ApiDataAction_SetData({ apiData })),
              // Set jobId
              of(ApiDataAction_SetJobId({ jobId })),
              // Set selected datum
              of(
                ApiDataAction_SetSelectedDatum({
                  apiDatum: apiData[0],
                })
              ),
              // Set object to track state of rows to be downloaded
              of(ApiDataAction_SetDownloadRowState({ newDownloadRowState })),
              // Set status of query
              of(
                ApiDataAction_SetStatus({
                  query: {
                    target,
                    isCached,
                    isUncertaintyEllipse,
                    padding,
                    sources,
                  },
                  code: isDataFound ? 'found' : 'notfound',
                })
              )
            );
          })
        );
    })
  );
});
