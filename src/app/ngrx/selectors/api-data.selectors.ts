import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { IApiDataSubstate } from '../reducers/api-data.reducer';

/**
 *
 * Elemental ApiData Selectors
 *
 */

export const selectApiActiveDatum = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataActiveDatum,
);

export const selectApiData = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiData,
);

export const selectApiDataJobId = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataJobId,
);

export const selectApiDataStatus = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataStatus,
);

export const selectApiDataAnalysisSelectionState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataAnalysisSelectionState,
);

export const selectApiDataShownColState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataShownColState,
);

export const selectApiSmallBodyType = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiSmallBodyType,
);

export const selectApiDataAstrometryRunsState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataAstrometryRunsState,
);

export const selectApiDataAstrometryCentralizationState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataAstrometryCentralizationState,
);

export const selectApiDataCentroidRunsState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataCentroidRunsState,
);

export const selectApiDataCentroidizationState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataCentroidizationState,
);

export const selectApiDataTargetPhotometryRunsState = createSelector(
  (state: IAppState) => state.apiData,
  (substate: IApiDataSubstate) => substate.apiDataTargetPhotometryRunsState,
);
