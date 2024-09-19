import { createSelector } from '@ngrx/store';
import { IAppState } from '../reducers';
import { INavigationSubstate } from '../reducers/navigation.reducer';

/**
 *
 * Elemental Navigation Selectors
 *
 */

export const selectNavigationRecordsPresentRoute = createSelector(
  (state: IAppState) => state.navigation,
  (substate: INavigationSubstate) => substate.presentRoute
);

export const selectNavigationRecordsPreviousRoute = createSelector(
  (state: IAppState) => state.navigation,
  (substate: INavigationSubstate) => substate.previousRoute
);

export const selectIsNewRouteScheduled = createSelector(
  (state: IAppState) => state.navigation,
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
