import { createReducer, on } from '@ngrx/store';

import {
  ApiDataAction_SetActiveDatum,
  ApiDataAction_ClearActiveDatum,
  ApiDataAction_SetData,
  ApiDataAction_SetStatus,
  ApiDataAction_SetJobId,
  ApiDataAction_SetAnalysisSelectionState,
  ApiDataAction_SetShownColState,
  ApiDataAction_SetSmallBodyType,
  ApiDataAction_BeginAstrometryRun,
  ApiDataAction_CompleteAstrometryRun,
  ApiDataAction_FailAstrometryRun,
  ApiDataAction_ApplyAstrometryCentralization,
  ApiDataAction_RemoveAstrometryCentralization,
  ApiDataAction_ApplyCentroidization,
  ApiDataAction_BeginCentroidRun,
  ApiDataAction_CompleteCentroidRun,
  ApiDataAction_FailCentroidRun,
  ApiDataAction_RemoveCentroidization,
  ApiDataAction_BeginTargetPhotometryRun,
  ApiDataAction_CompleteTargetPhotometryRun,
  ApiDataAction_FailTargetPhotometryRun,
} from '../actions/api-data.actions';
import { TApiDataStatus } from '../../../models/TApiDataStatus';
import { IApiMovum } from '../../../models/IApiMovum';
import { TColStateMoving } from '../../../models/TColStateMoving';
import { TAnalysisSelectionState } from '../../../models/TAnalysisSelectionState';
import { IApiFixum } from '../../../models/IApiFixum';
import { TColStateFixed } from '../../../models/TColStateFixed';
import {
  IAstrometryRun,
  TAstrometryCentralizationsState,
  TAstrometryRunsState,
} from '../../../models/IAstrometryRun';
import { ICentroidRun, TCentroidRunsState, TCentroidizationState } from '../../../models/ICentroid';
import {
  ITargetPhotometryRun,
  TTargetPhotometryRunsState,
} from '../../../models/ITargetPhotometry';

export interface IApiDataSubstate {
  apiDataActiveDatum?: IApiMovum | IApiFixum;
  apiDataStatus: TApiDataStatus;
  apiData?: IApiMovum[] | IApiFixum[];
  paginatedApiData?: IApiMovum[] | IApiFixum[];
  apiDataJobId?: string;
  apiDataShownColState?: TColStateMoving | TColStateFixed;
  apiDataAnalysisSelectionState: TAnalysisSelectionState;
  apiDataAstrometryRunsState: TAstrometryRunsState;
  apiDataAstrometryCentralizationState: TAstrometryCentralizationsState;
  apiDataCentroidRunsState: TCentroidRunsState;
  apiDataCentroidizationState: TCentroidizationState;
  apiDataTargetPhotometryRunsState: TTargetPhotometryRunsState;
  apiSmallBodyType?: 'asteroid' | 'comet';
}

export const initialState: IApiDataSubstate = {
  apiDataActiveDatum: undefined,
  apiData: undefined,
  paginatedApiData: undefined,
  apiDataJobId: undefined,
  apiDataStatus: {
    code: 'unset',
    message: 'Ready to fetch data',
    search: undefined,
  },
  apiDataShownColState: undefined,
  apiDataAnalysisSelectionState: {},
  apiDataAstrometryRunsState: {},
  apiDataAstrometryCentralizationState: {},
  apiDataCentroidRunsState: {},
  apiDataCentroidizationState: {},
  apiDataTargetPhotometryRunsState: {},
  apiSmallBodyType: undefined,
};

function updateAstrometryRun(
  runsState: TAstrometryRunsState,
  productId: string,
  runId: string,
  updater: (run: IAstrometryRun) => IAstrometryRun,
): TAstrometryRunsState {
  const runs = runsState[productId] ?? [];
  return {
    ...runsState,
    [productId]: runs.map((run) => (run.id === runId ? updater(run) : run)),
  };
}

function updateCentroidRun(
  runsState: TCentroidRunsState,
  productId: string,
  astrometryRunId: string,
  runId: string,
  updater: (run: ICentroidRun) => ICentroidRun,
): TCentroidRunsState {
  const productRuns = runsState[productId] ?? {};
  const runs = productRuns[astrometryRunId] ?? [];

  return {
    ...runsState,
    [productId]: {
      ...productRuns,
      [astrometryRunId]: runs.map((run) => (run.id === runId ? updater(run) : run)),
    },
  };
}

