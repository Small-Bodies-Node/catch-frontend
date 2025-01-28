import { TApiDataSearch } from '../models/TDataSearch';
import { getUrlForCatchRoute } from './getUrlForCatchRoute';
import { getUrlForFixedRoute } from './getUrlForFixedRoute';

export function getUrlForCatchOrFixedRoute(input: TApiDataSearch): string {
  const { searchParams, searchType } = input;
  return searchType === 'moving'
    ? getUrlForCatchRoute(searchParams)
    : getUrlForFixedRoute(searchParams);
}
