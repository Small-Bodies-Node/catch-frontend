import {
  IAstrometryInputs,
  IAstrometryPhotometrySuccess,
  IAstrometryResult,
  IAstrometryRun,
  TAstrometryBand,
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

const ASTROMETRY_BANDS: readonly TAstrometryBand[] = ['g', 'r', 'i', 'z', 'y'];

export function createDefaultAstrometryInputs(apiDatum: TApiDatum): IAstrometryInputs {
  return {
    image_url: apiDatum.cutout_url || '',
    ra: getNumberFromDatumOrCutoutUrl(apiDatum, 'ra') ?? 0,
    dec: getNumberFromDatumOrCutoutUrl(apiDatum, 'dec') ?? 0,
    use_ra_dec: true,
    pixel_scale: getAstrometryPixelScale(apiDatum),
    scale_low: null,
    scale_high: null,
    search_radius: 2,
    snr_threshold: 3,
    aperture_radius: 7,
    catalog: 'PanSTARRS1',
    obs_band: normalizeAstrometryBand(apiDatum.filter) ?? 'g',
    cal_band: 'r',
    return_plot: false,
    plot_type: 'color_correction',
  };
}

export function getAstrometryInputRows(inputs: IAstrometryInputs): ICatToolsDatumRow[] {
  return [
    { label: 'RA', value: inputs.ra },
    { label: 'Dec', value: inputs.dec },
    { label: 'Pixel scale', value: inputs.pixel_scale },
    { label: 'Scale low', value: inputs.scale_low },
    { label: 'Scale high', value: inputs.scale_high },
    { label: 'Search radius', value: inputs.search_radius },
    { label: 'SNR threshold', value: inputs.snr_threshold },
    { label: 'Aperture radius', value: inputs.aperture_radius },
    { label: 'Catalog', value: inputs.catalog },
    { label: 'Observation band', value: inputs.obs_band },
    { label: 'Calibration band', value: inputs.cal_band },
    { label: 'Return plot', value: inputs.return_plot ? 'Yes' : 'No' },
    { label: 'Plot type', value: inputs.plot_type },
  ];
}

export function getAstrometryResultGroups(result: IAstrometryResult): ICatToolsResultGroup[] {
  const groups: ICatToolsResultGroup[] = [
    {
      title: 'Astrometric Calibration Output',
      rows: [
        { label: 'Center RA', value: result.astrometry.center_ra_deg },
        { label: 'Center Dec', value: result.astrometry.center_dec_deg },
        { label: 'Pixel scale', value: result.astrometry.pixel_scale },
      ],
    },
  ];

  if (isAstrometryPhotometrySuccess(result.photometry)) {
    groups.push({
      title: 'Photometric Calibration Output',
      rows: [
        { label: 'Zero point', value: result.photometry.zero_point },
        { label: 'Color term', value: result.photometry.color_term },
        { label: 'Uncertainty', value: result.photometry.uncertainty },
      ],
    });
  } else if (result.photometry?.status === 'failed') {
    groups.push({
      title: 'Photometric Calibration Output',
      rows: [
        { label: 'Status', value: 'Failed' },
        { label: 'Error type', value: result.photometry.error_type },
        { label: 'Stage', value: result.photometry.stage },
        { label: 'Message', value: result.photometry.message },
      ],
    });
  }

  groups.push({
    title: 'Sources',
    rows: [
      { label: 'Detected', value: result.sources.detected },
      { label: 'Matched', value: result.sources.matched },
    ],
  });

  if (result.request_id || result.status || result.cache) {
    groups.push({
      title: 'Request',
      rows: [
        { label: 'Status', value: result.status ?? 'success' },
        { label: 'Request ID', value: result.request_id },
        ...getCacheRows(result.cache),
      ],
    });
  }

  return groups;
}

export function getAstrometryPhotometryWarning(result: IAstrometryResult): string | null {
  if (result.status !== 'partial_success' || result.photometry?.status !== 'failed') {
    return null;
  }

  const pieces = ['Astrometry solved, but photometry calibration failed.'];
  if (result.photometry.message) {
    pieces.push(result.photometry.message);
  }
  if (result.photometry.error_type) {
    pieces.push(`Error type: ${result.photometry.error_type}.`);
  }
  if (result.photometry.stage) {
    pieces.push(`Stage: ${result.photometry.stage}.`);
  }
  if (result.request_id) {
    pieces.push(`Request ID: ${result.request_id}.`);
  }

  return pieces.join(' ');
}

export function getAstrometryRunStatusLabel(run: IAstrometryRun): string {
  if (run.status === 'running') {
    return 'Running';
  }

  if (run.status === 'complete') {
    return isAstrometryPartialSuccess(run) ? 'Partial Success' : 'Complete';
  }

  return 'Failed';
}

export function isAstrometryPartialSuccess(run: IAstrometryRun): boolean {
  return run.result?.status === 'partial_success';
}

export function isAstrometryCentralizationAvailable(run: IAstrometryRun): boolean {
  return (
    run.status === 'complete' &&
    isFiniteNumber(run.result?.astrometry.center_ra_deg) &&
    isFiniteNumber(run.result?.astrometry.center_dec_deg)
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

export function normalizeAstrometryBand(value: string | null): TAstrometryBand | null {
  const band = value?.trim().toLowerCase();
  return ASTROMETRY_BANDS.includes(band as TAstrometryBand) ? (band as TAstrometryBand) : null;
}

export function isAstrometryPhotometrySuccess(
  photometry: IAstrometryResult['photometry'],
): photometry is IAstrometryPhotometrySuccess {
  return (
    !!photometry &&
    photometry.status !== 'failed' &&
    isFiniteNumber(photometry.zero_point) &&
    isFiniteNumber(photometry.color_term) &&
    isFiniteNumber(photometry.uncertainty)
  );
}
