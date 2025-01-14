import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IApiDataService } from '../../../../models/IApiDataService';
import { IAppState } from '../../../ngrx/reducers';
import { TSources } from '../../../../models/TSources';
import { TApiDataResult } from '../../../../models/TApiResult';
import { TJobStreamResult } from '../../../../models/TJobStreamResult';
import { IApiServiceStream } from '../../../../models/IApiServiceStream';
import { ApiDataAction_SetStatus } from '../../../ngrx/actions/api-data.actions';
import { IApiDataCatchResult } from '../../../../models/IApiDataCatchResult';
import { IApiDataCaughtResult } from '../../../../models/IApiDataCaughtResult';
import { apiBaseUrl, apiStreamTimeoutSecs } from '../../../../utils/constants';
import { IPanstarrsApiResponse } from '../../../../models/IPanstarrsApiResponse';

@Injectable({ providedIn: 'root' })
export class PanstarrsApiService {
  // --->>>

  constructor(
    private httpClient: HttpClient,
    private store$: Store<IAppState>
  ) {}

  getPanstarrsData(
    ra: number,
    dec: number,
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
