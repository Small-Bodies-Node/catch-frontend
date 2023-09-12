import { IApiDatum } from 'src/app/models/IApiDatum';
import { IApiStatus } from 'src/app/models/IApiStatus';
import { ApiActions, EApiActionTypes } from '../actions/api.actions';
import { apiDataInitColState } from 'src/app/utils/apiDataInitColState';
import { TApiDataColState } from 'src/app/models/TApiDataColState';
import { TDownloadRowsState } from 'src/app/models/TDownloadRowsState';

export interface IApiSubstate {
  apiStatus: IApiStatus;
  apiSelectedDatum?: IApiDatum;
  apiData?: IApiDatum[];
  apiJobId?: string;
  apiDataColumnState: Partial<TApiDataColState>;
  apiDataDownloadRowState: TDownloadRowsState;
}

export const initialState: IApiSubstate = {
  apiSelectedDatum: undefined,
  apiData: undefined,
  apiJobId: undefined,
  apiStatus: { code: 'unknown', message: '' },
  apiDataColumnState: { ...apiDataInitColState },
  apiDataDownloadRowState: {},
};

export function apiDataReducer(
  state = initialState,
  action: ApiActions
): IApiSubstate {
  // --->>

  switch (action.type) {
    case EApiActionTypes.ApiSetSelectedDatum:
      return {
        ...state,
        apiSelectedDatum: action.payload.apiDatum,
      };

    case EApiActionTypes.ApiDataSetDownloadRowState:
      return {
        ...state,
        apiDataDownloadRowState: { ...action.payload.newDownloadRowState },
      };

    case EApiActionTypes.ApiSetData:
      return {
        ...state,
        apiData: [...action.payload.apiData],
      };

    case EApiActionTypes.ApiSetJobId:
      return {
        ...state,
        apiJobId: action.payload,
      };

    case EApiActionTypes.ApiSetStatus:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}
