import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { ILocalStorageState } from '../../../../models/ILocalStorageState';

type LSKey = keyof ILocalStorageState; // Define type for 'LocalStorageKeys'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // App-specific prefix for localStorage keys to avoid conflicts with other libraries
  private readonly APP_PREFIX = 'sbn_catch_';

  private readonly isBrowser: boolean;
  private memoryStore: Record<string, string> = {};

  private defaultPermittedLocalStorageState: ILocalStorageState = {
    siteTheme: 'DARK-THEME',
    isPageAnimated: true,
    isAutoNightMode: false,
    isHappyWithCookies: false,
    hour: new Date().getHours(),
    testKey: 'foo',
  };

  constructor(
    private overlayContainer: OverlayContainer,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getLocalStorageState(): ILocalStorageState {
    try {
      if (!this.isBrowser) {
        // On the server, return a safe default clone
        return { ...this.defaultPermittedLocalStorageState };
      }

      // Only get app-specific keys (those with our prefix)
      const appKeys = Object.keys(window.localStorage)
        .filter((key) => key.startsWith(this.APP_PREFIX))
        .map((key) => key.substring(this.APP_PREFIX.length));

      // Build copy of localStorage as JS object with only app-specific keys
      return appKeys.reduce((accumState: any, key: string) => {
        accumState[key] = this.getItem(key as LSKey);
        return accumState;
      }, {});
    } catch (e) {
      return { ...this.defaultPermittedLocalStorageState };
    }
  }

  getItem(key: LSKey) {
    try {
      // Retrieve parsed individual item using prefixed key
      const prefixedKey = this.APP_PREFIX + key;
      const item = this.isBrowser
        ? window.localStorage.getItem(prefixedKey)
        : this.memoryStore[prefixedKey];
      
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
      if (this.isBrowser) {
        window.localStorage.setItem(prefixedKey, JSON.stringify(value));
        if (key === 'siteTheme') this.updateCdkOverlayClass(value);
      } else {
        // Store in-memory on the server to avoid ReferenceError
        this.memoryStore[prefixedKey] = JSON.stringify(value);
      }
    } catch (e) {
      console.error(`Error setting localStorage item '${key}':`, e);
    }
  }

  removeItem(key: string) {
    try {
      // Remove individual key-value pair from localStorage, with prefix
      const prefixedKey = this.APP_PREFIX + key;
      if (this.isBrowser) {
        window.localStorage.removeItem(prefixedKey);
      } else {
        delete this.memoryStore[prefixedKey];
      }
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

  // ===== Dynamic app-key helpers for arbitrary items (e.g., API data cache)
  getAppItemDynamic<T = any>(dynamicKey: string): T | undefined {
    try {
      const prefixedKey = this.APP_PREFIX + dynamicKey;
      const item = this.isBrowser
        ? window.localStorage.getItem(prefixedKey)
        : this.memoryStore[prefixedKey];
      if (!item) return undefined;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error reading dynamic localStorage item '${dynamicKey}':`, e);
      return undefined;
    }
  }

  setAppItemDynamic(dynamicKey: string, value: any) {
    try {
      const prefixedKey = this.APP_PREFIX + dynamicKey;
      if (this.isBrowser) {
        window.localStorage.setItem(prefixedKey, JSON.stringify(value));
      } else {
        this.memoryStore[prefixedKey] = JSON.stringify(value);
      }
    } catch (e) {
      console.error(`Error setting dynamic localStorage item '${dynamicKey}':`, e);
    }
  }

  removeAppItemDynamic(dynamicKey: string) {
    this.removeItem(dynamicKey);
  }

  /**
   * Remove all API cache entries (keys beginning with APP_PREFIX + 'api_cache_').
   * Returns the number of entries removed.
   */
  clearApiCache(): number {
    try {
      const cachePrefix = this.APP_PREFIX + 'api_cache_';
      let removed = 0;
      if (this.isBrowser) {
        Object.keys(window.localStorage).forEach((k) => {
          if (k.startsWith(cachePrefix)) {
            window.localStorage.removeItem(k);
            removed += 1;
          }
        });
      } else {
        Object.keys(this.memoryStore).forEach((k) => {
          if (k.startsWith(cachePrefix)) {
            delete this.memoryStore[k];
            removed += 1;
          }
        });
      }
      return removed;
    } catch (e) {
      console.error('Error clearing API cache', e);
      return 0;
    }
  }

  /**
   * Method to be triggered when SiteTheme is updated to update div of class
   * 'cdk-overlay-container' to also be of class equal to the theme's name
   */
  updateCdkOverlayClass(newTheme: string) {
    if (!this.isBrowser) return;

    const classList: DOMTokenList = this.overlayContainer.getContainerElement().classList;
    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(newTheme.toLowerCase());
  }
}
