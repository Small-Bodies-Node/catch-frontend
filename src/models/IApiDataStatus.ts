import { TApiStatusCode } from './TApiStatusCode';
import { TControlKeyForSources } from './TControlKeyForSources';

export interface IApiDataStatus {
  // Query params
  query?: {
    target: string;
    isCached: boolean;
    isUncertaintyEllipse: boolean;
    padding: number;
    sources: TControlKeyForSources[];
  };
  //
  message: string;
  code: TApiStatusCode;
}
