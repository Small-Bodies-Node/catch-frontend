import {
  DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
  getAspectAwareCrudeOverlayAngularFov,
} from './crudeOverlayFov';

describe('crude overlay FOV helpers', () => {
  it('preserves a square footprint for square images', () => {
    expect(getAspectAwareCrudeOverlayAngularFov(600, 600)).toEqual({
      widthDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
      heightDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
    });
  });

  it('uses the requested FOV on the longer side of a tall SkyMapper image', () => {
    const fov = getAspectAwareCrudeOverlayAngularFov(544, 606, 0.0833);

    expect(fov.widthDeg).toBeCloseTo(0.0833 * (544 / 606), 10);
    expect(fov.heightDeg).toBe(0.0833);
  });

  it('uses the requested FOV on the longer side of a wide image', () => {
    const fov = getAspectAwareCrudeOverlayAngularFov(800, 400, 0.12);

    expect(fov.widthDeg).toBe(0.12);
    expect(fov.heightDeg).toBe(0.06);
  });

  it('falls back to the default square footprint for invalid dimensions', () => {
    expect(getAspectAwareCrudeOverlayAngularFov(0, 606, 0.0833)).toEqual({
      widthDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
      heightDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
    });
  });

  it('falls back to the default requested FOV while preserving valid image aspect', () => {
    const fov = getAspectAwareCrudeOverlayAngularFov(544, 606, Number.NaN);

    expect(fov.widthDeg).toBeCloseTo(DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG * (544 / 606), 10);
    expect(fov.heightDeg).toBe(DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG);
  });
});
