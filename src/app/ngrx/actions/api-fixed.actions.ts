import { createAction, props } from '@ngrx/store';
import { TControlKeyForSources } from '../../../models/TControlKeyForSources';
import { IApiFixum } from '../../../models/IApiFixum';
import { TIntersectionType } from '../../../models/TIntersectionType';
import { IApiFixedStatus } from '../../../models/IApiFixedStatus';

export const ApiFixedAction_FetchResult = createAction(
  'Api Action: Fetch Fixed Object Result',
  props<{
    ra: string;
    dec: string;
    radius?: number;
    startTime?: string;
    stopTime?: string;
    sources: TControlKeyForSources[];
    intersectionType: TIntersectionType;
  }>()
);

export const ApiFixedAction_SetSelectedFixum = createAction(
  'Api Action: Set Selected Fixed Object Fixum',
  props<{ apiFixum?: IApiFixum }>()
);

export const ApiFixedAction_SetFixed = createAction(
  'Api Action: Set Fixed Object Fixums',
  props<{ apiFixed: IApiFixum[] }>()
);

export const ApiFixedAction_FixedLoaded = createAction(
  'Api Action:  Fixed Object Loaded'
);

export const ApiFixedAction_SetStatus = createAction(
  'Api Action: Set Fixed Object Status',
  props<Partial<IApiFixedStatus>>()
);

export const ApiFixedAction_SetDownloadRowState = createAction(
  'Api Action: Set Fixed Object Download Row State',
  props<{ newDownloadRowState: { [productId: string]: boolean } }>()
);
