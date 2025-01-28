import { TApiDataSearch } from '../models/TDataSearch';

/**
 * Returns a string describing the subject of the search:
 * - for moving targets, the target name
 * - for fixed targets, the RA and Dec
 */
export function getSearchDescriptor(search: TApiDataSearch) {
  const subject =
    search.searchType === 'moving'
      ? search.searchParams.target
      : `${search.searchParams.ra} ${search.searchParams.dec}`;
  return subject;
}
