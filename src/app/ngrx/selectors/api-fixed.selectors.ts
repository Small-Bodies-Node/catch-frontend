import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { IApiFixedSubstate } from '../reducers/api-fixed.reducer';

/**
 *
 * Elemental ApiFixed Selectors
 *
 */

export const selectApiSelectedFixum = createSelector(
  (state: IAppState) => state.apiFixed,
  (substate: IApiFixedSubstate) => substate.apiFixedSelectedFixum
);

export const selectApiFixed = createSelector(
  (state: IAppState) => state.apiFixed,
  (substate: IApiFixedSubstate) => substate.apiFixed
);

export const selectApiFixedStatus = createSelector(
  (state: IAppState) => state.apiFixed,
  (substate: IApiFixedSubstate) => substate.apiFixedStatus
);

export const selectApiFixedDownloadRowState = createSelector(
  (state: IAppState) => state.apiFixed,
  (substate: IApiFixedSubstate) => substate.apiFixedDownloadRowState
);
