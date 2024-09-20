import { createEffect, ofType, Actions } from '@ngrx/effects';
import { withLatestFrom, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { IAppState } from '../reducers';

import {
  NavigationAction_SetRouteRecords,
  NavigationAction_UpdateRouteRecords,
} from '../actions/navigation.actions';

export const updateNavigationRecords$ = createEffect(
  (actions$ = inject(Actions), store$ = inject(Store<IAppState>)) => {
    return actions$.pipe(
      tap((action) => {
        if (action.type === '@ngrx/router-store/request') {
          setTimeout(() => {
            //@ts-ignore
            gtag('event', 'page_view', {
              page_location: document.location.href,
            });
          }, 1000);
        }
      }),
      ofType(NavigationAction_UpdateRouteRecords),
      withLatestFrom(store$.select((state) => state.navigation)),
      map(([action, navState]) =>
        NavigationAction_SetRouteRecords({
          presentRoute: action.newPresentRoute,
          previousRoute: navState.presentRoute,
          isNewRouteScheduled: false,
        })
      )
    );
  },
  { dispatch: true, functional: true }
);
