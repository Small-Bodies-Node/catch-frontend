import {
  IAstrometryInputs,
  IAstrometryResult,
  IAstrometryRun,
} from '../../../../../models/IAstrometryRun';
import { getAstrometryPixelScale } from '../../../../../utils/astrometryPixelScale';
import {
  getCacheRows,
  getNumberFromDatumOrCutoutUrl,
  isFiniteNumber,
} from './cat-tools-formatters';
import {
  IAnalysisItem,
  ICatToolsDatumRow,
  ICatToolsResultGroup,
  TApiDatum,
} from './cat-tools.types';

export function createDefaultAstrometryInputs(apiDatum: TApiDatum): IAstrometryInputs {
  return {
    image_url: apiDatum.cutout_url || '',
    ra: getNumberFromDatumOrCutoutUrl(apiDatum, 'ra'),
    dec: getNumberFromDatumOrCutoutUrl(apiDatum, 'dec'),
    use_ra_dec: true,
    pixel_scale: getAstrometryPixelScale(apiDatum),
    scale_low: null,
    scale_high: null,
    search_radius: 2,
    snr_threshold: 3,
  };
}

export function getAstrometryInputRows(inputs: IAstrometryInputs): ICatToolsDatumRow[] {
  return [
    { label: 'Image URL', value: inputs.image_url },
    { label: 'RA', value: inputs.ra },
    { label: 'Dec', value: inputs.dec },
    { label: 'Use RA/Dec', value: inputs.use_ra_dec ? 'Yes' : 'No' },
    { label: 'Pixel scale', value: inputs.pixel_scale },
    { label: 'Scale low', value: inputs.scale_low },
    { label: 'Scale high', value: inputs.scale_high },
    { label: 'Search radius', value: inputs.search_radius },
    { label: 'SNR threshold', value: inputs.snr_threshold },
  ];
}

export function getAstrometryResultGroups(result: IAstrometryResult): ICatToolsResultGroup[] {
  return [
    {
      title: 'Astrometric Calibration Output',
      rows: [
        { label: 'Center RA', value: result.center_ra_deg },
        { label: 'Center Dec', value: result.center_dec_deg },
        { label: 'Pixel scale', value: result.pixel_scale },
        { label: 'Sources detected', value: result.sources_detected },
        { label: 'WCS FITS URL', value: result.wcs_image_url },
      ],
    },
    {
      title: 'Request',
      rows: [
        { label: 'Status', value: result.status },
        { label: 'Request ID', value: result.request_id },
        ...getCacheRows(result.cache),
      ],
    },
  ];
}

export function getAstrometryRunStatusLabel(run: IAstrometryRun): string {
  if (run.status === 'running') {
    return 'Running';
  }

  return run.status === 'complete' ? 'Complete' : 'Failed';
}

export function isAstrometryCentralizationAvailable(run: IAstrometryRun): boolean {
  return (
    run.status === 'complete' &&
    isFiniteNumber(run.result?.center_ra_deg) &&
    isFiniteNumber(run.result?.center_dec_deg)
  );
}

export function isAstrometryCentralizationApplied(
  item: IAnalysisItem,
  run: IAstrometryRun,
): boolean {
  return item.astrometryCentralization?.runId === run.id;
}

export function getAstrometryCentralizationActionLabel(
  item: IAnalysisItem,
  run: IAstrometryRun,
): string {
  return isAstrometryCentralizationApplied(item, run)
    ? 'Remove Centralization'
    : 'Apply Centralization';
}
