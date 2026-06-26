import { IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ICentroidRequest, ICentroidRun } from '../../../../../models/ICentroid';
import {
  getCacheRows,
  isFiniteNumber,
  roundOptionalPixelCoordinate,
  roundPixelCoordinate,
} from './cat-tools-formatters';
import { IAnalysisItem, ICatToolsDatumRow } from './cat-tools.types';

export function roundCentroidRequestPixels(request: ICentroidRequest): ICentroidRequest {
  return {
    ...request,
    target_x: roundPixelCoordinate(request.target_x),
    target_y: roundPixelCoordinate(request.target_y),
    search_radius: roundPixelCoordinate(request.search_radius),
    astrometry_center_x: roundOptionalPixelCoordinate(request.astrometry_center_x),
    astrometry_center_y: roundOptionalPixelCoordinate(request.astrometry_center_y),
  };
}

export function getCentroidRunStatusLabel(run: ICentroidRun): string {
  if (run.status === 'running') {
    return 'Running';
  }

  if (run.status === 'complete') {
    return 'Complete';
  }

  return 'Failed';
}

export function isCentroidizationAvailable(run: ICentroidRun): boolean {
  return (
    run.status === 'complete' &&
    isFiniteNumber(run.result?.search_results.cent_x) &&
    isFiniteNumber(run.result?.search_results.cent_y)
  );
}

export function isCentroidizationApplied(item: IAnalysisItem, run: ICentroidRun): boolean {
  return (
    item.centroidization?.astrometryRunId === run.astrometryRunId &&
    item.centroidization?.centroidRunId === run.id
  );
}

export function getCentroidizationActionLabel(item: IAnalysisItem, run: ICentroidRun): string {
  return isCentroidizationApplied(item, run) ? 'Remove Centroidization' : 'Apply Centroidization';
}

export function getCentroidRuns(item: IAnalysisItem, run: IAstrometryRun): ICentroidRun[] {
  return item.centroidRunsState?.[run.id] ?? [];
}

export function getCentroidResultRows(
  run: ICentroidRun,
  worldCoordinates: { ra: number; dec: number } | null,
): ICatToolsDatumRow[] {
  const response = run.result;
  const result = response?.search_results;
  if (!response || !result) {
    return [];
  }

  return [
    ...getCacheRows(response.cache),
    { label: 'Initial X', value: roundPixelCoordinate(result.init_guess_x) },
    { label: 'Initial Y', value: roundPixelCoordinate(result.init_guess_y) },
    { label: 'Search radius (pixels)', value: roundPixelCoordinate(result.search_radius) },
    { label: 'Centroid X', value: roundPixelCoordinate(result.cent_x) },
    { label: 'Centroid Y', value: roundPixelCoordinate(result.cent_y) },
    { label: 'Centroid RA', value: worldCoordinates?.ra },
    { label: 'Centroid Dec', value: worldCoordinates?.dec },
  ];
}
