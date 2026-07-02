import { pixel_to_world, world_to_pixel } from './avm';

describe('AVM WCS coordinate conversion', () => {
  const wcs = {
    referenceValue: [174.62, 17.96],
    referencePixel: [149, 149],
    size: [298, 298],
    scale: [-0.00028, 0.00028],
    rotation: (12 * Math.PI) / 180,
  };

  it('round-trips world coordinates through image pixels', () => {
    const expectedRa = 174.6214;
    const expectedDec = 17.9683;
    const [x, y] = world_to_pixel(wcs, expectedRa, expectedDec);
    const [actualRa, actualDec] = pixel_to_world(wcs, x, y);

    expect(actualRa).toBeCloseTo(expectedRa, 8);
    expect(actualDec).toBeCloseTo(expectedDec, 8);
  });

  it('returns the reference value for the reference pixel', () => {
    const y = wcs.size[1] - wcs.referencePixel[1] + 1;
    const [ra, dec] = pixel_to_world(wcs, wcs.referencePixel[0], y);

    expect(ra).toBeCloseTo(wcs.referenceValue[0], 10);
    expect(dec).toBeCloseTo(wcs.referenceValue[1], 10);
  });

  it('normalizes right ascension near zero degrees', () => {
    const wrapWcs = {
      ...wcs,
      referenceValue: [0.001, 0],
      rotation: 0,
    };
    const [ra] = pixel_to_world(wrapWcs, wrapWcs.referencePixel[0] + 20, 150);

    expect(ra).toBeGreaterThanOrEqual(0);
    expect(ra).toBeLessThan(360);
  });
});
