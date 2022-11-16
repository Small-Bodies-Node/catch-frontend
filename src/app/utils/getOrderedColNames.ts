import { IApiDatum } from '../models/IApiDatum';
import { apiDataInitColState } from './apiDataInitColState';

/**
 * Provides typed array of names of columns ordered the same as apiDataInitColState
 */
export const getOrderedColNames = (): (keyof IApiDatum)[] => {
  // --->>

  return Object.keys(apiDataInitColState) as any as (keyof IApiDatum)[];
};
