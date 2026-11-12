import { IWcs } from '../app/core/services/image-wcs/image-wcs.service';
import { pixel_to_world, world_to_pixel } from './avm';

/** Clockwise angle from screen-up, measured at the preview's centre using its WCS. */
export function northArrowAngle(wcs: IWcs): number | null {
  try {
    const [ra, dec] = pixel_to_world(wcs, wcs.size[0] / 2, wcs.size[1] / 2);
    if (!Number.isFinite(dec) || Math.abs(dec) >= 89.999999) return null;
    const center = world_to_pixel(wcs, ra, dec);
    const north = world_to_pixel(wcs, ra, dec + Math.min(0.001, (90 - dec) / 2));
    const dx = north[0] - center[0],
      dy = north[1] - center[1];
    return Number.isFinite(dx) && Number.isFinite(dy) && Math.hypot(dx, dy) > 0
      ? (Math.atan2(dx, -dy) * 180) / Math.PI
      : null;
  } catch {
    // An image without usable WCS must not display a guessed compass direction.
    return null;
  }
}
