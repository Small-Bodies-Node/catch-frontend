import { getSiteBannerFromEnv } from './site-banner';

describe('getSiteBannerFromEnv', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-06-26T12:00:00Z'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('waits until the configured start time before enabling banner and data lock', () => {
    expect(
      getSiteBannerFromEnv({
        CATCH_SITE_BANNER_MESSAGE: 'Scheduled downtime',
        CATCH_SITE_BANNER_STARTS_AT: '2026-06-26T13:00:00Z',
        CATCH_DATA_ACCESS_DISABLED: 'true',
      }),
    ).toEqual({
      enabled: false,
      level: 'warning',
      message: 'Scheduled downtime',
      startsAt: '2026-06-26T13:00:00Z',
      isDataAccessDisabled: false,
    });
  });

  it('enables banner and data lock inside the configured schedule window', () => {
    expect(
      getSiteBannerFromEnv({
        CATCH_SITE_BANNER_MESSAGE: 'Scheduled downtime',
        CATCH_SITE_BANNER_LEVEL: 'error',
        CATCH_SITE_BANNER_STARTS_AT: '2026-06-26T11:00:00Z',
        CATCH_SITE_BANNER_EXPIRES_AT: '2026-06-26T13:00:00Z',
        CATCH_DATA_ACCESS_DISABLED: 'yes',
      }),
    ).toEqual({
      enabled: true,
      level: 'error',
      message: 'Scheduled downtime',
      startsAt: '2026-06-26T11:00:00Z',
      expiresAt: '2026-06-26T13:00:00Z',
      isDataAccessDisabled: true,
    });
  });
});
