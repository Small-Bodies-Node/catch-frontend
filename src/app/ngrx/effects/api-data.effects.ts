import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, concat, EMPTY, from } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, takeUntil, tap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  ApiDataAction_ClearActiveDatum,
  ApiDataAction_FetchData,
  ApiDataAction_SetActiveDatum,
  ApiDataAction_SetAnalysisSelectionState,
  ApiDataAction_BeginAstrometryRun,
  ApiDataAction_CompleteAstrometryRun,
  ApiDataAction_SetData,
  ApiDataAction_FailAstrometryRun,
  ApiDataAction_BeginCentroidRun,
  ApiDataAction_CompleteCentroidRun,
  ApiDataAction_FailCentroidRun,
  ApiDataAction_BeginTargetPhotometryRun,
  ApiDataAction_CompleteTargetPhotometryRun,
  ApiDataAction_FailTargetPhotometryRun,
  ApiDataAction_SetJobId,
  ApiDataAction_SetShownColState,
  ApiDataAction_SetStatus,
  ApiDataAction_SetSmallBodyType,
} from '../actions/api-data.actions';
import { ApiDataService } from '../../core/services/api-data/api-data.service';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { ISearchParamsMoving } from '../../../models/ISearchParamsMoving';
import { ISearchParamsFixed } from '../../../models/ISearchParamsFixed';
import { getNewAnalysisSelectionState } from '../../../utils/getNewAnalysisSelectionState';
import { getSearchDescriptor } from '../../../utils/getSearchDescriptor';
import { colog } from '../../../utils/colog';
import { summarizeAction } from '../../../utils/summarizeAction';
import { initColStateFixed } from '../../../utils/initColStateFixed';
import { initColStateMoving } from '../../../utils/initColStateMoving';
import { IndexedDbCacheService } from '../../core/services/indexeddb-cache/indexeddb-cache.service';
import { IApiMovum } from '../../../models/IApiMovum';
import { IApiFixum } from '../../../models/IApiFixum';
import { TApiDataSearch } from '../../../models/TApiDataSearch';
import { Action, Store } from '@ngrx/store';
import { IAppState } from '../reducers';
import { selectApiSmallBodyType } from '../selectors/api-data.selectors';
import { CatApiService } from '../../core/services/cat-api/cat-api.service';
import { TColStateMoving } from '../../../models/TColStateMoving';
import { TColStateFixed } from '../../../models/TColStateFixed';
import { CentroidService } from '../../core/services/centroid/centroid.service';
import { IAstrometryErrorResponse } from '../../../models/IAstrometryRun';
import { TargetPhotometryService } from '../../core/services/target-photometry/target-photometry.service';

const CACHE_PREFIX = 'api_cache_';
function normalizeForKey(v: any): string {
  if (v === null || typeof v === 'undefined') return 'none';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}
