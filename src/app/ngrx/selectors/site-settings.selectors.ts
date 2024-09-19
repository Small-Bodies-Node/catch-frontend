import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { ISiteSettingsSubstate } from '../reducers/site-settings.reducer';

/**
 *
 * Elemental SiteSettings Selectors
 *
 */

export const selectSiteSettingsTheme = createSelector(
  (state: IAppState) => state.siteSettingsSubstate,
  (substate: ISiteSettingsSubstate) => substate.siteTheme
);

export const selectSiteSettingsIsAutoNightMode = createSelector(
  (state: IAppState) => state.siteSettingsSubstate,
  (siteSettings) => siteSettings.isAutoNightMode
);

export const selectSiteSettingsIsHappyWithCookies = createSelector(
  (state: IAppState) => state.siteSettingsSubstate,
  (siteSettings) => siteSettings.isHappyWithCookies
);

export const selectSiteSettingsHour = createSelector(
  (state: IAppState) => state.siteSettingsSubstate,
  (siteSettings) => siteSettings.hour
);

export const selectSiteSettingsIsNightHour = createSelector(
  selectSiteSettingsHour,
  (hour) => hour >= 19 || hour <= 7
);

/**
 *
 * Compound Selectors
 * (I.e. selectors using other selectors)
 *
 */

export const selectSiteSettingsEffectiveTheme = createSelector(
  selectSiteSettingsTheme,
  selectSiteSettingsIsAutoNightMode,
  selectSiteSettingsIsNightHour,
  (siteTheme, isAutoNightmode, isNightHour) => {
    if (!isAutoNightmode) return siteTheme;
    return isNightHour ? 'DARK-THEME' : 'LIGHT-THEME';
  }
);
