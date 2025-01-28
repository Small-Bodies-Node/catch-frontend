import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of, concat, EMPTY } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  ApiDataAction_FetchData,
  ApiDataAction_SetData,
  ApiDataAction_SetDownloadRowState,
  ApiDataAction_SetJobId,
  ApiDataAction_SetSelectedDatum,
  ApiDataAction_SetStatus,
} from '../actions/api-data.actions';
import { ApiDataService } from '../../core/services/api-data/api-data.service';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { ISearchParamsMoving } from '../../../models/ISearchParamsMoving';
import { ISearchParamsFixed } from '../../../models/ISearchParamsFixed';
import { getNewDownloadState } from '../../../utils/getNewDownloadState';
import { getSearchDescriptor } from '../../../utils/getSearchDescriptor';
import { colog } from '../../../utils/colog';
import { summarizeAction } from '../../../utils/summarizeAction';

export const setApiStatus$ = createEffect(
  (
    actions$ = inject(Actions),
    snackBar = inject(MatSnackBar),
    delayedRouter = inject(DelayedRouterService)
  ) => {
    return actions$.pipe(
      map((action) => {
        if (!true) {
          colog('<Action>', 'blue');
          colog(`TYPE: '${action.type}'`, 'blue');
          // colog(summarizeAction(action), 'green');
          colog(JSON.stringify(action, null, 2), 'green');
          colog('</Action>', 'blue');
        }
        return action;
      }),
      ofType(ApiDataAction_SetStatus),
      /**
       * switchMap will flatten nested observables and cancel all but
       * the most recently received observable; we use this to prevent
       * multiple instigations of the API service
       */
      switchMap((apiDataSetStatus) => {
        const { code, message, search } = apiDataSetStatus;

        if (code === 'error') {
          snackBar.open(message, 'Close');
          delayedRouter.delayedRouter('home');
          return of(
            ApiDataAction_SetStatus({
              search: undefined,
              message: 'Ready to fetch data',
              code: 'unset',
            })
          );
        } else if (code === 'found') {
          const queryParams: ISearchParamsMoving | ISearchParamsFixed = {
            ...search.searchParams,
          };
          colog('Redirecting to /data with query params!', 'pink');
          delayedRouter.delayedRouter('data', { queryParams });
        } else if (code === 'notfound') {
          const searchDescriptor = getSearchDescriptor(search);
          snackBar.open(
            `Search did not yield data for '${searchDescriptor}'.`,
            'Close'
          );
          console.error(`The following query did not yield data: ${search}`);
          return of(
            ApiDataAction_SetStatus({
              search: undefined,
              message: 'Ready to fetch data',
              code: 'unset',
            })
          );
        } else if (code === 'initiated') {
          return concat(
            of(
              ApiDataAction_SetStatus({
                search,
                message: 'Waiting for server response...',
                code: 'searching',
              })
            ),
            of(ApiDataAction_FetchData(apiDataSetStatus))
          );
        } else if (code === 'unset') {
          return of(ApiDataAction_FetchData(apiDataSetStatus));
        }
        return EMPTY;
      })
    );
  },
  { functional: true, dispatch: true }
);

export const fetchApiDataResults$ = createEffect(
  (actions$ = inject(Actions), apiDataService = inject(ApiDataService)) => {
    return actions$.pipe(
      map((action) => {
        // console.log('Action: ', action, new Date().toUTCString());
        return action;
      }),
      ofType(ApiDataAction_FetchData),
      /**
       * switchMap will flatten nested observables and cancel all but
       * the most recently received observable; we use this to prevent
       * multiple instigations of the API service
       */
      switchMap((apiDataSetStatus) => {
        const { search } = apiDataSetStatus;
        if (!search) {
          return of(
            ApiDataAction_SetData({
              apiData: undefined,
            })
          );
        }

        const { searchType, searchParams } = search;

        const dataFetchObservable =
          searchType === 'moving'
            ? apiDataService.fetchApiDataMoving(searchParams)
            : apiDataService.fetchApiDataFixed(searchParams);

        return dataFetchObservable.pipe(
          switchMap((wrappedApiDataResultOrError) => {
            // console.log('Result received', wrappedApiDataResultOrError);
            const { status, message, job_id } = wrappedApiDataResultOrError;

            // Handle error
            if (status === 'error') {
              return of(
                ApiDataAction_SetStatus({ search, message, code: 'error' })
              );
            }

            // Continue without errors
            const { apiDataResult } = wrappedApiDataResultOrError;
            const apiData = apiDataResult.data;
            const isDataFound = !!apiData.length;
            const newDownloadRowState = getNewDownloadState(apiData);

            if (true) {
              colog('Summary of fetch:', 'cyan');
              colog('isDataFound:', isDataFound, 'cyan');
              colog('job_id:', job_id, 'cyan');
            }

            /**
             * Return multiple actions in specific order using concat operator
             */
            return concat(
              of(ApiDataAction_SetData({ apiData })),
              of(ApiDataAction_SetJobId({ job_id: job_id || 'N/A' })),
              of(ApiDataAction_SetSelectedDatum({ apiDatum: apiData[0] })),
              of(ApiDataAction_SetDownloadRowState({ newDownloadRowState })),
              of(
                ApiDataAction_SetStatus({
                  search,
                  message: message || 'N/A',
                  code: isDataFound ? 'found' : 'notfound',
                })
              )
            );
          }),
          //

          takeUntil(
            actions$.pipe(
              ofType(ApiDataAction_FetchData),
              map((action) => {
                console.log('Cancel Action ?:', !action.search);
                return !action.search;
              }),
              filter(Boolean)
            )
          )

          //
        );
      })
    );
  },
  { functional: true, dispatch: true }
);
