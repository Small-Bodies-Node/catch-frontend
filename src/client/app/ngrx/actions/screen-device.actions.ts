import { Action } from '@ngrx/store';
import { IScreenDeviceSubstate } from '../reducers/screen-device-reducer/screen-device.reducer';

export enum EScreenDeviceActionTypes {
  ScreenDeviceSetDevice = '[ScreenDevice] Set Device',
  ScreenDeviceSetLayout = '[ScreenDevice] Set Layout',
  ScreenDeviceSetScreenWidth = '[ScreenDevice] Set Screen Width',
  ScreenDeviceSetScreenHeight = '[ScreenDevice] Set Screen Height'
}

export class ScreenDeviceSetDevice implements Action {
  readonly type = EScreenDeviceActionTypes.ScreenDeviceSetDevice;
  constructor(public payload: { device: IScreenDeviceSubstate['device'] }) {}
}

export class ScreenDeviceSetLayout implements Action {
  readonly type = EScreenDeviceActionTypes.ScreenDeviceSetLayout;
  constructor(public payload: { layout: IScreenDeviceSubstate['layout'] }) {}
}

export class ScreenDeviceSetScreenWidth implements Action {
  readonly type = EScreenDeviceActionTypes.ScreenDeviceSetScreenWidth;
  constructor(public payload: { width: number }) {}
}
export class ScreenDeviceSetScreenHeight implements Action {
  readonly type = EScreenDeviceActionTypes.ScreenDeviceSetScreenHeight;
  constructor(public payload: { height: number }) {}
}

export type ScreenDeviceActions =
  | ScreenDeviceSetDevice
  | ScreenDeviceSetScreenWidth
  | ScreenDeviceSetScreenHeight
  | ScreenDeviceSetLayout;