function updateTargetPhotometryRun(
  runsState: TTargetPhotometryRunsState,
  productId: string,
  astrometryRunId: string,
  centroidRunId: string,
  runId: string,
  updater: (run: ITargetPhotometryRun) => ITargetPhotometryRun,
): TTargetPhotometryRunsState {
  const productRuns = runsState[productId] ?? {};
  const astrometryRuns = productRuns[astrometryRunId] ?? {};
  const runs = astrometryRuns[centroidRunId] ?? [];

  return {
    ...runsState,
    [productId]: {
      ...productRuns,
      [astrometryRunId]: {
        ...astrometryRuns,
        [centroidRunId]: runs.map((run) => (run.id === runId ? updater(run) : run)),
      },
    },
  };
}

export const apiDataReducer = createReducer<IApiDataSubstate>(
  initialState,

  on(ApiDataAction_SetActiveDatum, (state, { apiDatum }) => ({
    ...state,
    apiDataActiveDatum: { ...apiDatum },
  })),

  on(ApiDataAction_ClearActiveDatum, (state) => ({
    ...state,
    apiDataActiveDatum: undefined,
  })),

  on(ApiDataAction_SetAnalysisSelectionState, (state, { newAnalysisSelectionState }) => ({
    ...state,
    apiDataAnalysisSelectionState: { ...newAnalysisSelectionState },
  })),

  on(ApiDataAction_SetShownColState, (state, { apiDataShownColState }) => {
    const updatedState: IApiDataSubstate = {
      ...state,
      apiDataShownColState: { ...apiDataShownColState },
    };
    return updatedState;
  }),

  on(ApiDataAction_SetData, (state, { apiData }) => ({
    ...state,
    apiData: apiData ? [...apiData] : undefined,
  })),

  on(ApiDataAction_SetJobId, (state, { job_id }) => ({
    ...state,
    apiDataJobId: job_id,
  })),

  on(ApiDataAction_SetStatus, (state, newStatus) => ({
    ...state,
    apiDataStatus: { ...newStatus },
  })),

  on(ApiDataAction_SetSmallBodyType, (state, { smallBodyType }) => ({
    ...state,
    apiSmallBodyType: smallBodyType,
  })),

  on(ApiDataAction_BeginAstrometryRun, (state, { productId, runId, inputs, createdAt }) => {
    const existingRuns = state.apiDataAstrometryRunsState[productId] ?? [];
    const run: IAstrometryRun = {
      id: runId,
      productId,
      sequence: existingRuns.length + 1,
      status: 'running',
      inputs: { ...inputs },
      createdAt,
    };

    return {
      ...state,
      apiDataAstrometryRunsState: {
        ...state.apiDataAstrometryRunsState,
        [productId]: [...existingRuns, run],
      },
    };
  }),

  on(ApiDataAction_CompleteAstrometryRun, (state, { productId, runId, result, completedAt }) => ({
    ...state,
    apiDataAstrometryRunsState: updateAstrometryRun(
      state.apiDataAstrometryRunsState,
      productId,
      runId,
      (run) => ({
        ...run,
        status: 'complete',
        result: { ...result },
        completedAt,
      }),
    ),
  })),

  on(ApiDataAction_FailAstrometryRun, (state, { productId, runId, error, completedAt }) => ({
    ...state,
    apiDataAstrometryRunsState: updateAstrometryRun(
      state.apiDataAstrometryRunsState,
      productId,
      runId,
      (run) => ({
        ...run,
        status: 'error',
        error,
        completedAt,
      }),
    ),
  })),

  on(ApiDataAction_ApplyAstrometryCentralization, (state, { centralization }) => {
    const activeCentroidization = state.apiDataCentroidizationState[centralization.productId];
    const shouldRemoveCentroidization =
      activeCentroidization && activeCentroidization.astrometryRunId !== centralization.runId;
    const { [centralization.productId]: _removed, ...remainingCentroidizations } =
      state.apiDataCentroidizationState;

    return {
      ...state,
      apiDataAstrometryCentralizationState: {
        ...state.apiDataAstrometryCentralizationState,
        [centralization.productId]: { ...centralization },
      },
      apiDataCentroidizationState: shouldRemoveCentroidization
        ? remainingCentroidizations
        : state.apiDataCentroidizationState,
    };
  }),

  on(ApiDataAction_RemoveAstrometryCentralization, (state, { productId }) => {
    const { [productId]: _removed, ...remainingCentralizations } =
      state.apiDataAstrometryCentralizationState;
    const { [productId]: _removedCentroidization, ...remainingCentroidizations } =
      state.apiDataCentroidizationState;

    return {
      ...state,
      apiDataAstrometryCentralizationState: remainingCentralizations,
      apiDataCentroidizationState: remainingCentroidizations,
    };
  }),

  on(
    ApiDataAction_BeginCentroidRun,
    (state, { productId, astrometryRunId, runId, inputs, createdAt }) => {
      const productRuns = state.apiDataCentroidRunsState[productId] ?? {};
      const existingRuns = productRuns[astrometryRunId] ?? [];
      const run: ICentroidRun = {
        id: runId,
        productId,
        astrometryRunId,
        sequence: existingRuns.length + 1,
        status: 'running',
        inputs: { ...inputs },
        createdAt,
      };

      return {
        ...state,
        apiDataCentroidRunsState: {
          ...state.apiDataCentroidRunsState,
          [productId]: {
            ...productRuns,
            [astrometryRunId]: [...existingRuns, run],
          },
        },
      };
    },
  ),

  on(
    ApiDataAction_CompleteCentroidRun,
    (state, { productId, astrometryRunId, runId, result, completedAt }) => ({
      ...state,
      apiDataCentroidRunsState: updateCentroidRun(
        state.apiDataCentroidRunsState,
        productId,
        astrometryRunId,
        runId,
        (run) => ({
          ...run,
          status: 'complete',
          result: { ...result },
          completedAt,
        }),
      ),
    }),
  ),

  on(
    ApiDataAction_FailCentroidRun,
    (state, { productId, astrometryRunId, runId, error, completedAt }) => ({
      ...state,
      apiDataCentroidRunsState: updateCentroidRun(
        state.apiDataCentroidRunsState,
        productId,
        astrometryRunId,
        runId,
        (run) => ({
          ...run,
          status: 'error',
          error,
          completedAt,
        }),
      ),
    }),
  ),

  on(ApiDataAction_ApplyCentroidization, (state, { centroidization }) => ({
    ...state,
    apiDataCentroidizationState: {
      ...state.apiDataCentroidizationState,
      [centroidization.productId]: { ...centroidization },
    },
  })),

  on(ApiDataAction_RemoveCentroidization, (state, { productId }) => {
    const { [productId]: _removed, ...remainingCentroidizations } =
      state.apiDataCentroidizationState;

    return {
      ...state,
      apiDataCentroidizationState: remainingCentroidizations,
    };
  }),

  on(
    ApiDataAction_BeginTargetPhotometryRun,
    (state, { productId, astrometryRunId, centroidRunId, runId, inputs, createdAt }) => {
      const productRuns = state.apiDataTargetPhotometryRunsState[productId] ?? {};
      const astrometryRuns = productRuns[astrometryRunId] ?? {};
      const existingRuns = astrometryRuns[centroidRunId] ?? [];
      const run: ITargetPhotometryRun = {
        id: runId,
        productId,
        astrometryRunId,
        centroidRunId,
        sequence: existingRuns.length + 1,
        status: 'running',
        inputs: { ...inputs },
        createdAt,
      };

      return {
        ...state,
        apiDataTargetPhotometryRunsState: {
          ...state.apiDataTargetPhotometryRunsState,
          [productId]: {
            ...productRuns,
            [astrometryRunId]: {
              ...astrometryRuns,
              [centroidRunId]: [...existingRuns, run],
            },
          },
        },
      };
    },
  ),

  on(
    ApiDataAction_CompleteTargetPhotometryRun,
    (state, { productId, astrometryRunId, centroidRunId, runId, result, completedAt }) => ({
      ...state,
      apiDataTargetPhotometryRunsState: updateTargetPhotometryRun(
        state.apiDataTargetPhotometryRunsState,
        productId,
        astrometryRunId,
        centroidRunId,
        runId,
        (run) => ({
          ...run,
          status: 'complete',
          result: { ...result },
          completedAt,
        }),
      ),
    }),
  ),

  on(
    ApiDataAction_FailTargetPhotometryRun,
    (state, { productId, astrometryRunId, centroidRunId, runId, error, completedAt }) => ({
      ...state,
      apiDataTargetPhotometryRunsState: updateTargetPhotometryRun(
        state.apiDataTargetPhotometryRunsState,
        productId,
        astrometryRunId,
        centroidRunId,
        runId,
        (run) => ({
          ...run,
          status: 'error',
          error,
          completedAt,
        }),
      ),
    }),
  ),
);
