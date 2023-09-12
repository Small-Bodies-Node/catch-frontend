import { Action } from '@ngrx/store';

import { IApiDatum } from 'src/app/models/IApiDatum';
import { IApiStatus } from 'src/app/models/IApiStatus';
import { TSources } from 'src/app/models/TSources';

export enum EApiActionTypes {
  ApiSetStatus = '[Api] Set Status',
  ApiDataLoaded = '[Api] Data Loaded',
  ApiFetchResult = '[Api] Fetch Result',
  ApiSetData = '[Api] Set Data',
  ApiSetJobId = '[Api] Set JobId',
  ApiSetSelectedDatum = '[Api] Set Selected Datum',
  ApiDataSetDownloadRowState = '[Api] Set Download Row State',
}

export class ApiFetchResult implements Action {
  readonly type = EApiActionTypes.ApiFetchResult;
  constructor(
    public payload: {
      target: string;
      isCached: boolean;
      padding: number;
      isUncertaintyEllipse: boolean;
      sources: TSources[];
    }
  ) {}
}

export class ApiSetSelectedDatum implements Action {
  readonly type = EApiActionTypes.ApiSetSelectedDatum;
  constructor(public payload: { apiDatum?: IApiDatum }) {}
}

export class ApiSetData implements Action {
  readonly type = EApiActionTypes.ApiSetData;
  constructor(public payload: { apiData: IApiDatum[] }) {}
}

export class ApiSetStatus implements Action {
  readonly type = EApiActionTypes.ApiSetStatus;
  constructor(public payload: Partial<IApiStatus>) {}
}

export class ApiSetJobId implements Action {
  readonly type = EApiActionTypes.ApiSetJobId;
  constructor(public payload: string) {}
}

export class ApiDataLoaded implements Action {
  readonly type = EApiActionTypes.ApiDataLoaded;
  constructor() {}
}

export class ApiSetDownloadRowState implements Action {
  readonly type = EApiActionTypes.ApiDataSetDownloadRowState;
  constructor(
    public payload: { newDownloadRowState: { [productId: string]: boolean } }
  ) {}
}

export type ApiActions =
  | ApiFetchResult
  | ApiSetData
  | ApiSetStatus
  | ApiSetJobId
  | ApiSetSelectedDatum
  | ApiDataLoaded
  | ApiSetDownloadRowState;
