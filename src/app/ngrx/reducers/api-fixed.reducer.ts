import { createReducer, on } from '@ngrx/store';
import {
  ApiFixedAction_SetSelectedFixum,
  ApiFixedAction_SetFixed,
  ApiFixedAction_SetStatus,
  ApiFixedAction_FixedLoaded,
  ApiFixedAction_SetDownloadRowState,
} from '../actions/api-fixed.actions';
import { IApiFixedStatus } from '../../../models/IApiFixedStatus';
import { IApiFixum } from '../../../models/IApiFixum';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { TApiFixedColState } from '../../../models/TApiFixedColState';
import { apiFixedInitColState } from '../../../utils/apiFixedInitColState';

export interface IApiFixedSubstate {
  apiFixedStatus: IApiFixedStatus;
  apiFixedSelectedFixum?: IApiFixum;
  apiFixed?: IApiFixum[];
  apiFixedJobId?: string;
  apiFixedColumnState: Partial<TApiFixedColState>;
  apiFixedDownloadRowState: TDownloadRowsState;
}

export const initialState: IApiFixedSubstate = {
  apiFixedSelectedFixum: undefined,
  apiFixed: undefined,
  apiFixedJobId: undefined,
  apiFixedStatus: { code: 'unknown', message: '' },
  apiFixedColumnState: { ...apiFixedInitColState },
  apiFixedDownloadRowState: {},
};

export const apiFixedReducer = createReducer(
  initialState,

  on(ApiFixedAction_SetSelectedFixum, (state, { apiFixum }) => ({
    ...state,
    apiFixedSelectedFixum: apiFixum,
  })),

  on(ApiFixedAction_SetDownloadRowState, (state, { newDownloadRowState }) => ({
    ...state,
    apiFixedDownloadRowState: { ...newDownloadRowState },
  })),

  on(ApiFixedAction_SetFixed, (state, { apiFixed }) => ({
    ...state,
    apiFixed: [...apiFixed],
  })),

  on(ApiFixedAction_SetStatus, (state, newStatus) => ({
    ...state,
    apiFixedStatus: {
      ...state.apiFixedStatus,
      ...newStatus,
    },
  })),

  on(ApiFixedAction_FixedLoaded, (state) => ({
    ...state,
  }))
);
