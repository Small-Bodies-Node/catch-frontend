import { map, withLatestFrom } from 'rxjs/operators';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  SiteSettingsAction_LoadAllFromLocalStorage,
  SiteSettingsAction_SetAll,
  SiteSettingsAction_SetIsHappyWithCookies,
  SiteSettingsAction_SetIsPageAnimated,
  SiteSettingsAction_SetThemePreference,
} from '../actions/site-settings.actions';
import { IAppState } from '../reducers';
import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import { inject } from '@angular/core';

export const loadSiteSettings = createEffect(
  (
    actions$: Actions = inject(Actions),
    localStorageService: LocalStorageService = inject(LocalStorageService),
  ) => {
    return actions$.pipe(
      ofType(SiteSettingsAction_LoadAllFromLocalStorage),
      map(() => {
        const siteSettings = localStorageService.getLocalStorageState();
        return SiteSettingsAction_SetAll({ siteSettings });
      }),
    );
  },
  { functional: true },
);

export const updateLocalStorage = createEffect(
  (
    actions$: Actions = inject(Actions),
    store$: Store<IAppState> = inject(Store),
    localStorageService: LocalStorageService = inject(LocalStorageService),
  ) => {
    return actions$.pipe(
      ofType(
        SiteSettingsAction_SetAll,
        SiteSettingsAction_SetThemePreference,
        SiteSettingsAction_SetIsPageAnimated,
        SiteSettingsAction_SetIsHappyWithCookies,
      ),
      withLatestFrom(store$),
      map(([_action, appState]) => {
        const siteSettingsSubstate = appState.siteSettingsSubstate;
        localStorageService.setLocalStorageState(siteSettingsSubstate);
      }),
    );
  },
  { functional: true, dispatch: false },
);
