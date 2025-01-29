import { createAction, props } from '@ngrx/store';
import { IApiMovum } from '../../../models/IApiMovum';
import { TApiDataStatus } from '../../../models/TApiDataStatus';
import { IApiFixum } from '../../../models/IApiFixum';
import { TApiDataSearch } from '../../../models/TApiDataSearch';
import { TColStateMoving } from '../../../models/TColStateMoving';
import { TColStateFixed } from '../../../models/TColStateFixed';

enum ApiDataActionTypes {
  FetchData = '[ApiData] Fetch Data',
  SetData = '[ApiData] Set Data',
  SetSelectedDatum = '[ApiData] Set Selected Datum',
  SetStatus = '[ApiData] Set Status',
  SetJobId = '[ApiData] Set JobId',
  SetDownloadRowState = '[ApiData] Set Download Row State',
  SetShownColState = '[ApiData] Set Shown Col State',
}

export const ApiDataAction_FetchData = createAction(
  ApiDataActionTypes.FetchData,
  props<TApiDataStatus>()
);

export const ApiDataAction_SetStatus = createAction(
  ApiDataActionTypes.SetStatus,
  props<TApiDataStatus>()
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

export const ApiDataAction_SetShownColState = createAction(
  ApiDataActionTypes.SetShownColState,
  props<{ apiDataShownColState: TColStateMoving | TColStateFixed }>()
);
