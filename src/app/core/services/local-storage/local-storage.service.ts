import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ILocalStorageState } from '../../../../models/ILocalStorageState';

type LSKey = keyof ILocalStorageState; // Define type for 'LocalStorageKeys'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // --->>>

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
      // Build copy of localStorage as js object
      return Object.keys(localStorage).reduce(
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
      // Retrieve parsed individual item
      const item = localStorage.getItem(key);
      try {
        return !!item ? JSON.parse(item) : 'NO_ITEM_FOUND';
      } catch (e) {
        console.error(e);
        return 'NO_ITEM_FOUND';
      }
    } catch (e) {
      return this.defaultPermittedLocalStorageState[key];
    }
  }

  setItem(key: LSKey, value: any) {
    try {
      // Set individual key-value pair in localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
      if (key === 'siteTheme') this.updateCdkOverlayClass(value);
    } catch (e) {
      //
    }
  }

  removeItem(key: string) {
    try {
      // Remove individual key-value pair from localStorage
      window.localStorage.removeItem(key);
    } catch (e) {
      //
    }
  }

  /**
   * Check that local storage ONLY has "permitted" key-value pairs as defined by ILocalStorageState
   * Remove any pairs that are not "permitted".
   * Create and apply default key-value pair to any missing pair.
   */
  verifyAndRepairLocalStorageState() {
    //
    // Create objects representing present and default state of localStorage
    const defaultState: ILocalStorageState =
      this.defaultPermittedLocalStorageState;
    const presentState: any = this.getLocalStorageState();

    // Loop through keys of presentState; remove pair if key is not in defaultState
    Object.keys(presentState).forEach((stateKey: string) => {
      if (!Object.keys(defaultState).includes(stateKey))
        this.removeItem(stateKey);
    });

    // Verify key-value pairs and types by looping thru keys of defaultState;
    // if presentState has key missing, or is of wrong type, then reset that key-value pair to default
    const newState: ILocalStorageState = (
      Object.keys(defaultState) as LSKey[]
    ).reduce((accumState: any, key: LSKey) => {
      //
      // Build tests that compare localStorage key-value pairs between
      // present state and default state
      const isValueUndefined = typeof presentState[key] === 'undefined';
      const isBasicTypeWrong =
        typeof presentState[key] !== typeof defaultState[key];

      if (isValueUndefined || isBasicTypeWrong) {
        // If problem is found with present key-value pair, reset it
        accumState[key] = defaultState[key];
      } else {
        // Else keep it
        accumState[key] = presentState[key];
      }
      return accumState;
    }, {});

    // Update localStorage key-value pairs
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
    //
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
