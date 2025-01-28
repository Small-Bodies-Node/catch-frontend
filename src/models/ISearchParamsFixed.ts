import { ISearchParamsShared } from './ISearchParamsShared';
import { TIntersectionType } from './TIntersectionType';

export interface ISearchParamsFixed extends ISearchParamsShared {
  ra: string | number;
  dec: string | number;
  intersection_type?: TIntersectionType;
  radius?: number;
}
