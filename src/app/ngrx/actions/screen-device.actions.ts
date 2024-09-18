import { createAction, props } from '@ngrx/store';
import { IScreenDeviceSubstate } from '../reducers/screen-device.reducer';

export const ScreenDeviceAction_SetDevice = createAction(
  'Screen Device Action: Set Device',
  props<{ device: IScreenDeviceSubstate['device'] }>()
);

export const ScreenDeviceAction_SetLayout = createAction(
  'Screen Device Action: Set Layout',
  props<{ layout: IScreenDeviceSubstate['layout'] }>()
);

export const ScreenDeviceAction_SetScreenWidth = createAction(
  'Screen Device Action: Set Screen Width',
  props<{ width: number }>()
);

export const ScreenDeviceAction_SetScreenHeight = createAction(
  'Screen Device Action: Set Screen Height',
  props<{ height: number }>()
);