function buildCacheKeyForSearch(search: TApiDataSearch): string {
  if (search.searchType === 'moving') {
    const { target, padding, uncertainty_ellipse, start_date, stop_date, sources } =
      search.searchParams;
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
    const { ra, dec, radius, intersection_type, start_date, stop_date, sources } =
      search.searchParams as any;
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

function buildApiDataLoadedActions({
  apiData,
  apiDataShownColState,
  jobId,
  message,
  search,
  smallBodyType,
}: {
  apiData: (IApiMovum | IApiFixum)[];
  apiDataShownColState: Readonly<TColStateMoving> | Readonly<TColStateFixed>;
  jobId?: string;
  message: string;
  search: TApiDataSearch;
  smallBodyType?: 'asteroid' | 'comet';
}) {
  const isDataFound = apiData.length > 0;
  const newAnalysisSelectionState = getNewAnalysisSelectionState(apiData);
  const activeDatumAction: Action = isDataFound
    ? ApiDataAction_SetActiveDatum({ apiDatum: apiData[0] })
    : ApiDataAction_ClearActiveDatum();

  return concat(
    of(ApiDataAction_SetData({ apiData })),
    of(ApiDataAction_SetJobId({ job_id: jobId || 'N/A' })),
    of(activeDatumAction),
    of(ApiDataAction_SetAnalysisSelectionState({ newAnalysisSelectionState })),
    of(ApiDataAction_SetShownColState({ apiDataShownColState })),
    ...(smallBodyType ? [of(ApiDataAction_SetSmallBodyType({ smallBodyType }))] : []),
    of(
      ApiDataAction_SetStatus({
        search,
        message: message || 'N/A',
        code: isDataFound ? 'found' : 'notfound',
      }),
    ),
  );
}

export const setApiStatus$ = createEffect(
  (
    actions$ = inject(Actions),
    snackBar = inject(MatSnackBar),
    delayedRouter = inject(DelayedRouterService),
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
            }),
          );
        } else if (code === 'found') {
          const queryParams: ISearchParamsMoving | ISearchParamsFixed = {
            ...search.searchParams,
          };
          colog('Redirecting to /data with query params!', 'pink');
          delayedRouter.delayedRouter('data', { queryParams });
        } else if (code === 'notfound') {
          const searchDescriptor = getSearchDescriptor(search);
          snackBar.open(`Search did not yield data for '${searchDescriptor}'.`, 'Close');
          console.error(`The following query did not yield data: ${search}`);
          return of(
            ApiDataAction_SetStatus({
              search: undefined,
              message: 'Ready to fetch data',
              code: 'unset',
            }),
          );
        } else if (code === 'initiated') {
          return concat(
            of(
              ApiDataAction_SetStatus({
                search,
                message: 'Waiting for server response...',
                code: 'searching',
              }),
            ),
            of(ApiDataAction_FetchData(apiDataSetStatus)),
          );
        } else if (code === 'unset') {
          return of(ApiDataAction_FetchData(apiDataSetStatus));
        }
        return EMPTY;
      }),
    );
  },
  { functional: true, dispatch: true },
);

