import { IAstrometryRun } from '../../../../../models/IAstrometryRun';
import {
  IPhotometricCalibrationInputs,
  IPhotometricCalibrationResult,
  IPhotometricCalibrationRun,
} from '../../../../../models/IPhotometricCalibrationRun';
import { getCacheRows } from './cat-tools-formatters';
import { getPhotometricCalibrationCatalogConfiguration } from './cat-photometric-catalog';
import { IAnalysisItem, ICatToolsDatumRow, ICatToolsResultGroup } from './cat-tools.types';

export interface IPhotometricCalibrationPlot {
  label: string;
  url: string;
}

export function createDefaultPhotometricCalibrationInputs(
  astrometryRun: IAstrometryRun,
): IPhotometricCalibrationInputs {
  const catalog = 'PanSTARRS1';
  const configuration = getPhotometricCalibrationCatalogConfiguration(catalog);
  return {
    wcs_image_url: astrometryRun.result?.wcs_image_url ?? '',
    snr_threshold: 3,
    aperture_radius: 7,
    catalog,
    cal_band: configuration.defaultBand,
    color_term: configuration.defaultColorTerm,
  };
}

export function getPhotometricCalibrationInputRows(
  inputs: IPhotometricCalibrationInputs,
): ICatToolsDatumRow[] {
  return [
    { label: 'WCS FITS URL', value: inputs.wcs_image_url },
    { label: 'SNR threshold', value: inputs.snr_threshold },
    { label: 'Aperture radius', value: inputs.aperture_radius },
    { label: 'Catalog', value: inputs.catalog },
    { label: 'Calibration band', value: inputs.cal_band },
    { label: 'Color index', value: inputs.color_term },
  ];
}

export function getPhotometricCalibrationResultGroups(
  result: IPhotometricCalibrationResult,
): ICatToolsResultGroup[] {
  return [
    {
      title: 'Photometric Calibration Output',
      rows: [
        { label: 'Zero point', value: result.photometry.zero_point },
        { label: 'Color-term coefficient', value: result.photometry.color_term },
        { label: 'Uncertainty', value: result.photometry.uncertainty },
        { label: 'Color index', value: result.photometry.color_index },
        { label: 'Catalog', value: result.photometry.catalog },
        { label: 'Calibration band', value: result.photometry.cal_band },
        { label: 'Photometry FITS URL', value: result.photometry_image_url },
      ],
    },
    {
      title: 'Sources',
      rows: [
        { label: 'Detected', value: result.sources.detected },
        { label: 'Matched', value: result.sources.matched },
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

export function getPhotometricCalibrationPlots(
  result: IPhotometricCalibrationResult,
): IPhotometricCalibrationPlot[] {
  return [
    { label: 'Color correction', url: result.plots.color_correction.url },
    { label: 'Image overlay', url: result.plots.image_overlay.url },
  ];
}

export function getPhotometricCalibrationRuns(
  item: IAnalysisItem,
  astrometryRun: IAstrometryRun,
): IPhotometricCalibrationRun[] {
  return item.photometricCalibrationRunsState?.[astrometryRun.id] ?? [];
}

export function getActivePhotometricCalibrationRun(
  item: IAnalysisItem,
  astrometryRun: IAstrometryRun,
): IPhotometricCalibrationRun | null {
  const runs = getPhotometricCalibrationRuns(item, astrometryRun);
  const latestRun = runs[runs.length - 1];
  return latestRun?.status === 'complete' && latestRun.result ? latestRun : null;
}

export function hasRunningPhotometricCalibration(
  item: IAnalysisItem,
  astrometryRun: IAstrometryRun,
): boolean {
  const runs = getPhotometricCalibrationRuns(item, astrometryRun);
  return runs.some((run) => run.status === 'running');
}

export function getPhotometricCalibrationRunStatusLabel(run: IPhotometricCalibrationRun): string {
  if (run.status === 'running') {
    return 'Running';
  }

  return run.status === 'complete' ? 'Complete' : 'Failed';
}
