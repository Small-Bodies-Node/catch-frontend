import { IApiMovum } from '../models/IApiMovum';
import { apiDataInitColState } from './apiDataInitColState';

/**
 * Provides typed array of names of columns ordered the same as apiDataInitColState
 */
export const getOrderedColNames = (): (keyof IApiMovum)[] => {
  // --->>

  return Object.keys(apiDataInitColState) as any as (keyof IApiMovum)[];
};
