import { Actions, createEffect, ofType } from '@ngrx/effects';
import { withLatestFrom, map } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ENavigationActionTypes,
  NavigationAction_SetRouteRecords,
} from '../actions/navigation.actions';
import { IAppState } from '../reducers';

@Injectable()
export class NavigationEffects {
  // --->>>

  constructor(
    private actions$: Actions<any>,
    private store$: Store<IAppState>
  ) {}

  updateNavigationRecords$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      map((action) => {
        // console.log('action', action);

        if (action.type === '@ngrx/router-store/request') {
          setTimeout(() => {
            // console.log('>>>', document.location.href, action.payload);
            gtag('event', 'page_view', {
              page_location: document.location.href,
              // page_title: document.title,
            });
          }, 1000);
        }
        return action;
      }),
      // Allow only actions of type NavigationCollectRouteRecords
      ofType(ENavigationActionTypes.NavigationUpdateRouteRecords),

      // Take the last observable (the action), take the store state,
      // and emit an observable of form Observable<[Action,StoreState]>
      withLatestFrom(this.store$.select((state) => state.navigation)),

      // Map two received observables to single new observable action
      // that will pass through and trigger SetRouteRecords reducer
      map(([action, navState]) => {
        return new NavigationAction_SetRouteRecords({
          presentRoute: action.payload.newPresentRoute,
          previousRoute: navState.presentRoute,
          isNewRouteScheduled: false,
        });
      })
    );
  });
}
