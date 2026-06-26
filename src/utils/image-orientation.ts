/**
 * Needed in order to display image with correct direction of increasing ra-dec
 */
export const imageOrientation = {
  skymapper: null,
  skymapper_dr4: null,
  catalina_bigelow: null,
  catalina_lemmon: null,
  ps1dr2: null,
  spacewatch: null,
  neat_palomar_tricam: 'flip-vertical',
  neat_maui_geodss: 'flip-vertical',
  loneos: 'flip-vertical,flip-horizontal',
};

export interface IOverlaySurveyScaleFactors {
  x: 1 | -1;
  y: 1 | -1;
}

export function getOverlaySurveyScaleFactors(
  source: string | null | undefined,
): IOverlaySurveyScaleFactors {
  const normalizedSource = source?.toLowerCase() ?? '';

  if (normalizedSource.includes('loneos')) return { x: 1, y: 1 };
  if (normalizedSource.includes('skymapper')) return { x: -1, y: 1 };
  if (normalizedSource.includes('spacewatch')) return { x: -1, y: 1 };
  if (normalizedSource.includes('catalina')) return { x: -1, y: 1 };
  if (normalizedSource.includes('ps1dr2')) return { x: -1, y: 1 };
  return { x: 1, y: 1 };
}

export function getOverlaySurveyScaleTransform(source: string | null | undefined): string {
  const scale = getOverlaySurveyScaleFactors(source);
  return `scale(${scale.x}, ${scale.y})`;
}

export function getOverlaySurveyDeltaScaleFactors(
  source: string | null | undefined,
): IOverlaySurveyScaleFactors {
  const normalizedSource = source?.toLowerCase() ?? '';

  // SkyMapper preview images are already mirrored horizontally in the overlay
  // with getOverlaySurveyScaleTransform(). FITS-pixel deltas therefore keep
  // their X direction here and only compensate for the FITS/JPG Y orientation.
  if (normalizedSource.includes('skymapper')) return { x: 1, y: -1 };
  return getOverlaySurveyScaleFactors(source);
}

export function transformOverlaySurveyDelta(
  source: string | null | undefined,
  deltaX: number,
  deltaY: number,
): { x: number; y: number } {
  const scale = getOverlaySurveyDeltaScaleFactors(source);
  return {
    x: deltaX * scale.x,
    y: deltaY * scale.y,
  };
}

export function getTableThumbnailSurveyScaleTransform(
  source: string | null | undefined,
  isReorientated: boolean,
): string {
  if (!isReorientated || !source) return 'scale(1, 1)';

  if (source.includes('neat')) {
    return 'scale(1, 1)';
  }
  if (source.includes('atlas')) {
    return 'scale(1, 1)';
  }
  if (source === 'loneos') {
    return 'scale(-1, -1)';
  }
  if (source === 'skymapper_dr4') {
    return 'rotate(180deg)';
  }
  if (source === 'ps1dr2') {
    return 'scale(-1, -1)';
  }
  if (source === 'spacewatch') {
    return 'scale(-1, 1)';
  }
  if (['catalina_bigelow', 'catalina_lemmon', 'catalina_bokneosurvey'].includes(source)) {
    return 'scale(-1, -1)';
  }

  return 'scale(1, 1)';
}
