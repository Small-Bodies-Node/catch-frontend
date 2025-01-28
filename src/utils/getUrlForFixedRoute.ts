import { ISearchParamsFixed } from '../models/ISearchParamsFixed';
import { intersectionTypeDict } from '../models/TIntersectionType';
import { apiBaseUrl } from './constants';
import { sourcesToUrlString } from './sourcesToUrlString';

export function getUrlForFixedRoute(input: ISearchParamsFixed): string {
  //

  const { ra, dec, intersection_type, sources, radius, start_date, stop_date } =
    input;

  // Required
  const raStr = `ra=${ra}`;
  const decStr = `&dec=${dec}`;

  // Optional
  const radiusStr = radius ? `&radius=${radius}` : '';
  const startDateStr = start_date ? `&start_date=${start_date}` : '';
  const stopDateStr = stop_date ? `&stop_date=${stop_date}` : '';
  const intersectionTypeStr = intersection_type
    ? `&intersection_type=${intersectionTypeDict[intersection_type]}`
    : '';
  const sourcesStr = sourcesToUrlString(sources);

  const fixedTargetUrl =
    apiBaseUrl +
    `/fixed?` +
    raStr +
    decStr +
    radiusStr +
    intersectionTypeStr +
    startDateStr +
    stopDateStr +
    sourcesStr;

  return fixedTargetUrl;
}
