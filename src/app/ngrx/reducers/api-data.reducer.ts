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
  ApiDataAction_BeginPhotometricCalibrationRun,
  ApiDataAction_CompletePhotometricCalibrationRun,
  ApiDataAction_FailPhotometricCalibrationRun,
  ApiDataAction_ApplyCentroidization,
  ApiDataAction_BeginCentroidRun,
  ApiDataAction_CompleteCentroidRun,
  ApiDataAction_FailCentroidRun,
  ApiDataAction_RemoveCentroidization,
  ApiDataAction_BeginTargetPhotometryRun,
  ApiDataAction_CompleteTargetPhotometryRun,
  ApiDataAction_FailTargetPhotometryRun,
  ApiDataAction_SetSourceMagnitudeCalculation,
  ApiDataAction_RemoveSourceMagnitudeCalculation,
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
  IPhotometricCalibrationRun,
  TPhotometricCalibrationRunsState,
} from '../../../models/IPhotometricCalibrationRun';
import { TSourceMagnitudeState } from '../../../models/ISourceMagnitude';
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
  apiDataPhotometricCalibrationRunsState: TPhotometricCalibrationRunsState;
  apiDataCentroidRunsState: TCentroidRunsState;
  apiDataCentroidizationState: TCentroidizationState;
  apiDataTargetPhotometryRunsState: TTargetPhotometryRunsState;
  apiDataSourceMagnitudeState: TSourceMagnitudeState;
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
  apiDataPhotometricCalibrationRunsState: {},
  apiDataCentroidRunsState: {},
  apiDataCentroidizationState: {},
  apiDataTargetPhotometryRunsState: {},
  apiDataSourceMagnitudeState: {},
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

