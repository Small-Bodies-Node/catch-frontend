import { IApiFixum } from './IApiFixum';
import { IApiMovum } from './IApiMovum';

export type TApiDataColState = {
  // [Key in keyof IApiMovum]: boolean;
  [Key in keyof (IApiMovum & IApiFixum)]: boolean;
};
