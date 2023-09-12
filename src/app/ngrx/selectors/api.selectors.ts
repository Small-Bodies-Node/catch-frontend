import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { IApiSubstate } from '../reducers/api.reducer';

/**
 *
 * Elemental ApiData Selectors
 *
 */

export const selectApiSelectedDatum = createSelector(
  (state: IAppState) => state.api,
  (substate: IApiSubstate) => substate.apiSelectedDatum
);

export const selectApiData = createSelector(
  (state: IAppState) => state.api,
  (substate: IApiSubstate) => substate.apiData
);

export const selectApiJobId = createSelector(
  (state: IAppState) => state.api,
  (substate: IApiSubstate) => substate.apiJobId
);

export const selectApiStatus = createSelector(
  (state: IAppState) => state.api,
  (substate: IApiSubstate) => substate.apiStatus
);

export const selectApiDataDownloadRowState = createSelector(
  (state: IAppState) => state.api,
  (substate: IApiSubstate) => substate.apiDataDownloadRowState
);
