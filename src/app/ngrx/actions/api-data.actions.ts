import { createAction, props } from '@ngrx/store';
import { IApiMovum } from '../../../models/IApiMovum';
import { TApiDataSetStatus } from '../../../models/TApiDataSetStatus';
import { IApiFixum } from '../../../models/IApiFixum';
import { TApiDataSearch } from '../../../models/TApiDataSearch';

enum ApiDataActionTypes {
  FetchData = '[ApiData] Fetch Data',
  SetData = '[ApiData] Set Data',
  SetSelectedDatum = '[ApiData] Set Selected Datum',
  SetStatus = '[ApiData] Set Status',
  SetJobId = '[ApiData] Set JobId',
  SetDownloadRowState = '[ApiData] Set Download Row State',
}

export const ApiDataAction_FetchData = createAction(
  ApiDataActionTypes.FetchData,
  props<TApiDataSetStatus>()
);

export const ApiDataAction_SetStatus = createAction(
  ApiDataActionTypes.SetStatus,
  props<TApiDataSetStatus>()
);

export const ApiDataAction_SetData = createAction(
  ApiDataActionTypes.SetData,
  props<{ apiData?: IApiMovum[] | IApiFixum[] }>()
);

export const ApiDataAction_SetSelectedDatum = createAction(
  ApiDataActionTypes.SetSelectedDatum,
  props<{ apiDatum: IApiMovum | IApiFixum }>()
);

export const ApiDataAction_SetJobId = createAction(
  ApiDataActionTypes.SetJobId,
  props<{ job_id: string }>()
);

export const ApiDataAction_SetDownloadRowState = createAction(
  ApiDataActionTypes.SetDownloadRowState,
  props<{ newDownloadRowState: { [index: string]: boolean } }>()
);
