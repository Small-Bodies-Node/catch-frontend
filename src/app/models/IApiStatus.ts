import { TApiStatusCode } from './TApiStatusCode';
import { TSources } from './TSources';

export interface IApiStatus {
  // Query params
  query?: {
    target: string;
    isCached: boolean;
    isUncertaintyEllipse: boolean;
    padding: number;
    sources: TSources[];
  };
  //
  message: string;
  code: TApiStatusCode;
}
