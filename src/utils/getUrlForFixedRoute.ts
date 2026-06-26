import { ISearchParamsFixed } from '../models/ISearchParamsFixed';
import { intersectionTypeDict } from '../models/TIntersectionType';
import { apiBaseUrl } from './constants';

export function getUrlForFixedRoute(input: ISearchParamsFixed): string {
  const { ra, dec, intersection_type, sources, radius, start_date, stop_date } =
    input;
  const params = new URLSearchParams();

  params.set('ra', String(ra));
  params.set('dec', String(dec));

  if (radius !== null && radius !== undefined) {
    params.set('radius', String(radius));
  }
  if (intersection_type) {
    params.set('intersection_type', intersectionTypeDict[intersection_type]);
  }
  if (start_date) {
    params.set('start_date', start_date);
  }
  if (stop_date) {
    params.set('stop_date', stop_date);
  }
  sources?.forEach((source) => params.append('sources', source));

  return `${apiBaseUrl}/fixed?${params.toString()}`;
}
