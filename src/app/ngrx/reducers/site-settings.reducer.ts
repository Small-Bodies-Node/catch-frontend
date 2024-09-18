import { ISiteSettings } from '../../models/ISiteSettings';
import { createReducer, on } from '@ngrx/store';
import {
  SiteSettingsAction_SetAll,
  SiteSettingsAction_SetHour,
  SiteSettingsAction_SetIsAutoNightMode,
  SiteSettingsAction_SetIsHappyWithCookies,
  SiteSettingsAction_SetSiteTheme,
} from '../actions/site-settings.actions';

export interface ISiteSettingsSubstate extends ISiteSettings {}

export const initialState: ISiteSettingsSubstate = {
  siteTheme: 'DARK-THEME',
  hour: new Date().getHours(),
  isPageAnimated: true,
  isAutoNightMode: false,
  isHappyWithCookies: false,
};

export const siteSettingsReducer = createReducer(
  initialState,
  on(SiteSettingsAction_SetAll, (state, { siteSettings }) => ({
    ...siteSettings,
  })),
  on(SiteSettingsAction_SetHour, (state, { hour }) => ({
    ...state,
    hour,
  })),
  on(SiteSettingsAction_SetIsAutoNightMode, (state, { isAutoNightMode }) => ({
    ...state,
    isAutoNightMode,
  })),
  on(
    SiteSettingsAction_SetIsHappyWithCookies,
    (state, { isHappyWithCookies }) => ({
      ...state,
      isHappyWithCookies,
    })
  ),
  on(SiteSettingsAction_SetSiteTheme, (state, { theme }) => ({
    ...state,
    siteTheme: theme,
  }))
);
