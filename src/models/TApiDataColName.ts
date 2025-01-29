import { IApiFixum } from './IApiFixum';
import { IApiMovum } from './IApiMovum';

export type TApiDataColName = keyof IApiMovum | keyof IApiFixum;
