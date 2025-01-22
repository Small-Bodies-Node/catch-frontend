import { IApiFixum } from './IApiFixum';

export type TApiFixedColState = {
  [Key in keyof IApiFixum]: boolean;
};
