import { ISiteSettings } from 'src/app/models/ISiteSettings';
import {
  SiteSettingsActions,
  ESiteSettingsActionTypes,
} from '../actions/site-settings.actions';

export interface ISiteSettingsSubstate extends ISiteSettings {}

export const initialState: ISiteSettingsSubstate = {
  siteTheme: 'DARK-THEME',
  hour: new Date().getHours(),
  isPageAnimated: true,
  isAutoNightMode: false,
  isHappyWithCookies: false,
};

export function SiteSettingsReducer(
  state = initialState,
  action: SiteSettingsActions
): ISiteSettingsSubstate {
  switch (action.type) {
    case ESiteSettingsActionTypes.SiteSettingsSetAll:
      return {
        ...action.payload.siteSettings,
      };

    case ESiteSettingsActionTypes.SiteSettingsSetHour:
      return {
        ...state,
        hour: action.payload.hour,
      };

    case ESiteSettingsActionTypes.SiteSettingsSetIsAutoNightMode:
      return {
        ...state,
        isAutoNightMode: action.payload.isAutoNightMode,
      };

    case ESiteSettingsActionTypes.SiteSettingsSetIsHappyWithCookies:
      return {
        ...state,
        isHappyWithCookies: action.payload.isHappyWithCookies,
      };

    case ESiteSettingsActionTypes.SiteSettingsSetSiteTheme:
      return {
        ...state,
        siteTheme: action.payload.theme,
      };

    default:
      return state;
  }
}
