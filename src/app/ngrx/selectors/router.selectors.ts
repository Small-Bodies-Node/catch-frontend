// import { createSelector } from '@ngrx/store';
// import { IAppState } from '../reducers';
// import {
//   RouterReducerState,
//   SerializedRouterStateSnapshot,
// } from '@ngrx/router-store';

// /**
//  *
//  * Special selector that listens to @ngrx/router-store
//  * and emits new url whenever changed
//  *
//  */

// export const selectRouterUrl = createSelector(
//   (state: IAppState) => state.router,
//   (routerState: RouterReducerState<SerializedRouterStateSnapshot>) => {
//     const url = routerState && routerState.state && routerState.state.url;
//     return url || undefined;
//   }
// );

import { getRouterSelectors } from '@ngrx/router-store';

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
  selectRouteDataParam, // select the current url
} = getRouterSelectors();
