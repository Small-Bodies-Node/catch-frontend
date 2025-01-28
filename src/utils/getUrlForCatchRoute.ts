import { ISearchParamsMoving } from '../models/ISearchParamsMoving';
import { apiBaseUrl } from './constants';
import { sourcesToUrlString } from './sourcesToUrlString';

export function getUrlForCatchRoute(input: ISearchParamsMoving): string {
  const {
    target,
    cached,
    uncertainty_ellipse,
    padding,
    sources,
    start_date,
    stop_date,
  } = input;

  // Required
  const targetStr = `target=${target}`;

  // Optional
  const cachedStr = `&cached=${cached ? 'true' : 'false'}`;
  const startDateStr = start_date ? `&start_date=${start_date}` : '';
  const stopDateStr = stop_date ? `&stop_date=${stop_date}` : '';
  const sourcesStr = sourcesToUrlString(sources);
  const paddingStr = padding ? `&padding=${padding}` : '';
  const uncertaintyEllipseStr = uncertainty_ellipse
    ? `&uncertainty_ellipse=true`
    : '';

  const movingTargetUrl =
    apiBaseUrl +
    `/catch?` +
    targetStr +
    cachedStr +
    paddingStr +
    uncertaintyEllipseStr +
    startDateStr +
    stopDateStr +
    sourcesStr;

  return movingTargetUrl;
}
