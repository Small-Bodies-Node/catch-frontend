import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';

import { environment } from '../../../environments/environment';
import { INavigationSubstate, NavigationReducer } from './navigation.reducer';
import {
  IScreenDeviceSubstate,
  ScreenDeviceReducer,
} from './screen-device.reducer';
import {
  ISiteSettingsSubstate,
  SiteSettingsReducer,
} from './site-settings.reducer';
import { apiDataReducer, IApiSubstate } from './api.reducer';
import {
  ITableCheckboxSubstate,
  tableCheckboxReducer,
} from './table-checkbox.reducer';
import {
  IObjectNameMatchSubstate,
  ObjectNameMatchReducer,
} from './object-name-match.reducer';

export interface IAppState {
  api: IApiSubstate;
  navigation: INavigationSubstate;
  objectNameMatch: IObjectNameMatchSubstate;
  screenDevice: IScreenDeviceSubstate;
  siteSettingsSubstate: ISiteSettingsSubstate;
  tableCheckbox: ITableCheckboxSubstate;
  // ---
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<IAppState, any> = {
  api: apiDataReducer,
  navigation: NavigationReducer,
  objectNameMatch: ObjectNameMatchReducer,
  screenDevice: ScreenDeviceReducer,
  siteSettingsSubstate: SiteSettingsReducer,
  tableCheckbox: tableCheckboxReducer,
  // ---
  router: routerReducer,
};

export const metaReducers: MetaReducer<IAppState>[] = !environment.production
  ? []
  : [];
