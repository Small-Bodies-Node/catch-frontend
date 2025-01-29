import { IApiMovum } from './IApiMovum';
import { IApiDataLabel } from './IApiDataLabel';
import { IApiFixum } from './IApiFixum';

export type TApiDataLabels = {
  [Key in keyof (IApiMovum & IApiFixum)]: IApiDataLabel;
};
