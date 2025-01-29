import { TApiStatusCode } from './TApiStatusCode';
import { TApiDataSearch } from './TApiDataSearch';

export interface IApiDataStatus {
  search: TApiDataSearch;
  message: string;
  code: TApiStatusCode;
}

export type TApiDataStatus =
  | {
      code: 'unset';
      message: 'Ready to fetch data';
      search: undefined;
    }
  | IApiDataStatus;
