export interface ISiteSettings {
  themePreference: TThemePreference;
  isHappyWithCookies: boolean;
  isPageAnimated: boolean;
}

// TS apparatus to convert an array of strings to a union of string types
// See: https://stackoverflow.com/a/52085658/8620332
function stringLiteralArray<T extends string>(s: T[]) {
  return s;
}

export const themePreferences = stringLiteralArray(['system', 'light', 'dark']);
export type TThemePreference = (typeof themePreferences)[number];
export type TEffectiveTheme = Exclude<TThemePreference, 'system'>;
