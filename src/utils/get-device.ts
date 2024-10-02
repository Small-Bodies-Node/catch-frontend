import { IScreenDevice } from '../models/IScreenDevice';
import { winWidth } from './animation-constants';

const mobileTabletDivisor = 600;
const tabletDesktopDivisor = 900;

export const getDevice = (): IScreenDevice['device'] => {
  // --->
  if (winWidth < mobileTabletDivisor) return 'mobile';
  if (winWidth < tabletDesktopDivisor) return 'tablet';
  return 'desktop';
};
