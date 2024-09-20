import { createReducer, on } from '@ngrx/store';
import {
  ScreenDeviceAction_SetDevice,
  ScreenDeviceAction_SetLayout,
  ScreenDeviceAction_SetScreenWidth,
  ScreenDeviceAction_SetScreenHeight,
} from '../actions/screen-device.actions';
import { IScreenDevice } from '../../../models/IScreenDevice';
import { getDevice } from '../../../utils/getDevice';

export interface IScreenDeviceSubstate extends IScreenDevice {}

export const initialState: IScreenDeviceSubstate = {
  device: getDevice(),
  layout: 'auto',
  screenWidthPxls: window.innerWidth,
  screenHeightPxls: window.innerHeight,
};

export const screenDeviceReducer = createReducer(
  initialState,
  on(ScreenDeviceAction_SetDevice, (state, { device }) => ({
    ...state,
    device,
  })),
  on(ScreenDeviceAction_SetLayout, (state, { layout }) => ({
    ...state,
    layout,
  })),
  on(ScreenDeviceAction_SetScreenWidth, (state, { width }) => ({
    ...state,
    screenWidthPxls: width,
  })),
  on(ScreenDeviceAction_SetScreenHeight, (state, { height }) => ({
    ...state,
    screenHeightPxls: height,
  }))
);
