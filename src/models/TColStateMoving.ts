import { IApiMovum } from './IApiMovum';

export type TColStateMoving = {
  [Key in keyof IApiMovum]: boolean;
};
