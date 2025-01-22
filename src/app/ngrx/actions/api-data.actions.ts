import { createAction, props } from '@ngrx/store';
import { TControlKeyForSources } from '../../../models/TControlKeyForSources';
import { IApiDatum } from '../../../models/IApiDatum';
import { IApiDataStatus } from '../../../models/IApiDataStatus';

export const ApiDataAction_FetchResult = createAction(
  'Api Action: Fetch Moving Object Result',
  props<{
    target: string;
    isCached: boolean;
    padding: number;
    isUncertaintyEllipse: boolean;
    sources: TControlKeyForSources[];
  }>()
);

export const ApiDataAction_SetSelectedDatum = createAction(
  'Api Action: Set Selected Moving Object Datum',
  props<{ apiDatum?: IApiDatum }>()
);

export const ApiDataAction_SetData = createAction(
  'Api Action: Set Moving Object Data',
  props<{ apiData: IApiDatum[] }>()
);

export const ApiDataAction_SetStatus = createAction(
  'Api Action: Set Moving Object Status',
  props<Partial<IApiDataStatus>>()
);

export const ApiDataAction_SetJobId = createAction(
  'Api Action: Set Moving Object JobId',
  props<{ jobId: string }>()
);

export const ApiDataAction_DataLoaded = createAction(
  'Api Action: Moving Object Data Loaded'
);

export const ApiDataAction_SetDownloadRowState = createAction(
  'Api Action: Set Moving Object Download Row State',
  props<{ newDownloadRowState: { [productId: string]: boolean } }>()
);
