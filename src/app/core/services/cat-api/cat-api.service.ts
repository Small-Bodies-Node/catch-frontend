import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IAstrometryInputs, IAstrometryResult } from '../../../../models/IAstrometryRun';

const catProxyBaseUrl = '/api/cat';
const astrometryTimeoutMs = 120_000;

@Injectable({ providedIn: 'root' })
export class CatApiService {
  constructor(private httpClient: HttpClient) {}

  fetchHello(): Observable<string> {
    return this.fetchText('hello').pipe(
      catchError((error) => {
        console.error('CAT hello request failed:', error);
        return of('Unable to reach CAT service.');
      }),
    );
  }

  fetchHealth(): Observable<string> {
    return this.fetchText('health').pipe(
      catchError((error) => {
        console.error('CAT health request failed:', error);
        return of('Unable to reach CAT health service.');
      }),
    );
  }

  fetchAstrometry(payload: IAstrometryInputs): Observable<IAstrometryResult> {
    const requestId = createRequestId('catch-astrometry');
    console.log(`[CAT API ${requestId}] launching astrometry`, {
      url: this.getCatUrl('astrometry'),
      imageUrl: payload.image_url,
      ra: payload.ra,
      dec: payload.dec,
      pixelScale: payload.pixel_scale,
      timeoutMs: astrometryTimeoutMs,
    });

    return this.httpClient.post<IAstrometryResult>(this.getCatUrl('astrometry'), payload, {
      headers: {
        'X-CATCH-Debug': 'true',
        'X-CATCH-Request-Id': requestId,
        'X-CATCH-Timeout-Ms': String(astrometryTimeoutMs),
      },
    });
  }

  private fetchText(path: string): Observable<string> {
    return this.httpClient.get(this.getCatUrl(path), { responseType: 'text' });
  }

  private getCatUrl(path: string): string {
    const normalizedPath = path.replace(/^\/+/, '');
    return `${catProxyBaseUrl}/${normalizedPath}`;
  }
}

function createRequestId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
