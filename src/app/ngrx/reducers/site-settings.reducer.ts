import { ISiteSettings } from '../../../models/ISiteSettings';
import { createReducer, on } from '@ngrx/store';
import {
  SiteSettingsAction_SetAll,
  SiteSettingsAction_SetIsHappyWithCookies,
  SiteSettingsAction_SetThemePreference,
} from '../actions/site-settings.actions';

export interface ISiteSettingsSubstate extends ISiteSettings {}

export const initialState: ISiteSettingsSubstate = {
  themePreference: 'system',
  isPageAnimated: true,
  isHappyWithCookies: false,
};

export const siteSettingsReducer = createReducer(
  initialState,
  on(SiteSettingsAction_SetAll, (state, { siteSettings }) => ({
    ...siteSettings,
  })),
  on(SiteSettingsAction_SetIsHappyWithCookies, (state, { isHappyWithCookies }) => ({
    ...state,
    isHappyWithCookies,
  })),
  on(SiteSettingsAction_SetThemePreference, (state, { themePreference }) => ({
    ...state,
    themePreference,
  })),
);
