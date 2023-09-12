import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of, concat } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/core/services/api/api.service';
import {
  ApiActions,
  ApiFetchResult,
  ApiSetDownloadRowState,
  ApiSetData,
  ApiSetStatus,
  EApiActionTypes,
  ApiSetSelectedDatum,
  ApiSetJobId,
} from '../actions/api.actions';
import { DelayedRouterService } from 'src/app/core/services/delayed-router/delayed-router.service';

@Injectable()
export class ApiEffects {
  // --->>>

  constructor(
    private actions$: Actions<ApiFetchResult>,
    private apiDataService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private delayedRouter: DelayedRouterService
  ) {}

  fetchApiDataResults$: Observable<ApiActions> = createEffect(() => {
    return this.actions$.pipe(
      map((action) => {
        // console.log('Action: ', action, new Date().toUTCString());
        return action;
      }),
      ofType(EApiActionTypes.ApiFetchResult),
      /**
       * switchMap will flatten nested observable and cancel all but
       * the most recently received observable; we use this to prevent
       * multiple instigations of the API service
       */
      switchMap((action) => {
        const { target, isCached, isUncertaintyEllipse, padding, sources } =
          action.payload;

        return this.apiDataService
          .fetchApiData(
            target,
            isCached,
            isUncertaintyEllipse,
            padding,
            sources
          )
          .pipe(
            map((_) => {
              // console.log('Result received', _);
              return _;
            }),
            switchMap((apiResult) => {
              // Handle error
              if (apiResult.status === 'error') {
                setTimeout(() => this.router.navigate([''], {}), 50);
                this.snackBar.open(
                  `Error occurred: ${apiResult.message}. JobId: ${apiResult.jobId}`,
                  'Close',
                  {
                    // duration: 15000,
                  }
                );
                return concat(
                  of(
                    new ApiSetStatus({
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
                this.delayedRouter.delayedRouter('/data', {
                  queryParams: {
                    target,
                    uncertainty_ellipse: isUncertaintyEllipse,
                    cached: isCached,
                    padding,
                    sources,
                  },
                });
              } else {
                setTimeout(() => this.router.navigate([''], {}), 50);
                this.snackBar.open(
                  `Search did not yield data for ${target}. JobId: ${jobId}`,
                  'Close',
                  {
                    // duration: 5000
                  }
                );
              }

              // Reset the array controlling whether a row is selected for downloading
              const newDownloadRowState = apiData.reduce((acc, el, ind) => {
                acc[el.product_id] = false;
                return acc;
              }, {} as { [key: string]: boolean });

              /**
               * Return multiple actions in specific order using concat operator
               */
              return concat(
                // Set results array
                of(new ApiSetData({ apiData })),
                // Set jobId
                of(new ApiSetJobId(jobId)),
                // Set selected datum
                of(
                  new ApiSetSelectedDatum({
                    apiDatum: apiData[0],
                  })
                ),
                // Set object to track state of rows to be downloaded
                of(new ApiSetDownloadRowState({ newDownloadRowState })),
                // Set status of query
                of(
                  new ApiSetStatus({
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
}
