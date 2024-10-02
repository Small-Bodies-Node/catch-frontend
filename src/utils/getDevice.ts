import { IScreenDevice } from '../models/IScreenDevice';

const mobileTabletDivisor = 600;
const tabletDesktopDivisor = 900;

export const getDevice = (): IScreenDevice['device'] => {
  // --->
  try {
    if (window.innerWidth < mobileTabletDivisor) return 'mobile';
    if (window.innerWidth < tabletDesktopDivisor) return 'tablet';
  } catch (e) {}
  return 'desktop';
};
