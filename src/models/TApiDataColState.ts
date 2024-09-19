import { IApiDatum } from './IApiDatum';

export type TApiDataColState = {
  [Key in keyof IApiDatum]: boolean;
};
