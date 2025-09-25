import { IApiFixum } from './IApiFixum';
import { IApiMovum } from './IApiMovum';
import { ISearchParamsFixed } from './ISearchParamsFixed';
import { ISearchParamsMoving } from './ISearchParamsMoving';
import { TControlKeyForSources } from './TControlKeyForSources';

export interface IApiMovingResult {
  count: number;
  job_id: string;
  data: IApiMovum[];
  parameters: ISearchParamsMoving;
  version: string;
  status: {
    count: number;
    date: string;
    execution_time: null;
    source: TControlKeyForSources;
    source_name: string;
    status: string | 'finished';
  }[];
}

export interface IApiFixedResult {
  count: number;
  query: ISearchParamsFixed;
  message: string;
  data: IApiFixum[];
  version: string;
}

export type TApiDataResult = IApiMovingResult | IApiFixedResult;