export const fetchApiDataResults$ = createEffect(
  (
    actions$ = inject(Actions),
    apiDataService = inject(ApiDataService),
    indexedDbCacheService = inject(IndexedDbCacheService),
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
          return concat(
            of(
              ApiDataAction_SetData({
                apiData: undefined,
              }),
            ),
            of(ApiDataAction_ClearActiveDatum()),
          );
        }

        // Try cache for moving searches when cached=true (IndexedDB)
        if (search.searchType === 'moving' && (search.searchParams as ISearchParamsMoving).cached) {
          const cacheKey = CACHE_PREFIX + buildCacheKeyForSearch(search as TApiDataSearch);
          return from(
            indexedDbCacheService.get<{
              apiData: (IApiMovum | IApiFixum)[];
              job_id?: string;
              smallBodyType?: 'asteroid' | 'comet';
              cachedAt?: string;
            }>(cacheKey),
          ).pipe(
            switchMap((cached) => {
              if (cached && Array.isArray(cached.apiData) && cached.apiData.length) {
                const apiData = cached.apiData;
                const apiDataShownColState = initColStateMoving;
                return buildApiDataLoadedActions({
                  apiData,
                  apiDataShownColState,
                  jobId: cached.job_id || 'LOCAL_CACHE',
                  message: 'Loaded cached results',
                  search,
                  smallBodyType: cached.smallBodyType,
                });
              }

              // Else fall through to network fetch below (we are in a 'moving' branch)
              const dataFetchObservable = apiDataService.fetchApiDataMoving(
                search.searchParams as ISearchParamsMoving,
              );

              return dataFetchObservable.pipe(
                switchMap((wrappedApiDataResultOrError) => {
                  const { status, message, job_id } = wrappedApiDataResultOrError;
                  if (status === 'error') {
                    return of(ApiDataAction_SetStatus({ search, message, code: 'error' }));
                  }

                  const { apiDataResult } = wrappedApiDataResultOrError;
                  const apiData = apiDataResult.data;
                  const apiDataShownColState =
                    search.searchType === 'moving' ? initColStateMoving : initColStateFixed;

                  // Persist to IndexedDB cache (fire-and-forget)
                  try {
                    if (
                      search.searchType === 'moving' &&
                      (search.searchParams as ISearchParamsMoving).cached
                    ) {
                      let smallBodyType: 'asteroid' | 'comet' | undefined = undefined;
                      try {
                        store$
                          .select(selectApiSmallBodyType)
                          .pipe(take(1))
                          .subscribe((sbt) => (smallBodyType = sbt || undefined));
                      } catch (e) {
                        console.warn('Unable to read smallBodyType from store for caching');
                      }
                      const payload = {
                        apiData,
                        job_id: job_id || 'N/A',
                        smallBodyType,
                        cachedAt: new Date().toISOString(),
                      };
                      void indexedDbCacheService.set(cacheKey, payload);
                    }
                  } catch (e) {
                    console.error('Error caching API data to IndexedDB', e);
                  }

                  return buildApiDataLoadedActions({
                    apiData,
                    apiDataShownColState,
                    jobId: job_id || 'N/A',
                    message: message || 'N/A',
                    search,
                  });
                }),
                takeUntil(
                  actions$.pipe(
                    ofType(ApiDataAction_FetchData),
                    map((action) => {
                      console.log('Cancel Action ?:', !action.search);
                      return !action.search;
                    }),
                    filter(Boolean),
                  ),
                ),
              );
            }),
          );
        }

        const dataFetchObservable =
          search.searchType === 'moving'
            ? apiDataService.fetchApiDataMoving(search.searchParams as ISearchParamsMoving)
            : apiDataService.fetchApiDataFixed(search.searchParams as ISearchParamsFixed);

        return dataFetchObservable.pipe(
          switchMap((wrappedApiDataResultOrError) => {
            // console.log('Result received', wrappedApiDataResultOrError);
            const { status, message, job_id } = wrappedApiDataResultOrError;

            // Handle error
            if (status === 'error') {
              console.log('Error received', wrappedApiDataResultOrError);
              return of(ApiDataAction_SetStatus({ search, message, code: 'error' }));
            }

            // Continue without errors
            const { apiDataResult } = wrappedApiDataResultOrError;
            const apiData = apiDataResult.data;
            const isDataFound = apiData.length > 0;
            const apiDataShownColState =
              search.searchType === 'moving' ? initColStateMoving : initColStateFixed;

            // initColStateMoving : initColStateFixed;

            if (!true) {
              colog('Summary of fetch:', 'cyan');
              colog('isDataFound:', isDataFound, 'cyan');
              colog('job_id:', job_id, 'cyan');
              colog('newShownColState:', JSON.stringify(apiDataShownColState, null, 2), 'cyan');
            }

            // Save to cache if requested (persist smallBodyType and timestamp) - IndexedDB
            try {
              if (
                search.searchType === 'moving' &&
                (search.searchParams as ISearchParamsMoving).cached
              ) {
                const cacheKey = CACHE_PREFIX + buildCacheKeyForSearch(search as TApiDataSearch);
                let smallBodyType: 'asteroid' | 'comet' | undefined = undefined;
                try {
                  store$
                    .select(selectApiSmallBodyType)
                    .pipe(take(1))
                    .subscribe((sbt) => (smallBodyType = sbt || undefined));
                } catch (e) {
                  console.warn('Unable to read smallBodyType from store for caching');
                }
                const payload = {
                  apiData,
                  job_id: job_id || 'N/A',
                  smallBodyType,
                  cachedAt: new Date().toISOString(),
                };
                void indexedDbCacheService.set(cacheKey, payload);
              }
            } catch (e) {
              console.error('Error caching API data to IndexedDB', e);
            }

            /**
             * Return multiple actions in specific order using concat operator
             */
            return buildApiDataLoadedActions({
              apiData,
              apiDataShownColState,
              jobId: job_id || 'N/A',
              message: message || 'N/A',
              search,
            });
          }),
          // ...
          takeUntil(
            actions$.pipe(
              ofType(ApiDataAction_FetchData),
              map((action) => {
                console.log('Cancel Action ?:', !action.search);
                return !action.search;
              }),
              filter(Boolean),
            ),
          ),

          //
        );
      }),
    );
  },
  { functional: true, dispatch: true },
);

