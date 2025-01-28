import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { TControlKeyForSources } from '../../../../models/TControlKeyForSources';
import { apiBaseUrl } from '../../../../utils/constants';
import { IApiFixedService } from '../../../../models/IApiFixedService';
import {
  intersectionTypeDict,
  TIntersectionType,
} from '../../../../models/TIntersectionType';
import { IApiFixedResult } from '../../../../models/IApiFixedResult';
import { TApiFixedResult } from '../../../../models/TApiFixedResult';
import { getUrlForFixedRoute } from '../../../../utils/getUrlForFixedRoute';

@Injectable({ providedIn: 'root' })
export class ApiFixedService implements IApiFixedService {
  // --->>>

  constructor(private httpClient: HttpClient) {}

  fetchApiFixed(
    ra: string,
    dec: string,
    sources: TControlKeyForSources[],
    intersectionType: TIntersectionType,
    radius?: number,
    startDate?: string,
    stopDate?: string
  ): Observable<TApiFixedResult> {
    const catchFixedUrl = getUrlForFixedRoute(
      ra,
      dec,
      sources,
      intersectionType,
      radius,
      startDate,
      stopDate
    );

    console.log('catchUrl >>> ', catchFixedUrl);

    return this.httpClient
      .get<IApiFixedResult>(catchFixedUrl, {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        }),
      })
      .pipe(
        map((_) => {
          // console.log(_);
          return {
            status: 'success',
            apiFixedResult: _,
          } as any;
        }),
        catchError((error) => {
          return of({
            status: 'error',
            message: JSON.stringify(error.message),
          } as any);
        })
      );
  }
}
