import { IApiFixum } from '../../../../../models/IApiFixum';
import { IApiMovum } from '../../../../../models/IApiMovum';
import { IAstrometryCentralization, IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ICentroidization, TCentroidRunsState } from '../../../../../models/ICentroid';
import { TTargetPhotometryRunsState } from '../../../../../models/ITargetPhotometry';

export type TApiDatum = IApiMovum | IApiFixum;

export interface IAnalysisItem {
  apiDatum: TApiDatum;
  productId: string;
  sourceName: string;
  date: string;
  isActive: boolean;
  astrometryRuns: IAstrometryRun[];
  astrometryCentralization?: IAstrometryCentralization;
  centroidRunsState: TCentroidRunsState[string];
  centroidization?: ICentroidization;
  targetPhotometryRunsState: TTargetPhotometryRunsState[string];
}

export interface IAnalysisSelectionSummary {
  totalCount: number;
  items: IAnalysisItem[];
}

export type TCatToolsDetailViewKind = 'astrometry-launcher' | 'astrometry-review';

export interface ICatToolsDetailView {
  kind: TCatToolsDetailViewKind;
  title: string;
  productId: string;
  runId?: string;
}

export interface ICatToolsDatumRow {
  label: string;
  value: string | number | null | undefined;
}

export interface ICatToolsResultGroup {
  title: string;
  rows: ICatToolsDatumRow[];
}

export interface ICentroidDraftContext {
  productId: string;
  astrometryRunId: string;
}

export interface ITargetPhotometryDraftContext {
  productId: string;
  astrometryRunId: string;
  centroidRunId: string;
}

export interface ICatWorkflowRunExportMetadata {
  id: string;
  sequence: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

export interface ICatWorkflowDownloadContext {
  item: IAnalysisItem;
  run: IAstrometryRun;
}

export interface ICentroidCoordinatePair {
  imageX: number;
  imageY: number;
  wcsPixelX?: number;
  wcsPixelY?: number;
  wcsPixelAsPhysicalX?: number;
  wcsPixelAsPhysicalY?: number;
  wcsPixelAsImageX?: number;
  wcsPixelAsImageY?: number;
}
