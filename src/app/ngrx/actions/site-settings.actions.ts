import { createAction, props } from '@ngrx/store';
import { TThemePreference } from '../../../models/ISiteSettings';
import { ISiteSettingsSubstate } from '../reducers/site-settings.reducer';

export const SiteSettingsAction_SetAll = createAction(
  'Site Settings Action: Set All',
  props<{ siteSettings: ISiteSettingsSubstate }>(),
);

export const SiteSettingsAction_SetThemePreference = createAction(
  'Site Settings Action: Set ThemePreference',
  props<{ themePreference: TThemePreference }>(),
);

export const SiteSettingsAction_SetIsPageAnimated = createAction(
  'Site Settings Action: Set IsPageAnimated',
  props<{ isPageAnimated: boolean }>(),
);

export const SiteSettingsAction_SetIsHappyWithCookies = createAction(
  'Site Settings Action: Set IsHappyWithCookies',
  props<{ isHappyWithCookies: boolean }>(),
);

export const SiteSettingsAction_LoadAllFromLocalStorage = createAction(
  'Site Settings Action: Load All From LocalStorage',
);
