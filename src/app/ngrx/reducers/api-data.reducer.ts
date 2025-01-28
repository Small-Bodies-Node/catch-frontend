import { createReducer, on } from '@ngrx/store';
import {
  ApiDataAction_SetSelectedDatum,
  ApiDataAction_SetData,
  ApiDataAction_SetStatus,
  ApiDataAction_SetJobId,
  ApiDataAction_SetDownloadRowState,
} from '../actions/api-data.actions';
import {
  IApiDataSetStatus,
  TApiDataSetStatus,
} from '../../../models/TApiDataSetStatus';
import { IApiMovum } from '../../../models/IApiMovum';
import { TApiDataColState } from '../../../models/TApiDataColState';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { apiDataInitColState } from '../../../utils/apiDataInitColState';
import { IApiFixum } from '../../../models/IApiFixum';

export interface IApiDataSubstate {
  apiDataSelectedDatum?: IApiMovum | IApiFixum;
  apiDataStatus: TApiDataSetStatus;
  apiData?: IApiMovum[] | IApiFixum[];
  apiDataJobId?: string;
  apiDataColumnState: Partial<TApiDataColState>;
  apiDataDownloadRowState: TDownloadRowsState;
}

export const initialState: IApiDataSubstate = {
  apiDataSelectedDatum: undefined,
  apiData: undefined,
  apiDataJobId: undefined,
  apiDataStatus: {
    code: 'unset',
    message: 'Ready to fetch data',
    search: undefined,
  },
  apiDataColumnState: { ...apiDataInitColState },
  apiDataDownloadRowState: {},
};

export const apiDataReducer = createReducer(
  initialState,

  on(ApiDataAction_SetSelectedDatum, (state, { apiDatum }) => ({
    ...state,
    apiDataSelectedDatum: { ...apiDatum },
  })),

  on(ApiDataAction_SetDownloadRowState, (state, { newDownloadRowState }) => ({
    ...state,
    apiDataDownloadRowState: { ...newDownloadRowState },
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
    apiDataStatus: {
      /* We do not always want to overwrite the entirety of the last status! */
      ...state.apiDataStatus,
      ...newStatus,
    },
  }))
);
