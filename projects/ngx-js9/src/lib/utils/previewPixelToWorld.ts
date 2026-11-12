import { IPreviewWcs } from './previewFitsHeader';

/** Exact inverse TAN projection from zero-based FITS array pixel centers. */
export function previewPixelToWorld(wcs: IPreviewWcs, x: number, y: number): [number, number] {
  const cos = Math.cos(wcs.rotation),
    sin = Math.sin(wcs.rotation);
  const cd = wcs.cdMatrix ?? [
    [wcs.scale[0] * cos, -wcs.scale[1] * sin],
    [wcs.scale[0] * sin, wcs.scale[1] * cos],
  ];
  const dx = x + 1 - wcs.referencePixel[0],
    dy = y + 1 - wcs.referencePixel[1];
  const radians = Math.PI / 180;
  const xi = (cd[0][0] * dx + cd[0][1] * dy) * radians;
  const eta = (cd[1][0] * dx + cd[1][1] * dy) * radians;
  const lon = wcs.referenceValue[0] * radians,
    lat = wcs.referenceValue[1] * radians;
  const denominator = Math.cos(lat) - eta * Math.sin(lat);
  const ra = (lon + Math.atan2(xi, denominator)) / radians;
  const dec =
    Math.atan2(Math.sin(lat) + eta * Math.cos(lat), Math.hypot(denominator, xi)) / radians;
  return [((ra % 360) + 360) % 360, dec];
}
