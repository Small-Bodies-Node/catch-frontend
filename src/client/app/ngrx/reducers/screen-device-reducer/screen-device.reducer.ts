import { ScreenDeviceActions, EScreenDeviceActionTypes } from '../../actions/screen-device.actions';
import { IScreenDevice } from 'src/client/app/models/screen-device.model';
import { getDevice } from '@client/app/utils/get-device';

export interface IScreenDeviceSubstate extends IScreenDevice {}

export const initialState: IScreenDeviceSubstate = {
  device: getDevice(),
  layout: 'auto',
  screenWidthPxls: window.innerWidth,
  screenHeightPxls: window.innerHeight
};

export function ScreenDeviceReducer(
  state = initialState,
  action: ScreenDeviceActions
): IScreenDeviceSubstate {
  switch (action.type) {
    case EScreenDeviceActionTypes.ScreenDeviceSetDevice:
      return {
        ...state,
        device: action.payload.device
      };

    case EScreenDeviceActionTypes.ScreenDeviceSetLayout:
      return {
        ...state,
        layout: action.payload.layout
      };

    case EScreenDeviceActionTypes.ScreenDeviceSetScreenWidth:
      return {
        ...state,
        screenWidthPxls: action.payload.width
      };

    case EScreenDeviceActionTypes.ScreenDeviceSetScreenHeight:
      return {
        ...state,
        screenHeightPxls: action.payload.height
      };

    default:
      return state;
  }
}
