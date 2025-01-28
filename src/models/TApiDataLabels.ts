import { IApiMovum } from './IApiMovum';
import { IApiDataLabel } from './IApiDataLabel';

export type TApiDataLabels = {
  [Key in keyof IApiMovum]: IApiDataLabel;
};
