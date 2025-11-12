import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPanstarrsApiResponse } from '../../../../models/IPanstarrsApiResponse';
import { convertToDecimal } from '../../../../utils/convertToDecimal';

@Injectable({ providedIn: 'root' })
export class PanstarrsApiService {
  // --->>>

  constructor(private httpClient: HttpClient) {}

  getPanstarrsData(
    ra0: number | string, // Check: works only if panstarrs api receives XX:YY...
    dec0: number | string,
    nDetectionsMin = 10,
    raDecMaxErr = 0.007
  ): Observable<IPanstarrsApiResponse> {
    const ra = typeof ra0 === 'string' ? convertToDecimal(ra0) : ra0;
    const dec = typeof dec0 === 'string' ? convertToDecimal(dec0) : dec0;

    // We proxy/cache through the ng server to reach the panstarrs server
    const url = `/api/panstarrs?ra=${ra}&dec=${dec}&nDetectionsMin=${nDetectionsMin}&radius=0.083&raDecMaxErr=${raDecMaxErr}`;

    console.log('PanstarrsApiService url:', url);

    return this.httpClient.get<IPanstarrsApiResponse>(url, {});
  }
}
