import { ICentroidRun } from '../../../../../models/ICentroid';
import {
  ITargetPhotometryRequest,
  ITargetPhotometryRun,
} from '../../../../../models/ITargetPhotometry';
import { getCacheRows, roundPixelCoordinate, roundPixelPosition } from './cat-tools-formatters';
import { IAnalysisItem, ICatToolsDatumRow } from './cat-tools.types';

export function createDefaultTargetPhotometryInputs(
  centroidRun: ICentroidRun,
): ITargetPhotometryRequest {
  const centroidResult = centroidRun.result?.search_results;
  const position: [number, number] = [
    roundPixelCoordinate(centroidResult?.cent_x ?? centroidRun.inputs.target_x),
    roundPixelCoordinate(centroidResult?.cent_y ?? centroidRun.inputs.target_y),
  ];
  const size = 5;

  return {
    file: centroidRun.inputs.file,
    target_aperture_params: {
      shape: 'Circular',
      position,
      size,
      inner_r: 0,
      outer_r: 0,
    },
    background_aperture_params: {
      shape: 'Circular_Annulus',
      position: [...position] as [number, number],
      size,
      inner_r: size,
      outer_r: size * 2,
    },
  };
}

export function cloneTargetPhotometryRequest(
  request: ITargetPhotometryRequest,
): ITargetPhotometryRequest {
  return {
    file: request.file,
    target_aperture_params: {
      ...request.target_aperture_params,
      position: [...request.target_aperture_params.position] as [number, number],
    },
    background_aperture_params: {
      ...request.background_aperture_params,
      position: [...request.background_aperture_params.position] as [number, number],
    },
  };
}

export function roundTargetPhotometryRequestPixels(
  request: ITargetPhotometryRequest,
): ITargetPhotometryRequest {
  const roundedRequest = cloneTargetPhotometryRequest(request);

  roundedRequest.target_aperture_params.position = roundPixelPosition(
    roundedRequest.target_aperture_params.position,
  );
  roundedRequest.target_aperture_params.size = roundPixelCoordinate(
    roundedRequest.target_aperture_params.size,
  );
  roundedRequest.background_aperture_params.position = roundPixelPosition(
    roundedRequest.background_aperture_params.position,
  );
  roundedRequest.background_aperture_params.size = roundPixelCoordinate(
    roundedRequest.background_aperture_params.size,
  );
  roundedRequest.background_aperture_params.inner_r = roundPixelCoordinate(
    roundedRequest.background_aperture_params.inner_r,
  );
  roundedRequest.background_aperture_params.outer_r = roundPixelCoordinate(
    roundedRequest.background_aperture_params.outer_r,
  );

  return roundedRequest;
}

export function getTargetPhotometryRuns(
  item: IAnalysisItem,
  run: ICentroidRun,
): ITargetPhotometryRun[] {
  return item.targetPhotometryRunsState?.[run.astrometryRunId]?.[run.id] ?? [];
}

export function getTargetPhotometryRunStatusLabel(run: ITargetPhotometryRun): string {
  if (run.status === 'running') {
    return 'Running';
  }

  if (run.status === 'complete') {
    return 'Complete';
  }

  return 'Failed';
}

export function getTargetPhotometryResultRows(run: ITargetPhotometryRun): ICatToolsDatumRow[] {
  if (!run.result) {
    return [];
  }

  return [
    ...getCacheRows(run.result.cache),
    { label: 'Aperture flux', value: run.result.aperture_flux },
    { label: 'Aperture flux error', value: run.result.aperture_fluxerr },
  ];
}
