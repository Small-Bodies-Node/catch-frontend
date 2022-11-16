import { IScreenDevice } from '../models/IScreenDevice';
import { isMobile } from './is-mobile';

const tabletDesktopDivisor = 900;

export const getDevice = (): IScreenDevice['device'] => {
  if (isMobile()) return 'mobile';
  return window.innerWidth < tabletDesktopDivisor ? 'tablet' : 'desktop';
};
