import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPanstarrsApiResponse } from '../../../../models/IPanstarrsApiResponse';

@Injectable({ providedIn: 'root' })
export class PanstarrsApiService {
  // --->>>

  constructor(private httpClient: HttpClient) {}

  getPanstarrsData(
    ra: number | string, // Check: works only if panstarrs api receives XX:YY...
    dec: number | string,
    nDetectionsMin = 10,
    raDecMaxErr = 0.007
  ): Observable<IPanstarrsApiResponse> {
    //

    let url = `/api/panstarrs?ra=${ra}&dec=${dec}&nDetectionsMin=${nDetectionsMin}&radius=0.083&raDecMaxErr=${raDecMaxErr}`;

    return this.httpClient.get<IPanstarrsApiResponse>(url, {
      //
    });
  }
}
