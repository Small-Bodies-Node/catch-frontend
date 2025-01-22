import { IApiFixum } from './IApiFixum';
import { IApiFixedLabel } from './IApiFixedLabel';

export type TApiFixedLabels = {
  [Key in keyof IApiFixum]: IApiFixedLabel;
};
