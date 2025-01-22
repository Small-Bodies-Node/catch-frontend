import { IApiFixedResult } from './IApiFixedResult';

export type TApiFixedResult =
  | { status: 'error'; message: string }
  | { status: 'success'; apiFixedResult: IApiFixedResult };
