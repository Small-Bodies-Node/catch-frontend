import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Observable,
  of,
  delay,
  switchMap,
  map,
  catchError,
  from,
  concatAll,
  concatMap,
  Subscription,
  delayWhen,
} from 'rxjs';

import { IApiDataService } from '../../../../models/IApiDataService';
import { IApiServiceStream } from '../../../../models/IApiServiceStream';
import { TJobStreamResult } from '../../../../models/TJobStreamResult';
import { TControlKeyForSources } from '../../../../models/TControlKeyForSources';
import { IAppState } from '../../../ngrx/reducers';
import { TApiDataResultOrError } from '../../../../models/TApiDataResultOrError';
import { IApiDataCatchResult } from '../../../../models/IApiDataCatchResult';
import { IApiDataResult } from '../../../../models/IApiDataResult';
import { mockStreamMessages } from '../../../../utils/mockStreamMessages';
import { ApiDataAction_SetStatus } from '../../../ngrx/actions/api-data.actions';
import { apiMockResultMoving } from '../../../../utils/apiMockResultMoving';
import { IApiFixedService } from '../../../../models/IApiFixedService';
import { TIntersectionType } from '../../../../models/TIntersectionType';
import { TApiFixedResult } from '../../../../models/TApiFixedResult';

const mockTime1 = 0;
const mockTime2 = 0;

const numResults = 100;

@Injectable({
  providedIn: 'root',
})
export class ApiFixedMockService implements IApiFixedService {
  // --->>>

  constructor(private store$: Store<IAppState>) {}

  fetchApiFixed(
    ra: string,
    dec: string,
    sources: TControlKeyForSources[],
    intersectionType: TIntersectionType,
    radius?: number,
    startDate?: string,
    stopDate?: string
  ): Observable<TApiFixedResult> {
    return of({
      status: 'success',
      apiFixedResult: apiMockResultMoving,
    } as any).pipe(delay(1000));
  }
}
