import { createReducer, on } from '@ngrx/store';
import {
  ApiDataAction_SetSelectedDatum,
  ApiDataAction_SetData,
  ApiDataAction_SetStatus,
  ApiDataAction_SetJobId,
  ApiDataAction_DataLoaded,
  ApiDataAction_SetDownloadRowState,
} from '../actions/api-data.actions';
import { IApiDataStatus } from '../../models/IApiDataStatus';
import { IApiDatum } from '../../models/IApiDatum';
import { TApiDataColState } from '../../models/TApiDataColState';
import { TDownloadRowsState } from '../../models/TDownloadRowsState';
import { apiDataInitColState } from '../../../utils/apiDataInitColState';

export interface IApiDataSubstate {
  apiDataStatus: IApiDataStatus;
  apiDataSelectedDatum?: IApiDatum;
  apiData?: IApiDatum[];
  apiDataJobId?: string;
  apiDataColumnState: Partial<TApiDataColState>;
  apiDataDownloadRowState: TDownloadRowsState;
}

export const initialState: IApiDataSubstate = {
  apiDataSelectedDatum: undefined,
  apiData: undefined,
  apiDataJobId: undefined,
  apiDataStatus: { code: 'unknown', message: '' },
  apiDataColumnState: { ...apiDataInitColState },
  apiDataDownloadRowState: {},
};

export const apiDataReducer = createReducer(
  initialState,

  on(ApiDataAction_SetSelectedDatum, (state, { apiDatum }) => ({
    ...state,
    apiDataSelectedDatum: apiDatum,
  })),

  on(ApiDataAction_SetDownloadRowState, (state, { newDownloadRowState }) => ({
    ...state,
    apiDataDownloadRowState: { ...newDownloadRowState },
  })),

  on(ApiDataAction_SetData, (state, { apiData }) => ({
    ...state,
    apiData: [...apiData],
  })),

  on(ApiDataAction_SetJobId, (state, { jobId }) => ({
    ...state,
    apiDataJobId: jobId,
  })),

  on(ApiDataAction_SetStatus, (state, { status }) => ({
    ...state,
    apiDataStatus: {
      ...state.apiDataStatus,
      ...status,
    },
  })),

  on(ApiDataAction_DataLoaded, (state) => ({
    ...state,
  }))
);
