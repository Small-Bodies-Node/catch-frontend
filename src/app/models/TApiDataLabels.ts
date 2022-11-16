import { IApiDatum } from './IApiDatum';
import { IApiDataLabel } from './IApiDataLabel';

export type TApiDataLabels = {
  [Key in keyof IApiDatum]: IApiDataLabel;
};
