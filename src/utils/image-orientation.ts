/** Preview adapters own geometry. A survey name must never transform pixels. */
export const imageOrientation = {};
export interface IOverlaySurveyScaleFactors {
  x: 1 | -1;
  y: 1 | -1;
}

export function getOverlaySurveyScaleFactors(
  _source: string | null | undefined,
): IOverlaySurveyScaleFactors {
  return { x: 1, y: 1 };
}
export function getOverlaySurveyScaleTransform(_source: string | null | undefined): string {
  return 'scale(1, 1)';
}
export function getOverlaySurveyDeltaScaleFactors(
  _source: string | null | undefined,
): IOverlaySurveyScaleFactors {
  // FITS bottom-left -> preview top-left. Accurate overlays use world coordinates.
  return { x: 1, y: -1 };
}
export function transformOverlaySurveyDelta(
  source: string | null | undefined,
  deltaX: number,
  deltaY: number,
): { x: number; y: number } {
  const scale = getOverlaySurveyDeltaScaleFactors(source);
  return { x: deltaX * scale.x, y: deltaY * scale.y };
}
export function getTableThumbnailSurveyScaleTransform(
  _source: string | null | undefined,
  _isReorientated: boolean,
): string {
  return 'scale(1, 1)';
}
