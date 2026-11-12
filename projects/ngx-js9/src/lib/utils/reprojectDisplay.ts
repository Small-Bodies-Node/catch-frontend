import { IPreviewWcs } from './previewFitsHeader';
import { previewPixelToWorld } from './previewPixelToWorld';

/** Resample a display only, using JS9's complete native WCS including TPV/SIP.
 *
 * Montage in the bundled JS9 crashes on clipped SkyMapper TPV cutouts. Direct
 * inverse mapping avoids approximating that WCS. Yield between chunks so a
 * changed selection can cancel before a released native WCS is accessed.
 */
export async function reprojectDisplay(
  native: { data: ArrayLike<number>; width: number; height: number },
  preview: IPreviewWcs,
  worldToNative: (ra: number, dec: number) => [number, number],
  isCurrent: () => boolean,
): Promise<Float32Array> {
  const [width, height] = preview.size;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width * height > 4_194_304
  )
    throw new Error('Preview dimensions exceed the aligned display limit.');
  const rendered = new Float32Array(width * height).fill(NaN);
  for (let start = 0; start < height; start += 16) {
    if (!isCurrent()) throw new DOMException('Image selection changed.', 'AbortError');
    for (let y = start; y < Math.min(start + 16, height); y++) {
      for (let x = 0; x < width; x++) {
        const [ra, dec] = previewPixelToWorld(preview, x, y);
        const [nx, ny] = worldToNative(ra, dec);
        const ix = Math.floor(nx + 0.5),
          iy = Math.floor(ny + 0.5);
        if (
          Number.isFinite(nx) &&
          Number.isFinite(ny) &&
          ix >= 0 &&
          ix < native.width &&
          iy >= 0 &&
          iy < native.height
        )
          rendered[y * width + x] = native.data[iy * native.width + ix];
      }
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  if (!isCurrent()) throw new DOMException('Image selection changed.', 'AbortError');
  return rendered;
}
