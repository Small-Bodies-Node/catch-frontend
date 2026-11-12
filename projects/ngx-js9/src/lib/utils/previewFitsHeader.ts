/** The same TAN projection used by the preview renderer, in FITS coordinates. */
export interface IPreviewWcs {
  referenceValue: [number, number];
  referencePixel: [number, number];
  size: [number, number];
  scale: [number, number];
  rotation: number;
  cdMatrix?: [[number, number], [number, number]];
  coordinateFrame?: string;
}
export function previewFitsHeader(wcs: IPreviewWcs): Record<string, number | string | boolean> {
  const cos = Math.cos(wcs.rotation),
    sin = Math.sin(wcs.rotation);
  const cd = wcs.cdMatrix ?? [
    [wcs.scale[0] * cos, -wcs.scale[1] * sin],
    [wcs.scale[0] * sin, wcs.scale[1] * cos],
  ];
  return {
    SIMPLE: true,
    BITPIX: -32,
    NAXIS: 2,
    NAXIS1: wcs.size[0],
    NAXIS2: wcs.size[1],
    CTYPE1: 'RA---TAN',
    CTYPE2: 'DEC--TAN',
    RADESYS: wcs.coordinateFrame ?? 'ICRS',
    CRPIX1: wcs.referencePixel[0],
    CRPIX2: wcs.referencePixel[1],
    CRVAL1: wcs.referenceValue[0],
    CRVAL2: wcs.referenceValue[1],
    CD1_1: cd[0][0],
    CD1_2: cd[0][1],
    CD2_1: cd[1][0],
    CD2_2: cd[1][1],
  };
}
