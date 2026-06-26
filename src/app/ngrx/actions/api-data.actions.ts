import { createAction, props } from '@ngrx/store';
import { IApiMovum } from '../../../models/IApiMovum';
import { TApiDataStatus } from '../../../models/TApiDataStatus';
import { IApiFixum } from '../../../models/IApiFixum';
import { TColStateMoving } from '../../../models/TColStateMoving';
import { TColStateFixed } from '../../../models/TColStateFixed';
import {
  IAstrometryCentralization,
  IAstrometryInputs,
  IAstrometryResult,
} from '../../../models/IAstrometryRun';
import { ICentroidRequest, ICentroidResponse, ICentroidization } from '../../../models/ICentroid';
import {
  ITargetPhotometryRequest,
  ITargetPhotometryResponse,
} from '../../../models/ITargetPhotometry';

enum ApiDataActionTypes {
  FetchData = '[ApiData] Fetch Data',
  SetApiData = '[ApiData] Set Api Data',
  SetActiveDatum = '[ApiData] Set Active Datum',
  ClearActiveDatum = '[ApiData] Clear Active Datum',
  SetStatus = '[ApiData] Set Status',
  SetJobId = '[ApiData] Set JobId',
  SetAnalysisSelectionState = '[ApiData] Set Analysis Selection State',
  SetShownColState = '[ApiData] Set Shown Col State',
  SetSmallBodyType = '[ApiData] Set Small Body Type',
  BeginAstrometryRun = '[ApiData] Begin Astrometry Run',
  CompleteAstrometryRun = '[ApiData] Complete Astrometry Run',
  FailAstrometryRun = '[ApiData] Fail Astrometry Run',
  ApplyAstrometryCentralization = '[ApiData] Apply Astrometry Centralization',
  RemoveAstrometryCentralization = '[ApiData] Remove Astrometry Centralization',
  BeginCentroidRun = '[ApiData] Begin Centroid Run',
  CompleteCentroidRun = '[ApiData] Complete Centroid Run',
  FailCentroidRun = '[ApiData] Fail Centroid Run',
  ApplyCentroidization = '[ApiData] Apply Centroidization',
  RemoveCentroidization = '[ApiData] Remove Centroidization',
  BeginTargetPhotometryRun = '[ApiData] Begin Target Photometry Run',
  CompleteTargetPhotometryRun = '[ApiData] Complete Target Photometry Run',
  FailTargetPhotometryRun = '[ApiData] Fail Target Photometry Run',
}

export const ApiDataAction_FetchData = createAction(
  ApiDataActionTypes.FetchData,
  props<TApiDataStatus>(),
);

export const ApiDataAction_SetStatus = createAction(
  ApiDataActionTypes.SetStatus,
  props<TApiDataStatus>(),
);

export const ApiDataAction_SetData = createAction(
  ApiDataActionTypes.SetApiData,
  props<{ apiData?: IApiMovum[] | IApiFixum[] }>(),
);

export const ApiDataAction_SetActiveDatum = createAction(
  ApiDataActionTypes.SetActiveDatum,
  props<{ apiDatum: IApiMovum | IApiFixum }>(),
);

export const ApiDataAction_ClearActiveDatum = createAction(ApiDataActionTypes.ClearActiveDatum);

export const ApiDataAction_SetJobId = createAction(
  ApiDataActionTypes.SetJobId,
  props<{ job_id: string }>(),
);

export const ApiDataAction_SetAnalysisSelectionState = createAction(
  ApiDataActionTypes.SetAnalysisSelectionState,
  props<{ newAnalysisSelectionState: { [index: string]: boolean } }>(),
);

export const ApiDataAction_SetShownColState = createAction(
  ApiDataActionTypes.SetShownColState,
  props<{ apiDataShownColState: TColStateMoving | TColStateFixed }>(),
);

export const ApiDataAction_SetSmallBodyType = createAction(
  ApiDataActionTypes.SetSmallBodyType,
  props<{ smallBodyType: 'asteroid' | 'comet' }>(),
);

export const ApiDataAction_BeginAstrometryRun = createAction(
  ApiDataActionTypes.BeginAstrometryRun,
  props<{
    productId: string;
    runId: string;
    inputs: IAstrometryInputs;
    createdAt: string;
  }>(),
);

export const ApiDataAction_CompleteAstrometryRun = createAction(
  ApiDataActionTypes.CompleteAstrometryRun,
  props<{
    productId: string;
    runId: string;
    result: IAstrometryResult;
    completedAt: string;
  }>(),
);

export const ApiDataAction_FailAstrometryRun = createAction(
  ApiDataActionTypes.FailAstrometryRun,
  props<{
    productId: string;
    runId: string;
    error: string;
    completedAt: string;
  }>(),
);

export const ApiDataAction_ApplyAstrometryCentralization = createAction(
  ApiDataActionTypes.ApplyAstrometryCentralization,
  props<{ centralization: IAstrometryCentralization }>(),
);

export const ApiDataAction_RemoveAstrometryCentralization = createAction(
  ApiDataActionTypes.RemoveAstrometryCentralization,
  props<{ productId: string }>(),
);

export const ApiDataAction_BeginCentroidRun = createAction(
  ApiDataActionTypes.BeginCentroidRun,
  props<{
    productId: string;
    astrometryRunId: string;
    runId: string;
    inputs: ICentroidRequest;
    createdAt: string;
  }>(),
);

export const ApiDataAction_CompleteCentroidRun = createAction(
  ApiDataActionTypes.CompleteCentroidRun,
  props<{
    productId: string;
    astrometryRunId: string;
    runId: string;
    result: ICentroidResponse;
    completedAt: string;
  }>(),
);

export const ApiDataAction_FailCentroidRun = createAction(
  ApiDataActionTypes.FailCentroidRun,
  props<{
    productId: string;
    astrometryRunId: string;
    runId: string;
    error: string;
    completedAt: string;
  }>(),
);

export const ApiDataAction_ApplyCentroidization = createAction(
  ApiDataActionTypes.ApplyCentroidization,
  props<{ centroidization: ICentroidization }>(),
);

export const ApiDataAction_RemoveCentroidization = createAction(
  ApiDataActionTypes.RemoveCentroidization,
  props<{ productId: string }>(),
);

export const ApiDataAction_BeginTargetPhotometryRun = createAction(
  ApiDataActionTypes.BeginTargetPhotometryRun,
  props<{
    productId: string;
    astrometryRunId: string;
    centroidRunId: string;
    runId: string;
    inputs: ITargetPhotometryRequest;
    createdAt: string;
  }>(),
);

export const ApiDataAction_CompleteTargetPhotometryRun = createAction(
  ApiDataActionTypes.CompleteTargetPhotometryRun,
  props<{
    productId: string;
    astrometryRunId: string;
    centroidRunId: string;
    runId: string;
    result: ITargetPhotometryResponse;
    completedAt: string;
  }>(),
);

export const ApiDataAction_FailTargetPhotometryRun = createAction(
  ApiDataActionTypes.FailTargetPhotometryRun,
  props<{
    productId: string;
    astrometryRunId: string;
    centroidRunId: string;
    runId: string;
    error: string;
    completedAt: string;
  }>(),
);
