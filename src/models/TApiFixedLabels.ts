import { IApiDataLabel } from './IApiDataLabel';
import { IApiFixum } from './IApiFixum';

export type TApiFixedLabels = {
  [Key in keyof IApiFixum]: IApiDataLabel;
};
