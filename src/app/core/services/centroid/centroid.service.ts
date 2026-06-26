import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICentroidRequest, ICentroidResponse } from '../../../../models/ICentroid';

const catProxyBaseUrl = '/api/cat';
const centroidTimeoutMs = 30_000;

@Injectable({ providedIn: 'root' })
export class CentroidService {
  private readonly apiBaseUrl = catProxyBaseUrl;

  constructor(private httpClient: HttpClient) {}

  runCentroid(params: ICentroidRequest): Observable<ICentroidResponse> {
    const httpParams = new HttpParams()
      .set('file', params.file)
      .set('target_x', String(params.target_x))
      .set('target_y', String(params.target_y))
      .set('search_radius', String(params.search_radius));

    return this.httpClient
      .post<unknown>(
        `${this.apiBaseUrl}/centroid`,
        {},
        {
          headers: {
            'X-CATCH-Timeout-Ms': String(centroidTimeoutMs),
          },
          params: httpParams,
        },
      )
      .pipe(map(normalizeCentroidResponse));
  }
}

function normalizeCentroidResponse(response: unknown): ICentroidResponse {
  if (Array.isArray(response)) {
    return normalizeCentroidResponse(response[0]);
  }

  if (isCentroidResponse(response)) {
    return response;
  }

  throw new Error('Centroid service returned an unexpected response shape.');
}

function isCentroidResponse(response: unknown): response is ICentroidResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof (response as ICentroidResponse).search_results === 'object'
  );
}
