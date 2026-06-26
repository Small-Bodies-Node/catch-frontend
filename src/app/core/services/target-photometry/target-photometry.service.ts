import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ITargetPhotometryRequest,
  ITargetPhotometryResponse,
} from '../../../../models/ITargetPhotometry';

const catProxyBaseUrl = '/api/cat';
const targetPhotometryTimeoutMs = 120_000;

@Injectable({ providedIn: 'root' })
export class TargetPhotometryService {
  private readonly apiBaseUrl = catProxyBaseUrl;

  constructor(private httpClient: HttpClient) {}

  runTargetPhotometry(params: ITargetPhotometryRequest): Observable<ITargetPhotometryResponse> {
    return this.httpClient.post<ITargetPhotometryResponse>(
      `${this.apiBaseUrl}/target_photometry`,
      params,
      {
        headers: {
          'X-CATCH-Timeout-Ms': String(targetPhotometryTimeoutMs),
        },
      },
    );
  }
}
