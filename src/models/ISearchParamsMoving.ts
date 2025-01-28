import { ISearchParamsShared } from './ISearchParamsShared';

export interface ISearchParamsMoving extends ISearchParamsShared {
  target: string;
  cached?: boolean;
  padding?: number;
  uncertainty_ellipse?: boolean;
}
