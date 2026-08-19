import { HttpErrorResponse } from '@angular/common/http';
import { IAstrometryErrorResponse } from '../../../models/IAstrometryRun';

export function formatAstrometryError(error: unknown): string {
  if (error instanceof HttpErrorResponse && error.status === 503) {
    return 'Astrometry reference files are not ready. Please retry astrometric calibration shortly.';
  }

  const body = getAstrometryErrorBody(error);
  if (body) {
    const details = [
      body.message,
      body.status ? `Status: ${body.status}.` : null,
      body.error_type ? `Error type: ${body.error_type}.` : null,
      body.stage ? `Stage: ${body.stage}.` : null,
      body.request_id ? `Request ID: ${body.request_id}.` : null,
      body.wcs_image_url ? `WCS image URL: ${body.wcs_image_url}.` : null,
      body.image_url ? `Image URL: ${body.image_url}.` : null,
    ].filter((detail): detail is string => !!detail);

    if (details.length > 0) {
      return details.join(' ');
    }
  }

  if (error instanceof HttpErrorResponse) {
    return error.message || 'Unable to run astrometry.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to run astrometry.';
}

function getAstrometryErrorBody(error: unknown): IAstrometryErrorResponse | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  if (isAstrometryErrorResponse(error.error)) {
    return error.error;
  }

  if (typeof error.error === 'string') {
    try {
      const parsed: unknown = JSON.parse(error.error);
      return isAstrometryErrorResponse(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
}

function isAstrometryErrorResponse(value: unknown): value is IAstrometryErrorResponse {
  return typeof value === 'object' && value !== null;
}
