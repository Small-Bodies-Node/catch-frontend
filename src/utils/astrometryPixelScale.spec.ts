import {
  defaultAstrometryPixelScale,
  getAstrometryPixelScale,
  getCatalinaImageType,
} from './astrometryPixelScale';

describe('astrometryPixelScale', () => {
  it('maps known survey sources to their astrometry pixel scales', () => {
    expect(getAstrometryPixelScale({ source: 'atlas_haleakela' })).toBe(1.86);
    expect(getAstrometryPixelScale({ source: 'atlas_mauna_loa' })).toBe(1.86);
    expect(getAstrometryPixelScale({ source: 'skymapper_dr4' })).toBe(0.5);
    expect(getAstrometryPixelScale({ source: 'spacewatch' })).toBe(1.0);
    expect(getAstrometryPixelScale({ source: 'ps1dr2' })).toBe(0.25);
    expect(getAstrometryPixelScale({ source: 'neat_palomar_tricam' })).toBe(1.01);
    expect(getAstrometryPixelScale({ source: 'neat_maui_geodss' })).toBe(1.43);
    expect(getAstrometryPixelScale({ source: 'loneos' })).toBe(2.53);
  });

  it('extracts Catalina image type from archive-style links', () => {
    const archiveUrl =
      'https://sbnarchive.psi.edu/pds4/surveys/gbo.ast.catalina.survey/data_calibrated/703/2021/21Oct30/703_20211030_2B_N28024_01_0003.arch.fz';

    expect(getCatalinaImageType({ archive_url: archiveUrl })).toBe('703');
  });

  it('maps Catalina image types, including I52 treated as I51', () => {
    expect(
      getAstrometryPixelScale({
        source: 'catalina_bigelow',
        archive_url: '/data_calibrated/703/example.arch.fz',
      }),
    ).toBe(2.5);
    expect(
      getAstrometryPixelScale({
        source: 'catalina_lemmon',
        archive_url: '/data_calibrated/V06/example.arch.fz',
      }),
    ).toBe(0.6);
    expect(
      getAstrometryPixelScale({
        source: 'catalina_bokneosurvey',
        archive_url: '/data_calibrated/G96/example.arch.fz',
      }),
    ).toBe(1.5);
    expect(
      getAstrometryPixelScale({
        source: 'catalina_lemmon',
        archive_url: '/data_calibrated/I51/example.arch.fz',
      }),
    ).toBe(1.0);
    expect(
      getAstrometryPixelScale({
        source: 'catalina_lemmon',
        archive_url: '/data_calibrated/I52/example.arch.fz',
      }),
    ).toBe(1.0);
  });

  it('falls back to datum pixel_scale for unknown sources, then to the default', () => {
    expect(getAstrometryPixelScale({ source: 'unknown', pixel_scale: 0.42 })).toBe(0.42);
    expect(getAstrometryPixelScale({ source: 'unknown' })).toBe(defaultAstrometryPixelScale);
  });
});
