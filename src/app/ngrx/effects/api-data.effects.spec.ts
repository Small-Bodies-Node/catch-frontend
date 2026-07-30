import { HttpErrorResponse } from '@angular/common/http';
import { formatAstrometryError } from './cat-astrometry-error';

describe('CAT calibration error formatting', () => {
  it('presents astrometry 503 as a retryable reference-file readiness problem', () => {
    const message = formatAstrometryError(
      new HttpErrorResponse({ status: 503, statusText: 'Service Unavailable' }),
    );

    expect(message).toContain('reference files are not ready');
    expect(message).toContain('retry');
  });

  it('keeps validation details visible for recoverable API failures', () => {
    const message = formatAstrometryError(
      new HttpErrorResponse({
        status: 422,
        error: {
          status: 'error',
          message: 'Invalid scale bounds.',
          request_id: 'request-422',
        },
      }),
    );

    expect(message).toContain('Invalid scale bounds.');
    expect(message).toContain('request-422');
  });
});
