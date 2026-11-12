import {
  getOverlaySurveyScaleTransform,
  getTableThumbnailSurveyScaleTransform,
} from './image-orientation';

describe('provider-owned image geometry', () => {
  it('keeps thumbnails and previews identical for every survey', () => {
    for (const source of [
      'skymapper_dr4',
      'spacewatch',
      'catalina_lemmon',
      'ps1dr2',
      'neat_palomar_tricam',
      'atlas_haleakela',
      'loneos',
    ]) {
      expect(getOverlaySurveyScaleTransform(source)).toBe('scale(1, 1)');
      expect(getTableThumbnailSurveyScaleTransform(source, true)).toBe('scale(1, 1)');
      expect(getTableThumbnailSurveyScaleTransform(source, false)).toBe('scale(1, 1)');
    }
  });
});
