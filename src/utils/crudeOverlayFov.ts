export const DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG = 0.0833;

export interface ICrudeOverlayAngularFov {
  widthDeg: number;
  heightDeg: number;
}

/**
 * Estimate the angular footprint for the legacy RA/Dec overlay projection.
 *
 * This is intentionally still a crude model: it assumes the target RA/Dec is at
 * the image center and that the longer raster side spans the requested cutout
 * size. That keeps the existing projection lightweight while avoiding the
 * square-FOV error on thin SkyMapper images such as 544 x 606.
 */
export function getAspectAwareCrudeOverlayAngularFov(
  imageWidthPx: number,
  imageHeightPx: number,
  longestSideAngularFovDeg = DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
): ICrudeOverlayAngularFov {
  if (
    !Number.isFinite(imageWidthPx) ||
    !Number.isFinite(imageHeightPx) ||
    imageWidthPx <= 0 ||
    imageHeightPx <= 0
  ) {
    return {
      widthDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
      heightDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
    };
  }

  const safeLongestSideAngularFovDeg =
    Number.isFinite(longestSideAngularFovDeg) && longestSideAngularFovDeg > 0
      ? longestSideAngularFovDeg
      : DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG;

  if (imageWidthPx >= imageHeightPx) {
    return {
      widthDeg: safeLongestSideAngularFovDeg,
      heightDeg: safeLongestSideAngularFovDeg * (imageHeightPx / imageWidthPx),
    };
  }

  return {
    widthDeg: safeLongestSideAngularFovDeg * (imageWidthPx / imageHeightPx),
    heightDeg: safeLongestSideAngularFovDeg,
  };
}
