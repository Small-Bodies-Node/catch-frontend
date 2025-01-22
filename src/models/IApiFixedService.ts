import { Observable } from 'rxjs';

import { TControlKeyForSources } from './TControlKeyForSources';
import { TIntersectionType } from './TIntersectionType';
import { TApiFixedResult } from './TApiFixedResult';

/**
 * Interface to constrain service class that pings api
 */
export interface IApiFixedService {
  fetchApiFixed: (
    ra: string,
    dec: string,
    sources: TControlKeyForSources[],
    intersectionType: TIntersectionType,
    radius?: number,
    startDate?: string,
    stopDate?: string
  ) => Observable<TApiFixedResult>;
}
