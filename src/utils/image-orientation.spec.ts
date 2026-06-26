import {
  getOverlaySurveyDeltaScaleFactors,
  getOverlaySurveyScaleTransform,
  getTableThumbnailSurveyScaleTransform,
  transformOverlaySurveyDelta,
} from './image-orientation';

describe('image orientation helpers', () => {
  it('preserves overlay transforms for currently handled sources', () => {
    expect(getOverlaySurveyScaleTransform('loneos')).toBe('scale(1, 1)');
    expect(getOverlaySurveyScaleTransform('skymapper_dr4')).toBe('scale(-1, 1)');
    expect(getOverlaySurveyScaleTransform('spacewatch')).toBe('scale(-1, 1)');
    expect(getOverlaySurveyScaleTransform('catalina_lemmon')).toBe('scale(-1, 1)');
    expect(getOverlaySurveyScaleTransform('ps1dr2')).toBe('scale(-1, 1)');
    expect(getOverlaySurveyScaleTransform('neat_palomar_tricam')).toBe('scale(1, 1)');
    expect(getOverlaySurveyScaleTransform(undefined)).toBe('scale(1, 1)');
  });

  it('preserves table-thumbnail transforms when reorientation is enabled', () => {
    expect(getTableThumbnailSurveyScaleTransform('neat_palomar_tricam', true)).toBe('scale(1, 1)');
    expect(getTableThumbnailSurveyScaleTransform('atlas_haleakela', true)).toBe('scale(1, 1)');
    expect(getTableThumbnailSurveyScaleTransform('loneos', true)).toBe('scale(-1, -1)');
    expect(getTableThumbnailSurveyScaleTransform('skymapper_dr4', true)).toBe('rotate(180deg)');
    expect(getTableThumbnailSurveyScaleTransform('ps1dr2', true)).toBe('scale(-1, -1)');
    expect(getTableThumbnailSurveyScaleTransform('spacewatch', true)).toBe('scale(-1, 1)');
    expect(getTableThumbnailSurveyScaleTransform('catalina_bigelow', true)).toBe('scale(-1, -1)');
  });

  it('does not transform table thumbnails when reorientation is disabled', () => {
    expect(getTableThumbnailSurveyScaleTransform('skymapper_dr4', false)).toBe('scale(1, 1)');
  });

  it('uses the displayed FITS-to-JPG delta orientation for SkyMapper centroid movement', () => {
    expect(getOverlaySurveyDeltaScaleFactors('skymapper_dr4')).toEqual({ x: 1, y: -1 });
    expect(transformOverlaySurveyDelta('skymapper_dr4', -12, 5)).toEqual({ x: -12, y: -5 });
  });

  it('mirrors overlay deltas for horizontally flipped overlay sources', () => {
    expect(transformOverlaySurveyDelta('spacewatch', -12, 5)).toEqual({ x: 12, y: 5 });
    expect(transformOverlaySurveyDelta('catalina_lemmon', -12, 5)).toEqual({ x: 12, y: 5 });
    expect(transformOverlaySurveyDelta('ps1dr2', -12, 5)).toEqual({ x: 12, y: 5 });
  });

  it('preserves overlay deltas for unflipped overlay sources', () => {
    expect(transformOverlaySurveyDelta('neat_palomar_tricam', -12, 5)).toEqual({
      x: -12,
      y: 5,
    });
    expect(transformOverlaySurveyDelta('atlas_haleakela', -12, 5)).toEqual({ x: -12, y: 5 });
    expect(transformOverlaySurveyDelta('loneos', -12, 5)).toEqual({ x: -12, y: 5 });
  });
});
