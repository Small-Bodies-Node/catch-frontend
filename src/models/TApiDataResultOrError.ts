import { TApiDataResult } from './IApiDataResult';

export type TWrappedApiDataResultOrError =
  | {
      apiDataResult: TApiDataResult;
      status: 'success';
      message?: string;
      job_id: string;
    }
  | {
      status: 'error';
      message: string;
      job_id: string;
    };
