import { IApiDataCatchResult } from './IApiDataCatchResult';

export type TApiDataCatchResultOrError =
  | {
      status: 'success';
      apiDataCatchResult: IApiDataCatchResult;
    }
  | {
      status: 'error';
      message: string;
    };