function updatePhotometricCalibrationRun(
  runsState: TPhotometricCalibrationRunsState,
  productId: string,
  astrometryRunId: string,
  runId: string,
  updater: (run: IPhotometricCalibrationRun) => IPhotometricCalibrationRun,
): TPhotometricCalibrationRunsState {
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

function updateCentroidRun(
  runsState: TCentroidRunsState,
  productId: string,
  astrometryRunId: string,
  photometricCalibrationRunId: string,
  runId: string,
  updater: (run: ICentroidRun) => ICentroidRun,
): TCentroidRunsState {
  const productRuns = runsState[productId] ?? {};
  const astrometryRuns = productRuns[astrometryRunId] ?? {};
  const runs = astrometryRuns[photometricCalibrationRunId] ?? [];

  return {
    ...runsState,
    [productId]: {
      ...productRuns,
      [astrometryRunId]: {
        ...astrometryRuns,
        [photometricCalibrationRunId]: runs.map((run) => (run.id === runId ? updater(run) : run)),
      },
    },
  };
}

function updateTargetPhotometryRun(
  runsState: TTargetPhotometryRunsState,
  productId: string,
  astrometryRunId: string,
  photometricCalibrationRunId: string,
  centroidRunId: string,
  runId: string,
  updater: (run: ITargetPhotometryRun) => ITargetPhotometryRun,
): TTargetPhotometryRunsState {
  const productRuns = runsState[productId] ?? {};
  const astrometryRuns = productRuns[astrometryRunId] ?? {};
  const calibrationRuns = astrometryRuns[photometricCalibrationRunId] ?? {};
  const runs = calibrationRuns[centroidRunId] ?? [];

  return {
    ...runsState,
    [productId]: {
      ...productRuns,
      [astrometryRunId]: {
        ...astrometryRuns,
        [photometricCalibrationRunId]: {
          ...calibrationRuns,
          [centroidRunId]: runs.map((run) => (run.id === runId ? updater(run) : run)),
        },
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

  on(ApiDataAction_SetShownColState, (state, { apiDataShownColState }) => ({
    ...state,
    apiDataShownColState: { ...apiDataShownColState },
  })),

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
    const { [productId]: _centralization, ...remainingCentralizations } =
      state.apiDataAstrometryCentralizationState;
    const { [productId]: _centroidization, ...remainingCentroidizations } =
      state.apiDataCentroidizationState;

    return {
      ...state,
      apiDataAstrometryRunsState: {
        ...state.apiDataAstrometryRunsState,
        [productId]: [...existingRuns, run],
      },
      apiDataAstrometryCentralizationState: remainingCentralizations,
      apiDataCentroidizationState: remainingCentroidizations,
    };
  }),

  on(ApiDataAction_CompleteAstrometryRun, (state, { productId, runId, result, completedAt }) => ({
    ...state,
    apiDataAstrometryRunsState: updateAstrometryRun(
      state.apiDataAstrometryRunsState,
      productId,
      runId,
      (run) => ({ ...run, status: 'complete', result: { ...result }, completedAt }),
    ),
  })),

  on(ApiDataAction_FailAstrometryRun, (state, { productId, runId, error, completedAt }) => ({
    ...state,
    apiDataAstrometryRunsState: updateAstrometryRun(
      state.apiDataAstrometryRunsState,
      productId,
      runId,
      (run) => ({ ...run, status: 'error', error, completedAt }),
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
    ApiDataAction_BeginPhotometricCalibrationRun,
    (state, { productId, astrometryRunId, runId, inputs, createdAt }) => {
      const productRuns = state.apiDataPhotometricCalibrationRunsState[productId] ?? {};
      const existingRuns = productRuns[astrometryRunId] ?? [];
      const run: IPhotometricCalibrationRun = {
        id: runId,
        productId,
        astrometryRunId,
        sequence: existingRuns.length + 1,
        status: 'running',
        inputs: { ...inputs },
        createdAt,
      };
      const productCentroidRuns = state.apiDataCentroidRunsState[productId] ?? {};
      const { [astrometryRunId]: _centroidRuns, ...remainingProductCentroidRuns } =
        productCentroidRuns;
      const productTargetRuns = state.apiDataTargetPhotometryRunsState[productId] ?? {};
      const { [astrometryRunId]: _targetRuns, ...remainingProductTargetRuns } = productTargetRuns;
      const productMagnitudeState = state.apiDataSourceMagnitudeState[productId] ?? {};
      const { [astrometryRunId]: _magnitudes, ...remainingProductMagnitudes } =
        productMagnitudeState;
      const activeCentroidization = state.apiDataCentroidizationState[productId];
      const { [productId]: _centroidization, ...remainingCentroidizations } =
        state.apiDataCentroidizationState;

      return {
        ...state,
        apiDataPhotometricCalibrationRunsState: {
          ...state.apiDataPhotometricCalibrationRunsState,
          [productId]: {
            ...productRuns,
            [astrometryRunId]: [...existingRuns, run],
          },
        },
        apiDataCentroidRunsState: {
          ...state.apiDataCentroidRunsState,
          [productId]: remainingProductCentroidRuns,
        },
        apiDataTargetPhotometryRunsState: {
          ...state.apiDataTargetPhotometryRunsState,
          [productId]: remainingProductTargetRuns,
        },
        apiDataSourceMagnitudeState: {
          ...state.apiDataSourceMagnitudeState,
          [productId]: remainingProductMagnitudes,
        },
        apiDataCentroidizationState:
          activeCentroidization?.astrometryRunId === astrometryRunId
            ? remainingCentroidizations
            : state.apiDataCentroidizationState,
      };
    },
  ),

  on(
    ApiDataAction_CompletePhotometricCalibrationRun,
    (state, { productId, astrometryRunId, runId, result, completedAt }) => ({
      ...state,
      apiDataPhotometricCalibrationRunsState: updatePhotometricCalibrationRun(
        state.apiDataPhotometricCalibrationRunsState,
        productId,
        astrometryRunId,
        runId,
        (run) => ({ ...run, status: 'complete', result: { ...result }, completedAt }),
      ),
    }),
  ),

  on(
    ApiDataAction_FailPhotometricCalibrationRun,
    (state, { productId, astrometryRunId, runId, error, completedAt }) => ({
      ...state,
      apiDataPhotometricCalibrationRunsState: updatePhotometricCalibrationRun(
        state.apiDataPhotometricCalibrationRunsState,
        productId,
        astrometryRunId,
        runId,
        (run) => ({ ...run, status: 'error', error, completedAt }),
      ),
    }),
  ),

  on(
    ApiDataAction_BeginCentroidRun,
    (
      state,
      { productId, astrometryRunId, photometricCalibrationRunId, runId, inputs, createdAt },
    ) => {
      const productRuns = state.apiDataCentroidRunsState[productId] ?? {};
      const astrometryRuns = productRuns[astrometryRunId] ?? {};
      const existingRuns = astrometryRuns[photometricCalibrationRunId] ?? [];
      const run: ICentroidRun = {
        id: runId,
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
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
            [astrometryRunId]: {
              ...astrometryRuns,
              [photometricCalibrationRunId]: [...existingRuns, run],
            },
          },
        },
      };
    },
  ),

  on(
    ApiDataAction_CompleteCentroidRun,
    (
      state,
      { productId, astrometryRunId, photometricCalibrationRunId, runId, result, completedAt },
    ) => ({
      ...state,
      apiDataCentroidRunsState: updateCentroidRun(
        state.apiDataCentroidRunsState,
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        runId,
        (run) => ({ ...run, status: 'complete', result: { ...result }, completedAt }),
      ),
    }),
  ),

  on(
    ApiDataAction_FailCentroidRun,
    (
      state,
      { productId, astrometryRunId, photometricCalibrationRunId, runId, error, completedAt },
    ) => ({
      ...state,
      apiDataCentroidRunsState: updateCentroidRun(
        state.apiDataCentroidRunsState,
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        runId,
        (run) => ({ ...run, status: 'error', error, completedAt }),
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
    return { ...state, apiDataCentroidizationState: remainingCentroidizations };
  }),

  on(
    ApiDataAction_BeginTargetPhotometryRun,
    (
      state,
      {
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        centroidRunId,
        runId,
        inputs,
        createdAt,
      },
    ) => {
      const productRuns = state.apiDataTargetPhotometryRunsState[productId] ?? {};
      const astrometryRuns = productRuns[astrometryRunId] ?? {};
      const calibrationRuns = astrometryRuns[photometricCalibrationRunId] ?? {};
      const existingRuns = calibrationRuns[centroidRunId] ?? [];
      const run: ITargetPhotometryRun = {
        id: runId,
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
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
              [photometricCalibrationRunId]: {
                ...calibrationRuns,
                [centroidRunId]: [...existingRuns, run],
              },
            },
          },
        },
      };
    },
  ),

  on(
    ApiDataAction_CompleteTargetPhotometryRun,
    (
      state,
      {
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        centroidRunId,
        runId,
        result,
        completedAt,
      },
    ) => ({
      ...state,
      apiDataTargetPhotometryRunsState: updateTargetPhotometryRun(
        state.apiDataTargetPhotometryRunsState,
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        centroidRunId,
        runId,
        (run) => ({ ...run, status: 'complete', result: { ...result }, completedAt }),
      ),
    }),
  ),

  on(
    ApiDataAction_FailTargetPhotometryRun,
    (
      state,
      {
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        centroidRunId,
        runId,
        error,
        completedAt,
      },
    ) => ({
      ...state,
      apiDataTargetPhotometryRunsState: updateTargetPhotometryRun(
        state.apiDataTargetPhotometryRunsState,
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        centroidRunId,
        runId,
        (run) => ({ ...run, status: 'error', error, completedAt }),
      ),
    }),
  ),

  on(ApiDataAction_SetSourceMagnitudeCalculation, (state, { calculation }) => {
    const productState = state.apiDataSourceMagnitudeState[calculation.productId] ?? {};
    const astrometryState = productState[calculation.astrometryRunId] ?? {};
    const calibrationState = astrometryState[calculation.photometricCalibrationRunId] ?? {};
    const centroidState = calibrationState[calculation.centroidRunId] ?? {};

    return {
      ...state,
      apiDataSourceMagnitudeState: {
        ...state.apiDataSourceMagnitudeState,
        [calculation.productId]: {
          ...productState,
          [calculation.astrometryRunId]: {
            ...astrometryState,
            [calculation.photometricCalibrationRunId]: {
              ...calibrationState,
              [calculation.centroidRunId]: {
                ...centroidState,
                [calculation.targetPhotometryRunId]: { ...calculation },
              },
            },
          },
        },
      },
    };
  }),

  on(
    ApiDataAction_RemoveSourceMagnitudeCalculation,
    (
      state,
      {
        productId,
        astrometryRunId,
        photometricCalibrationRunId,
        centroidRunId,
        targetPhotometryRunId,
      },
    ) => {
      const productState = state.apiDataSourceMagnitudeState[productId] ?? {};
      const astrometryState = productState[astrometryRunId] ?? {};
      const calibrationState = astrometryState[photometricCalibrationRunId] ?? {};
      const centroidState = calibrationState[centroidRunId] ?? {};
      const { [targetPhotometryRunId]: _removed, ...remainingCalculations } = centroidState;

      return {
        ...state,
        apiDataSourceMagnitudeState: {
          ...state.apiDataSourceMagnitudeState,
          [productId]: {
            ...productState,
            [astrometryRunId]: {
              ...astrometryState,
              [photometricCalibrationRunId]: {
                ...calibrationState,
                [centroidRunId]: remainingCalculations,
              },
            },
          },
        },
      };
    },
  ),
);