export const runAstrometry$ = createEffect(
  (actions$ = inject(Actions), catApiService = inject(CatApiService)) => {
    return actions$.pipe(
      ofType(ApiDataAction_BeginAstrometryRun),
      mergeMap(({ productId, runId, inputs }) =>
        catApiService.fetchAstrometry(inputs).pipe(
          map((result) =>
            ApiDataAction_CompleteAstrometryRun({
              productId,
              runId,
              result,
              completedAt: new Date().toISOString(),
            }),
          ),
          catchError((error) =>
            of(
              ApiDataAction_FailAstrometryRun({
                productId,
                runId,
                error: appendCatToolsDownSuffix(formatAstrometryError(error)),
                completedAt: new Date().toISOString(),
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true, dispatch: true },
);

function formatAstrometryError(error: unknown): string {
  const body = getAstrometryErrorBody(error);
  if (body) {
    const details = [
      body.message,
      body.status ? `Status: ${body.status}.` : null,
      body.error_type ? `Error type: ${body.error_type}.` : null,
      body.stage ? `Stage: ${body.stage}.` : null,
      body.request_id ? `Request ID: ${body.request_id}.` : null,
      body.image_url ? `Image URL: ${body.image_url}.` : null,
    ].filter((detail): detail is string => !!detail);

    if (details.length > 0) {
      return details.join(' ');
    }
  }

  if (error instanceof HttpErrorResponse) {
    return error.message || 'Unable to run astrometry.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to run astrometry.';
}

function getAstrometryErrorBody(error: unknown): IAstrometryErrorResponse | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  if (isAstrometryErrorResponse(error.error)) {
    return error.error;
  }

  if (typeof error.error === 'string') {
    try {
      const parsed: unknown = JSON.parse(error.error);
      return isAstrometryErrorResponse(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
}

function isAstrometryErrorResponse(value: unknown): value is IAstrometryErrorResponse {
  return typeof value === 'object' && value !== null;
}

export const runCentroid$ = createEffect(
  (actions$ = inject(Actions), centroidService = inject(CentroidService)) => {
    return actions$.pipe(
      ofType(ApiDataAction_BeginCentroidRun),
      mergeMap(({ productId, astrometryRunId, runId, inputs }) =>
        centroidService.runCentroid(inputs).pipe(
          map((result) =>
            ApiDataAction_CompleteCentroidRun({
              productId,
              astrometryRunId,
              runId,
              result,
              completedAt: new Date().toISOString(),
            }),
          ),
          catchError((error) =>
            of(
              ApiDataAction_FailCentroidRun({
                productId,
                astrometryRunId,
                runId,
                error: appendCatToolsDownSuffix(
                  getHttpErrorMessage(error, 'Unable to run centroid.'),
                ),
                completedAt: new Date().toISOString(),
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true, dispatch: true },
);

export const runTargetPhotometry$ = createEffect(
  (actions$ = inject(Actions), targetPhotometryService = inject(TargetPhotometryService)) => {
    return actions$.pipe(
      ofType(ApiDataAction_BeginTargetPhotometryRun),
      mergeMap(({ productId, astrometryRunId, centroidRunId, runId, inputs }) =>
        targetPhotometryService.runTargetPhotometry(inputs).pipe(
          map((result) =>
            ApiDataAction_CompleteTargetPhotometryRun({
              productId,
              astrometryRunId,
              centroidRunId,
              runId,
              result,
              completedAt: new Date().toISOString(),
            }),
          ),
          catchError((error) =>
            of(
              ApiDataAction_FailTargetPhotometryRun({
                productId,
                astrometryRunId,
                centroidRunId,
                runId,
                error: appendCatToolsDownSuffix(
                  getHttpErrorMessage(error, 'Unable to run target photometry.'),
                ),
                completedAt: new Date().toISOString(),
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true, dispatch: true },
);

function getHttpErrorMessage(error: any, fallback: string): string {
  const message = error?.error?.detail || error?.error?.message || error?.message || fallback;

  if (
    fallback.toLowerCase().includes('centroid') &&
    typeof message === 'string' &&
    (message.includes('NaN') || message.includes('not valid JSON'))
  ) {
    return 'Centroid service returned NaN. Try a different X/Y point or search radius.';
  }

  return message;
}

function appendCatToolsDownSuffix(message: string): string {
  const suffix = 'CAT Tools Down';
  return message.includes(suffix) ? message : `${message} ${suffix}`;
}
