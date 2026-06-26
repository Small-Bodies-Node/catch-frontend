import { normalizeSiteBanner } from './site-banner.service';

describe('normalizeSiteBanner', () => {
  it('keeps enabled banners with trimmed messages', () => {
    expect(
      normalizeSiteBanner({
        enabled: true,
        level: 'error',
        message: '  ATLAS data not available until 2026-07-01  ',
      }),
    ).toEqual({
      enabled: true,
      level: 'error',
      message: 'ATLAS data not available until 2026-07-01',
      isDataAccessDisabled: false,
    });
  });

  it('disables empty banners', () => {
    expect(normalizeSiteBanner({ enabled: true, level: 'warning', message: '   ' })).toEqual({
      enabled: false,
      level: 'warning',
      message: '',
      isDataAccessDisabled: false,
    });
  });

  it('falls back to warning for unexpected levels', () => {
    expect(
      normalizeSiteBanner({
        enabled: true,
        level: 'urgent' as never,
        message: 'Heads up',
      }),
    ).toEqual({
      enabled: true,
      level: 'warning',
      message: 'Heads up',
      isDataAccessDisabled: false,
    });
  });

  it('keeps runtime schedule and data-access downtime values', () => {
    expect(
      normalizeSiteBanner({
        enabled: true,
        level: 'warning',
        message: 'Scheduled outage',
        startsAt: '  2026-07-01T17:00:00Z  ',
        expiresAt: '  2026-07-01T18:00:00Z  ',
        isDataAccessDisabled: true,
      }),
    ).toEqual({
      enabled: true,
      level: 'warning',
      message: 'Scheduled outage',
      startsAt: '2026-07-01T17:00:00Z',
      expiresAt: '2026-07-01T18:00:00Z',
      isDataAccessDisabled: true,
    });
  });
});
