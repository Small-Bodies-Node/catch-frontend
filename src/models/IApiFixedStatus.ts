import { TApiStatusCode } from './TApiStatusCode';
import { TControlKeyForSources } from './TControlKeyForSources';
import { TIntersectionType } from './TIntersectionType';

export interface IApiFixedStatus {
  // Query params
  query?: {
    ra: string;
    dec: string;
    sources: TControlKeyForSources[];
    intersectionType: TIntersectionType;
    radius?: number;
    startTime?: string;
    stopTime?: string;
  };
  //
  message: string;
  code: TApiStatusCode;
}
