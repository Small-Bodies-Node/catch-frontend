import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { TimeoutError, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

import { apiDefaultTimeoutMs } from '../../../utils/constants';

export const pipelineInterceptor: HttpInterceptorFn = (req, next) => {
  const requestId = req.headers.get('X-CATCH-Request-Id') || createRequestId();
  const shouldTrace = isAstrometryRequest(req.url) || req.headers.get('X-CATCH-Debug') === 'true';
  const timeoutValue = getTimeoutValue(
    req.headers.get('X-CATCH-Timeout-Ms'),
    req.headers.get('timeout'),
  );
  const requestWithTraceId = req.clone({
    headers: req.headers.set('X-CATCH-Request-Id', requestId),
  });
  const cleanedReq = requestWithTraceId.clone({
    headers: requestWithTraceId.headers.delete('X-CATCH-Timeout-Ms').delete('timeout'),
  });
  const startedAt = Date.now();

  if (shouldTrace) {
    console.log(
      `[HTTP pipeline ${requestId}] sending ${cleanedReq.method} ${cleanedReq.urlWithParams}; ` +
        `timeout=${timeoutValue}ms`,
    );
  }

  return next(cleanedReq).pipe(
    timeout(timeoutValue),
    tap((event) => {
      if (!shouldTrace || !(event instanceof HttpResponse)) {
        return;
      }

      console.log(
        `[HTTP pipeline ${requestId}] received status=${event.status} from ${event.url}; ` +
          `catStatus=${event.headers.get('X-CATCH-CAT-Status') || 'n/a'} ` +
          `catDuration=${event.headers.get('X-CATCH-CAT-Duration-Ms') || 'n/a'}ms ` +
          `total=${Date.now() - startedAt}ms`,
      );
    }),
    catchError((error) => {
      if (shouldTrace) {
        console.error(`[HTTP pipeline ${requestId}] failed after ${Date.now() - startedAt}ms`, {
          message: getErrorMessage(error),
          status: error instanceof HttpErrorResponse ? error.status : 'n/a',
          statusText: error instanceof HttpErrorResponse ? error.statusText : 'n/a',
          catStatus:
            error instanceof HttpErrorResponse
              ? error.headers.get('X-CATCH-CAT-Status') || 'n/a'
              : 'n/a',
          catDurationMs:
            error instanceof HttpErrorResponse
              ? error.headers.get('X-CATCH-CAT-Duration-Ms') || 'n/a'
              : 'n/a',
          url: error instanceof HttpErrorResponse ? error.url : cleanedReq.urlWithParams,
        });
      }

      return throwError(() => error);
    }),
  );
};

function getTimeoutValue(...headerValues: Array<string | null>): number {
  const rawTimeoutValue = headerValues.find((value) => value !== null);
  const timeoutValue = Number.parseInt(rawTimeoutValue ?? '', 10);

  return Number.isFinite(timeoutValue) && timeoutValue > 0 ? timeoutValue : apiDefaultTimeoutMs;
}

function isAstrometryRequest(url: string): boolean {
  return /\/api\/cat\/astrometry(?:[/?#]|$)/.test(url);
}

function createRequestId(): string {
  return `catch-http-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'Request timed out in pipeline interceptor';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
