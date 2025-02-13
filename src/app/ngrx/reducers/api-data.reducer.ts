import { createReducer, on } from '@ngrx/store';

import {
  ApiDataAction_SetSelectedDatum,
  ApiDataAction_SetData,
  ApiDataAction_SetStatus,
  ApiDataAction_SetJobId,
  ApiDataAction_SetDownloadRowState,
  ApiDataAction_SetShownColState,
  ApiDataAction_SetPaginatedApiData,
} from '../actions/api-data.actions';
import { TApiDataStatus } from '../../../models/TApiDataStatus';
import { IApiMovum } from '../../../models/IApiMovum';
import { TColStateMoving } from '../../../models/TColStateMoving';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { IApiFixum } from '../../../models/IApiFixum';
import { TColStateFixed } from '../../../models/TColStateFixed';

export interface IApiDataSubstate {
  apiDataSelectedDatum?: IApiMovum | IApiFixum;
  apiDataStatus: TApiDataStatus;
  apiData?: IApiMovum[] | IApiFixum[];
  paginatedApiData?: IApiMovum[] | IApiFixum[];
  apiDataJobId?: string;
  apiDataShownColState?: TColStateMoving | TColStateFixed;
  apiDataDownloadRowState: TDownloadRowsState;
}

export const initialState: IApiDataSubstate = {
  apiDataSelectedDatum: undefined,
  apiData: undefined,
  paginatedApiData: undefined,
  apiDataJobId: undefined,
  apiDataStatus: {
    code: 'unset',
    message: 'Ready to fetch data',
    search: undefined,
  },
  apiDataShownColState: undefined,
  apiDataDownloadRowState: {},
};

export const apiDataReducer = createReducer<IApiDataSubstate>(
  initialState,

  on(ApiDataAction_SetSelectedDatum, (state, { apiDatum }) => ({
    ...state,
    apiDataSelectedDatum: { ...apiDatum },
  })),

  on(ApiDataAction_SetDownloadRowState, (state, { newDownloadRowState }) => ({
    ...state,
    apiDataDownloadRowState: { ...newDownloadRowState },
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

  on(ApiDataAction_SetPaginatedApiData, (state, { paginatedApiData }) => ({
    ...state,
    paginatedApiData: paginatedApiData ? [...paginatedApiData] : undefined,
  })),

  on(ApiDataAction_SetJobId, (state, { job_id }) => ({
    ...state,
    apiDataJobId: job_id,
  })),

  on(ApiDataAction_SetStatus, (state, newStatus) => ({
    ...state,
    apiDataStatus: { ...newStatus },
  }))
);
