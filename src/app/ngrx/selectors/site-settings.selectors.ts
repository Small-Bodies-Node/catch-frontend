import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { ISiteSettingsSubstate } from '../reducers/site-settings.reducer';

/**
 *
 * Elemental SiteSettings Selectors
 *
 */

export const selectSiteSettingsThemePreference = createSelector(
  (state: IAppState) => state.siteSettingsSubstate,
  (substate: ISiteSettingsSubstate) => substate.themePreference,
);

export const selectSiteSettingsIsHappyWithCookies = createSelector(
  (state: IAppState) => state.siteSettingsSubstate,
  (siteSettings) => siteSettings.isHappyWithCookies,
);
