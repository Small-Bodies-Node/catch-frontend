import { of } from 'rxjs';
import { TApiDataCatchResultOrError } from '../models/TApiDataCatchResultOrError';
import { ISearchParamsMoving } from '../models/ISearchParamsMoving';
import { mockJobId } from './mockJobId';

export function getMockCatchResultOrError(
  searchParamsMoving: ISearchParamsMoving
) {
  const {
    target,
    cached,
    padding,
    sources,
    start_date,
    stop_date,
    uncertainty_ellipse,
  } = searchParamsMoving;
  return of<TApiDataCatchResultOrError>({
    status: 'success',
    apiDataCatchResult: {
      job_id: mockJobId,
      message: 'Job has been queued',
      queued: cached,
      query: {
        cached,
        padding,
        sources,
        target,
        uncertainty_ellipse,
        start_date,
        stop_date,
        type: 'COMET',
      },
      results:
        'http://catch-dev-api.astro.umd.edu/caught/df37287908274e878751088e5aa55822',
      version: '3.0rc2',
    },
  } as TApiDataCatchResultOrError);
}
