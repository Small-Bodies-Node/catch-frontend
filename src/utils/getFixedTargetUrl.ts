import { TControlKeyForSources } from '../models/TControlKeyForSources';
import {
  intersectionTypeDict,
  TIntersectionType,
} from '../models/TIntersectionType';
import { apiBaseUrl } from './constants';

export function getFixedTargetUrl(
  ra: string,
  dec: string,
  sources: TControlKeyForSources[],
  intersectionType: TIntersectionType,
  radius?: number,
  startTime?: string,
  stopTime?: string
): string {
  const sourceStr = sources.reduce((acc, source) => {
    acc += '&sources=' + source;
    return acc;
  }, '');

  const raStr = `ra=${ra}`;
  const decStr = `&dec=${dec}`;
  const radiusStr = radius ? `&radius=${radius}` : '';
  const startDateStr = startTime ? `&start_date=${startTime}` : '';
  const stopDateStr = stopTime ? `&stop_date=${stopTime}` : '';
  const intersectionTypeStr = `&intersection_type=${intersectionTypeDict[intersectionType]}`;

  let catchFixedUrl =
    apiBaseUrl +
    `/fixed?${raStr}${decStr}${radiusStr}${startDateStr}${stopDateStr}${intersectionTypeStr}` +
    sourceStr;

  return catchFixedUrl;
}
