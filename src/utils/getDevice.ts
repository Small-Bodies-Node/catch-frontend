import { IScreenDevice } from '../app/models/IScreenDevice';

const mobileTabletDivisor = 600;
const tabletDesktopDivisor = 900;

export const getDevice = (): IScreenDevice['device'] => {
  // --->
  if (window.innerWidth < mobileTabletDivisor) return 'mobile';
  if (window.innerWidth < tabletDesktopDivisor) return 'tablet';
  return 'desktop';
};
