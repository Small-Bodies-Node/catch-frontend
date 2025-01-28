import { IApiFixum } from '../models/IApiFixum';
import { IApiMovum } from '../models/IApiMovum';

/**
 * Maps apiData to an object with product_id of each apiDatum as keys and false values
 */
export function getNewDownloadState(apiData: (IApiMovum | IApiFixum)[]) {
  return apiData.reduce((acc, el: IApiMovum | IApiFixum) => {
    acc[el.product_id] = false;
    return acc;
  }, {} as { [key: string]: boolean });
}
