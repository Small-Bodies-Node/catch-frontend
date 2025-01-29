import { IApiFixum } from './IApiFixum';

export type TColStateFixed = {
  [Key in keyof IApiFixum]: boolean;
};
