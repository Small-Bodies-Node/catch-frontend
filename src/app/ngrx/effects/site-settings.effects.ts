import { map, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  ESiteSettingsActionTypes,
  SiteSettingsActions,
  SiteSettingsAction_SetAll,
  SiteSettingsSetHour,
} from '../actions/site-settings.actions';
import { IAppState } from '../reducers';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';

@Injectable()
export class SiteSettingsEffects {
  // --->>>

  // Check the hour every 60s
  changeHour$: Observable<SiteSettingsSetHour> = interval(60_000).pipe(
    map(() => new Date().getHours()),
    distinctUntilChanged(), // Only emit when input changes
    map((hour) => new SiteSettingsSetHour({ hour })) // Set new hour
  );

  constructor(
    private actions$: Actions<any>,
    private localStorageService: LocalStorageService,
    private store$: Store<IAppState>
  ) {}

  loadSiteSettings: Observable<SiteSettingsSetAll> = createEffect(() => {
    return this.actions$.pipe(
      map((action) => {
        // console.log('action', action);
        return action;
      }),
      ofType(ESiteSettingsActionTypes.SiteSettingsLoadAllFromLocalStorage),
      map((_) => {
        const siteSettings = this.localStorageService.getLocalStorageState();
        // console.log('siteSettings', siteSettings);
        return new SiteSettingsAction_SetAll({ siteSettings });
      })
    );
  });

  updateLocalStorage: Observable<void> = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<SiteSettingsActions>(
          ESiteSettingsActionTypes.SiteSettingsSetAll,
          ESiteSettingsActionTypes.SiteSettingsSetSiteTheme,
          ESiteSettingsActionTypes.SiteSettingsSetIsPageAnimated,
          ESiteSettingsActionTypes.SiteSettingsSetIsAutoNightMode,
          ESiteSettingsActionTypes.SiteSettingsSetIsHappyWithCookies
        ),
        withLatestFrom(this.store$),
        map(([_action, appState]) => {
          // Whenever we update store's siteSettings, we re-set them in localStorage
          const siteSettingsSubstate = appState.siteSettingsSubstate;
          this.localStorageService.setLocalStorageState(siteSettingsSubstate);
        })
      );
    },
    { dispatch: false }
  );
}
