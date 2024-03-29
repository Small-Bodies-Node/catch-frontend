import { createSelector } from '@ngrx/store';
import { IAppState } from '../reducers';
import {
  RouterReducerState,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';

/**
 *
 * Special selector that listens to @ngrx/router-store
 * and emits new url whenever changed
 *
 */

export const selectRouterUrl = createSelector(
  (state: IAppState) => state.router,
  (routerState: RouterReducerState<SerializedRouterStateSnapshot>) => {
    const url = routerState && routerState.state && routerState.state.url;
    return url || undefined;
  }
);
