import { IApiFixum } from '../models/IApiFixum';
import { IApiMovum } from '../models/IApiMovum';
import { TColStateData } from '../models/TColStateData';
import { initColStateFixed } from './initColStateFixed';
import { initColStateMoving } from './initColStateMoving';

/**
 * Provides typed array of names of columns ordered the same as apiDataInitColState
 */
export const getOrderedColNames = (isMoving: boolean) => {
  // --->>

  return Object.keys(
    isMoving ? initColStateMoving : initColStateFixed
  ) as (keyof TColStateData)[];
};
