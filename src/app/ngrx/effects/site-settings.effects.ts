import { map, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Observable, interval } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  SiteSettingsAction_LoadAllFromLocalStorage,
  SiteSettingsAction_SetAll,
  SiteSettingsAction_SetHour,
  SiteSettingsAction_SetIsAutoNightMode,
  SiteSettingsAction_SetIsHappyWithCookies,
  SiteSettingsAction_SetIsPageAnimated,
  SiteSettingsAction_SetSiteTheme,
} from '../actions/site-settings.actions';
import { IAppState } from '../reducers';
import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import { inject } from '@angular/core';

const changeHour$: Observable<ReturnType<typeof SiteSettingsAction_SetHour>> =
  interval(60_000).pipe(
    map(() => new Date().getHours()),
    distinctUntilChanged(),
    map((hour) => SiteSettingsAction_SetHour({ hour }))
  );

export const loadSiteSettings = createEffect(
  (
    actions$: Actions = inject(Actions),
    localStorageService: LocalStorageService = inject(LocalStorageService)
  ) => {
    return actions$.pipe(
      ofType(SiteSettingsAction_LoadAllFromLocalStorage),
      map(() => {
        const siteSettings = localStorageService.getLocalStorageState();
        return SiteSettingsAction_SetAll({ siteSettings });
      })
    );
  },
  { functional: true }
);

export const updateLocalStorage = createEffect(
  (
    actions$: Actions = inject(Actions),
    store$: Store<IAppState> = inject(Store),
    localStorageService: LocalStorageService = inject(LocalStorageService)
  ) => {
    return actions$.pipe(
      ofType(
        SiteSettingsAction_SetAll,
        SiteSettingsAction_SetSiteTheme,
        SiteSettingsAction_SetIsPageAnimated,
        SiteSettingsAction_SetIsAutoNightMode,
        SiteSettingsAction_SetIsHappyWithCookies
      ),
      withLatestFrom(store$),
      map(([_action, appState]) => {
        const siteSettingsSubstate = appState.siteSettingsSubstate;
        localStorageService.setLocalStorageState(siteSettingsSubstate);
      })
    );
  },
  { functional: true, dispatch: false }
);
