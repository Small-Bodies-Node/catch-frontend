import { TApiDataSearch } from '../models/TApiDataSearch';
import { getUrlForFixedRoute } from './getUrlForFixedRoute';

export function getUrlForCaughtOrFixedRoute(
  apiDataSearch: TApiDataSearch,
  job_id: string
): string {
  const { searchParams, searchType } = apiDataSearch;
  return searchType === 'moving'
    ? `http://catch-dev-api.astro.umd.edu/caught/${job_id}`
    : getUrlForFixedRoute(searchParams);
}
