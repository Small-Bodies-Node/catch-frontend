import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { INavigationSubstate } from '../reducers/navigation-reducer/navigation.reducer';

/**
 *
 * Elemental Navigation Selectors
 *
 */

export const selectNavigationRecordsPresentRoute = createSelector(
  (state: AppState) => state.navigation,
  (substate: INavigationSubstate) => substate.presentRoute
);

export const selectNavigationRecordsPreviousRoute = createSelector(
  (state: AppState) => state.navigation,
  (substate: INavigationSubstate) => substate.previousRoute
);

export const selectIsNewRouteScheduled = createSelector(
  (state: AppState) => state.navigation,
  (substate: INavigationSubstate) => substate.isNewRouteScheduled
);

/**
 *
 * Compound Navigation Selectors
 *
 */

export const selectNavigationRecords = createSelector(
  selectNavigationRecordsPresentRoute,
  selectNavigationRecordsPreviousRoute,
  (presentRoute?: string, previousRoute?: string) => {
    return { previousRoute, presentRoute };
  }
);
