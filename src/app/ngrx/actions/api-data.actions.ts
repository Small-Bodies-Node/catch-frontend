import { createAction, props } from '@ngrx/store';
import { TSources } from '../../models/TSources';
import { IApiDatum } from '../../models/IApiDatum';
import { IApiDataStatus } from '../../models/IApiDataStatus';

export const ApiDataAction_FetchResult = createAction(
  'Api Action: Fetch Result',
  props<{
    target: string;
    isCached: boolean;
    padding: number;
    isUncertaintyEllipse: boolean;
    sources: TSources[];
  }>()
);

export const ApiDataAction_SetSelectedDatum = createAction(
  'Api Action: Set Selected Datum',
  props<{ apiDatum?: IApiDatum }>()
);

export const ApiDataAction_SetData = createAction(
  'Api Action: Set Data',
  props<{ apiData: IApiDatum[] }>()
);

export const ApiDataAction_SetStatus = createAction(
  'Api Action: Set Status',
  props<Partial<IApiDataStatus>>()
);

export const ApiDataAction_SetJobId = createAction(
  'Api Action: Set JobId',
  props<{ jobId: string }>()
);

export const ApiDataAction_DataLoaded = createAction('Api Action: Data Loaded');

export const ApiDataAction_SetDownloadRowState = createAction(
  'Api Action: Set Download Row State',
  props<{ newDownloadRowState: { [productId: string]: boolean } }>()
);
