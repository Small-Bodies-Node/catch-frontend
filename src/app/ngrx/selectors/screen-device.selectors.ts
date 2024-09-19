import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { IScreenDeviceSubstate } from '../reducers/screen-device.reducer';

/**
 *
 * Elemental Screen-Device Selectors
 *
 */

export const selectScreenDeviceSubstate = createSelector(
  (state: IAppState) => state.screenDevice,
  (substate: IScreenDeviceSubstate) => substate
);

export const selectScreenDeviceEffectiveDevice = createSelector(
  (state: IAppState) => state.screenDevice,
  (substate: IScreenDeviceSubstate) => {
    if (substate.layout === 'auto') return substate.device;
    return substate.layout;
  }
);
