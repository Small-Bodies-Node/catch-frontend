import { TApiStatusCode } from './TApiStatusCode';
import { TApiDataSearch } from './TApiDataSearch';

export interface IApiDataSetStatus {
  search: TApiDataSearch;
  message: string;
  code: TApiStatusCode;
}

export type TApiDataSetStatus =
  | {
      code: 'unset';
      message: 'Ready to fetch data';
      search: undefined;
    }
  | IApiDataSetStatus;
