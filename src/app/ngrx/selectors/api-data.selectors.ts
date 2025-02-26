import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { IApiDataSubstate } from '../reducers/api-data.reducer';

/**
 *
 * Elemental ApiData Selectors
 *
 */

export const selectApiSelectedDatum = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataSelectedDatum
);

export const selectApiData = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiData
);

export const selectApiDataJobId = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataJobId
);

export const selectApiDataStatus = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataStatus
);

export const selectApiDataDownloadRowState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataDownloadRowState
);

export const selectApiDataShownColState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataShownColState
);

export const selectApiSmallBodyType = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiSmallBodyType
);
