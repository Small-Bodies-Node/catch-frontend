import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { IObjectNameMatchSubstate } from '../reducers/object-name-match.reducer';

/**
 *
 * Elemental Object-Name-Match Selectors
 *
 */

export const selectObjectNameMatchIsSearching = createSelector(
  (state: IAppState) => state.objectNameMatch,
  (substate: IObjectNameMatchSubstate) => substate.isSearching
);

export const selectObjectNameMatchResults = createSelector(
  (state: IAppState) => state.objectNameMatch,
  (substate: IObjectNameMatchSubstate) => substate.results
);
