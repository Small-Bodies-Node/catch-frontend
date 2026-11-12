import { pixel_to_world, world_to_pixel } from './avm';
describe('exact TAN preview coordinates', () => {
  const wcs = {
    referenceValue: [359.99, -16.2],
    referencePixel: [288.5, 303.5],
    size: [576, 606],
    scale: [-0.000138, 0.0001379],
    rotation: 0,
    cdMatrix: [
      [-0.000138, 0.000002],
      [0.000001, 0.0001379],
    ],
  };
  it('matches independent Astropy output across the RA zero boundary', () => {
    const [x, y] = world_to_pixel(wcs, 0.001, -16.196);
    expect(x).toBeCloseTo(211.88165223641772, 7);
    expect(y).toBeCloseTo(273.4435422751628, 7);
    const [ra, dec] = pixel_to_world(wcs, x, y);
    expect(ra).toBeCloseTo(0.001, 9);
    expect(dec).toBeCloseTo(-16.196, 9);
  });
  it('places the reference pixel on browser pixel centers', () => {
    expect(world_to_pixel(wcs, 359.99, -16.2)).toEqual([288, 303]);
    const [ra, dec] = pixel_to_world(wcs, 288, 303);
    expect(ra).toBeCloseTo(359.99, 10);
    expect(dec).toBeCloseTo(-16.2, 10);
  });
  it('points north up and east left in a canonical view', () => {
    const canonical = {
      ...wcs,
      cdMatrix: [
        [-0.000138, 0],
        [0, 0.0001379],
      ],
    };
    const center = world_to_pixel(canonical, 359.99, -16.2);
    const north = world_to_pixel(canonical, 359.99, -16.199);
    const east = world_to_pixel(canonical, 359.991, -16.2);
    expect(north[1]).toBeLessThan(center[1]);
    expect(north[0]).toBeCloseTo(center[0], 7);
    expect(east[0]).toBeLessThan(center[0]);
  });
});
