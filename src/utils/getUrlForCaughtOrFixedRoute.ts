import { TApiDataSearch } from '../models/TApiDataSearch';
import { apiBaseUrl } from './constants';
import { getUrlForFixedRoute } from './getUrlForFixedRoute';

export function getUrlForCaughtOrFixedRoute(
  apiDataSearch: TApiDataSearch,
  job_id: string
): string {
  const { searchParams, searchType } = apiDataSearch;
  return searchType === 'moving'
    ? apiBaseUrl + `/caught/${job_id}`
    : getUrlForFixedRoute(searchParams);
}
