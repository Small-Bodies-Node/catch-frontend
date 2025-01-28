import { ISearchParamsFixed } from './ISearchParamsFixed';
import { ISearchParamsMoving } from './ISearchParamsMoving';

export interface IApiMovingSearch {
  searchType: 'moving';
  searchParams: ISearchParamsMoving;
}

export interface IApiFixedSearch {
  searchType: 'fixed';
  searchParams: ISearchParamsFixed;
}

export type TApiDataSearch = IApiMovingSearch | IApiFixedSearch;
