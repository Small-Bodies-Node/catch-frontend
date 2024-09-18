import { TDevices } from './TDevices';

export interface IScreenDevice {
  device: TDevices;
  layout: 'auto' | TDevices;
  screenWidthPxls: number;
  screenHeightPxls: number;
}
