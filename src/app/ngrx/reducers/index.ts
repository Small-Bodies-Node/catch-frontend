import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { routerReducer } from '@ngrx/router-store';

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
import { apiFixedReducer, IApiFixedSubstate } from './api-fixed.reducer';

export interface IAppState {
  apiData: IApiDataSubstate;
  apiFixed: IApiFixedSubstate;
  navigation: INavigationSubstate;
  objectNameMatch: IObjectNameMatchSubstate;
  screenDevice: IScreenDeviceSubstate;
  siteSettingsSubstate: ISiteSettingsSubstate;
  tableCheckbox: ITableCheckboxSubstate;
  // ---
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<IAppState, any> = {
  apiData: apiDataReducer,
  apiFixed: apiFixedReducer,
  navigation: navigationReducer,
  objectNameMatch: objectNameMatchReducer,
  screenDevice: screenDeviceReducer,
  siteSettingsSubstate: siteSettingsReducer,
  tableCheckbox: tableCheckboxReducer,
  // ---
  router: routerReducer,
};

export const metaReducers: MetaReducer<IAppState>[] = [];
