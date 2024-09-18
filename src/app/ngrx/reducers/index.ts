import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';

import { INavigationSubstate, navigationReducer } from './navigation.reducer';
import {
  IScreenDeviceSubstate,
  screenDeviceReducer,
} from './screen-device.reducer';
import {
  ISiteSettingsSubstate,
  siteSettingsReducer,
} from './site-settings.reducer';
import { IApiDataSubstate, apiDataReducer } from './api-data.reducer';
import {
  ITableCheckboxSubstate,
  tableCheckboxReducer,
} from './table-checkbox.reducer';
import {
  IObjectNameMatchSubstate,
  objectNameMatchReducer,
} from './object-name-match.reducer';

export interface IAppState {
  apiDataReducer: IApiDataSubstate;
  navigationReducer: INavigationSubstate;
  objectNameMatchReducer: IObjectNameMatchSubstate;
  screenDeviceReducer: IScreenDeviceSubstate;
  siteSettingsReducer: ISiteSettingsSubstate;
  tableCheckboxReducer: ITableCheckboxSubstate;
  // ---
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<IAppState, any> = {
  apiDataReducer,
  navigationReducer,
  objectNameMatchReducer,
  screenDeviceReducer,
  siteSettingsReducer,
  tableCheckboxReducer,
  // ---
  router: routerReducer,
};

export const metaReducers: MetaReducer<IAppState>[] = [];
