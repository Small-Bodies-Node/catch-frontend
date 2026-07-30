import { IAstrometryCentralization, IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ICentroidization, TCentroidRunsState } from '../../../../../models/ICentroid';
import { TPhotometricCalibrationRunsState } from '../../../../../models/IPhotometricCalibrationRun';
import { TSourceMagnitudeState } from '../../../../../models/ISourceMagnitude';
import { TTargetPhotometryRunsState } from '../../../../../models/ITargetPhotometry';
import { formatRowDate } from './cat-tools-formatters';
import { IAnalysisItem, TApiDatum } from './cat-tools.types';

export function toAnalysisItem(
  apiDatum: TApiDatum,
  activeProductId: string | undefined,
  astrometryRuns: IAstrometryRun[] = [],
  astrometryCentralization?: IAstrometryCentralization,
  photometricCalibrationRunsState: TPhotometricCalibrationRunsState[string] = {},
  centroidRunsState: TCentroidRunsState[string] = {},
  centroidization?: ICentroidization,
  targetPhotometryRunsState: TTargetPhotometryRunsState[string] = {},
  sourceMagnitudeState: TSourceMagnitudeState[string] = {},
): IAnalysisItem {
  return {
    apiDatum,
    productId: apiDatum.product_id,
    sourceName: apiDatum.source_name,
    date: formatRowDate(apiDatum.date),
    isActive: apiDatum.product_id === activeProductId,
    astrometryRuns,
    astrometryCentralization,
    photometricCalibrationRunsState,
    centroidRunsState,
    centroidization,
    targetPhotometryRunsState,
    sourceMagnitudeState,
  };
}
