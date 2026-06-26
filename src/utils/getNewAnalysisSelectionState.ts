import { IApiFixum } from '../models/IApiFixum';
import { IApiMovum } from '../models/IApiMovum';

/**
 * Maps apiData to analysis-selection state keyed by product_id.
 */
export function getNewAnalysisSelectionState(apiData: (IApiMovum | IApiFixum)[]) {
  return apiData.reduce(
    (acc, apiDatum: IApiMovum | IApiFixum) => {
      acc[apiDatum.product_id] = false;
      return acc;
    },
    {} as { [key: string]: boolean },
  );
}
