import { createAction, props } from '@ngrx/store';
import { TPermittedTheme } from '../../models/ISiteSettings';
import { ISiteSettingsSubstate } from '../reducers/site-settings.reducer';

export const SiteSettingsAction_SetAll = createAction(
  'Site Settings Action: Set All',
  props<{ siteSettings: ISiteSettingsSubstate }>()
);

export const SiteSettingsAction_SetHour = createAction(
  'Site Settings Action: Set Hour',
  props<{ hour: number }>()
);

export const SiteSettingsAction_SetSiteTheme = createAction(
  'Site Settings Action: Set SiteTheme',
  props<{ theme: TPermittedTheme }>()
);

export const SiteSettingsAction_SetIsPageAnimated = createAction(
  'Site Settings Action: Set IsPageAnimated',
  props<{ isPageAnimated: boolean }>()
);

export const SiteSettingsAction_SetIsAutoNightMode = createAction(
  'Site Settings Action: Set IsAutoNightMode',
  props<{ isAutoNightMode: boolean }>()
);

export const SiteSettingsAction_SetIsHappyWithCookies = createAction(
  'Site Settings Action: Set IsHappyWithCookies',
  props<{ isHappyWithCookies: boolean }>()
);

export const SiteSettingsAction_LoadAllFromLocalStorage = createAction(
  'Site Settings Action: Load All From LocalStorage'
);
