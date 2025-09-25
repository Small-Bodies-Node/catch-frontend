import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of, concat, EMPTY } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  ApiDataAction_FetchData,
  ApiDataAction_SetData,
  ApiDataAction_SetDownloadRowState,
  ApiDataAction_SetJobId,
  ApiDataAction_SetSelectedDatum,
  ApiDataAction_SetShownColState,
  ApiDataAction_SetStatus,
  ApiDataAction_SetSmallBodyType,
} from '../actions/api-data.actions';
import { ApiDataService } from '../../core/services/api-data/api-data.service';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { ISearchParamsMoving } from '../../../models/ISearchParamsMoving';
import { ISearchParamsFixed } from '../../../models/ISearchParamsFixed';
import { getNewDownloadState } from '../../../utils/getNewDownloadState';
import { getSearchDescriptor } from '../../../utils/getSearchDescriptor';
import { colog } from '../../../utils/colog';
import { summarizeAction } from '../../../utils/summarizeAction';
import { initColStateFixed } from '../../../utils/initColStateFixed';
import { initColStateMoving } from '../../../utils/initColStateMoving';
import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import { IApiMovum } from '../../../models/IApiMovum';
import { IApiFixum } from '../../../models/IApiFixum';
import { TApiDataSearch } from '../../../models/TApiDataSearch';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers';
import { selectApiSmallBodyType } from '../selectors/api-data.selectors';

const CACHE_PREFIX = 'api_cache_';
function normalizeForKey(v: any): string {
  if (v === null || typeof v === 'undefined') return 'none';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}
function buildCacheKeyForSearch(search: TApiDataSearch): string {
  if (search.searchType === 'moving') {
    const { target, padding, uncertainty_ellipse, start_date, stop_date, sources } = search.searchParams;
    const sourcesStr = sources && sources.length ? [...sources].sort().join('-') : 'none';
    return [
      'moving',
      normalizeForKey(target),
      normalizeForKey(padding),
      normalizeForKey(uncertainty_ellipse),
      normalizeForKey(start_date),
      normalizeForKey(stop_date),
      sourcesStr,
    ].join('_');
  } else {
    const { ra, dec, radius, intersection_type, start_date, stop_date, sources } = search.searchParams as any;
    const sourcesStr = sources && sources.length ? [...sources].sort().join('-') : 'none';
    return [
      'fixed',
      normalizeForKey(ra),
      normalizeForKey(dec),
      normalizeForKey(radius),
      normalizeForKey(intersection_type),
      normalizeForKey(start_date),
      normalizeForKey(stop_date),
      sourcesStr,
    ].join('_');
  }
}

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
          console.log('An Error happened!');
          snackBar.open(message, 'Close');
          // delayedRouter.delayedRouter('home');
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
  (
    actions$ = inject(Actions),
    apiDataService = inject(ApiDataService),
    localStorageService = inject(LocalStorageService),
    store$ = inject(Store<IAppState>),
  ) => {
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

        // Try cache for moving searches when cached=true
        if (search.searchType === 'moving' && (search.searchParams as ISearchParamsMoving).cached) {
          const cacheKey = CACHE_PREFIX + buildCacheKeyForSearch(search as TApiDataSearch);
          const cached = localStorageService.getAppItemDynamic<{
            apiData: (IApiMovum | IApiFixum)[];
            job_id?: string;
            smallBodyType?: 'asteroid' | 'comet';
            cachedAt?: string;
          }>(cacheKey);
          if (cached && Array.isArray(cached.apiData) && cached.apiData.length) {
            const apiData = cached.apiData;
            const newDownloadRowState = getNewDownloadState(apiData);
            const apiDataShownColState = initColStateMoving;
            return concat(
              of(ApiDataAction_SetData({ apiData })),
              of(ApiDataAction_SetJobId({ job_id: cached.job_id || 'LOCAL_CACHE' })),
              of(ApiDataAction_SetSelectedDatum({ apiDatum: apiData[0] })),
              of(ApiDataAction_SetDownloadRowState({ newDownloadRowState })),
              of(ApiDataAction_SetShownColState({ apiDataShownColState })),
              ...(cached.smallBodyType
                ? [of(ApiDataAction_SetSmallBodyType({ smallBodyType: cached.smallBodyType }))]
                : []),
              of(
                ApiDataAction_SetStatus({
                  search,
                  message: 'Loaded cached results',
                  code: 'found',
                })
              )
            );
          }
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
              console.log('Error received', wrappedApiDataResultOrError);
              return of(
                ApiDataAction_SetStatus({ search, message, code: 'error' })
              );
            }

            // Continue without errors
            const { apiDataResult } = wrappedApiDataResultOrError;
            const apiData = apiDataResult.data;
            const isDataFound = !!apiData.length;
            const newDownloadRowState = getNewDownloadState(apiData);
            const apiDataShownColState =
              searchType === 'moving' ? initColStateMoving : initColStateFixed;

            // initColStateMoving : initColStateFixed;

            if (!true) {
              colog('Summary of fetch:', 'cyan');
              colog('isDataFound:', isDataFound, 'cyan');
              colog('job_id:', job_id, 'cyan');
              colog(
                'newShownColState:',
                JSON.stringify(apiDataShownColState, null, 2),
                'cyan'
              );
            }

            // Save to cache if requested (persist smallBodyType and timestamp)
            try {
              if (
                searchType === 'moving' &&
                (search.searchParams as ISearchParamsMoving).cached
              ) {
                const cacheKey = CACHE_PREFIX + buildCacheKeyForSearch(search as TApiDataSearch);
                let smallBodyType: 'asteroid' | 'comet' | undefined = undefined;
                try {
                  store$.select(selectApiSmallBodyType).pipe(take(1)).subscribe((sbt) => (smallBodyType = sbt || undefined));
                } catch (e) {
                  console.warn('Unable to read smallBodyType from store for caching');
                }
                localStorageService.setAppItemDynamic(cacheKey, {
                  apiData,
                  job_id: job_id || 'N/A',
                  smallBodyType,
                  cachedAt: new Date().toISOString(),
                });
              }
            } catch (e) {
              console.error('Error caching API data', e);
            }

            /**
             * Return multiple actions in specific order using concat operator
             */
            return concat(
              of(ApiDataAction_SetData({ apiData })),
              of(ApiDataAction_SetJobId({ job_id: job_id || 'N/A' })),
              of(ApiDataAction_SetSelectedDatum({ apiDatum: apiData[0] })),
              of(ApiDataAction_SetDownloadRowState({ newDownloadRowState })),
              of(ApiDataAction_SetShownColState({ apiDataShownColState })),
              of(
                ApiDataAction_SetStatus({
                  search,
                  message: message || 'N/A',
                  code: isDataFound ? 'found' : 'notfound',
                })
              )
            );
          }),
          // ...
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
