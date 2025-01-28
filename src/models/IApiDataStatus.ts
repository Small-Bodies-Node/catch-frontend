import { TApiStatusCode } from './TApiStatusCode';
import { TApiDataSearch } from './TDataSearch';

export interface IApiDataFetchStatus {
  search: TApiDataSearch;
  message: string;
  code: TApiStatusCode;
}

export type TApiDataFetchStatus =
  | {
      code: 'unset';
      message: 'Ready to fetch data';
      search: undefined;
    }
  | IApiDataFetchStatus;
