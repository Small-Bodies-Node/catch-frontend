import { ISearchParamsMoving } from '../models/ISearchParamsMoving';
import { apiBaseUrl } from './constants';

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
  const params = new URLSearchParams();

  params.set('target', target);
  params.set('cached', cached ? 'true' : 'false');
  params.set('padding', String(padding ?? 0));

  if (uncertainty_ellipse) {
    params.set('uncertainty_ellipse', 'true');
  }
  if (start_date) {
    params.set('start_date', start_date);
  }
  if (stop_date) {
    params.set('stop_date', stop_date);
  }
  sources?.forEach((source) => params.append('sources', source));

  return `${apiBaseUrl}/catch?${params.toString()}`;
}
