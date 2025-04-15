import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ILocalStorageState } from '../../../../models/ILocalStorageState';

type LSKey = keyof ILocalStorageState; // Define type for 'LocalStorageKeys'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // App-specific prefix for localStorage keys to avoid conflicts with other libraries
  private readonly APP_PREFIX = 'sbn_catch_';

  private defaultPermittedLocalStorageState: ILocalStorageState = {
    siteTheme: 'DARK-THEME',
    isPageAnimated: true,
    isAutoNightMode: false,
    isHappyWithCookies: false,
    hour: new Date().getHours(),
    testKey: 'foo',
  };

  constructor(private overlayContainer: OverlayContainer) {}

  getLocalStorageState(): ILocalStorageState {
    try {
      // Only get app-specific keys (those with our prefix)
      const appKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(this.APP_PREFIX))
        .map(key => key.substring(this.APP_PREFIX.length));

      // Build copy of localStorage as js object with only app-specific keys
      return appKeys.reduce(
        (accumState: any, key: string) => {
          accumState[key] = this.getItem(key as LSKey);
          return accumState;
        },
        {}
      );
    } catch (e) {
      return { ...this.defaultPermittedLocalStorageState };
    }
  }

  getItem(key: LSKey) {
    try {
      // Retrieve parsed individual item using prefixed key
      const prefixedKey = this.APP_PREFIX + key;
      const item = localStorage.getItem(prefixedKey);
      
      try {
        return !!item ? JSON.parse(item) : 'NO_ITEM_FOUND';
      } catch (e) {
        console.error(`Error parsing localStorage item '${key}':`, e);
        return 'NO_ITEM_FOUND';
      }
    } catch (e) {
      return this.defaultPermittedLocalStorageState[key];
    }
  }

  setItem(key: LSKey, value: any) {
    try {
      // Set individual key-value pair in localStorage with prefix
      const prefixedKey = this.APP_PREFIX + key;
      window.localStorage.setItem(prefixedKey, JSON.stringify(value));
      if (key === 'siteTheme') this.updateCdkOverlayClass(value);
    } catch (e) {
      console.error(`Error setting localStorage item '${key}':`, e);
    }
  }

  removeItem(key: string) {
    try {
      // Remove individual key-value pair from localStorage, with prefix
      const prefixedKey = this.APP_PREFIX + key;
      window.localStorage.removeItem(prefixedKey);
    } catch (e) {
      console.error(`Error removing localStorage item '${key}':`, e);
    }
  }

  /**
   * Ensure app-specific localStorage state has all required keys with valid values.
   * This doesn't remove any other keys that might be used by third-party libraries.
   */
  verifyAndRepairLocalStorageState() {
    // Create objects representing present and default state of localStorage
    const defaultState: ILocalStorageState = this.defaultPermittedLocalStorageState;
    const presentState: any = this.getLocalStorageState();

    // Ensure all required app keys exist with valid values
    const newState: ILocalStorageState = (
      Object.keys(defaultState) as LSKey[]
    ).reduce((accumState: any, key: LSKey) => {
      // Build tests that compare localStorage key-value pairs between
      // present state and default state
      const isValueUndefined = typeof presentState[key] === 'undefined';
      const isBasicTypeWrong =
        typeof presentState[key] !== typeof defaultState[key];

      if (isValueUndefined || isBasicTypeWrong) {
        // If problem is found with present key-value pair, use default
        accumState[key] = defaultState[key];
      } else {
        // Else keep existing value
        accumState[key] = presentState[key];
      }
      return accumState;
    }, {});

    // Update localStorage key-value pairs for app-specific keys
    this.setLocalStorageState(newState);
  }

  setLocalStorageState(newState: Partial<ILocalStorageState>) {
    if (!newState) return;
    // Update multiple key-value pairs in localStorage from object with subset of key-value pairs
    (Object.keys(newState) as LSKey[]).forEach((key: LSKey) => {
      this.setItem(key, newState[key]);
    });
  }

  /**
   * Method to be triggered when SiteTheme is updated to update div of class
   * 'cdk-overlay-container' to also be of class equal to the theme's name
   */
  updateCdkOverlayClass(newTheme: string) {
    const classList: DOMTokenList =
      this.overlayContainer.getContainerElement().classList;
    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(newTheme.toLowerCase());
  }
}
