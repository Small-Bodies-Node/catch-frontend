import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationAction_SetIsNewRouteScheduled } from '../../../ngrx/actions/navigation.actions';

import { IAppState } from '../../../ngrx/reducers';
import { selectNavigationRecordsPresentRoute } from '../../../ngrx/selectors/navigation.selectors';
import { pageFadeDurationMs } from '../../../../utils/animation-constants';
import { TPageLink } from '../../../app-root/app.routes';
import { ApiDataAction_SetStatus } from '../../../ngrx/actions/api-data.actions';

@Injectable({
  providedIn: 'root',
})
export class DelayedRouterService {
  // --->>>

  presentRoute?: string;

  constructor(
    private router: Router,
    private store$: Store<IAppState>,
  ) {
    this.store$.select(selectNavigationRecordsPresentRoute).subscribe((presentRoute) => {
      this.presentRoute = presentRoute;
    });
  }

  delayedRouter(link: TPageLink, navigationExtras = {}) {
    // Don't change to same page
    if (this.presentRoute && this.presentRoute.includes(link)) return;
    if (this.presentRoute === '/' && link === 'home') return;

    // Reset data if navigating away from /data page
    if (link !== 'data') {
      console.log('Dispatching call to cancel fetching!');
      this.store$.dispatch(
        ApiDataAction_SetStatus({
          code: 'unset',
          message: 'Ready to fetch data',
          search: undefined,
        }),
      );
    }

    // Signal that a route change will take place soon
    this.store$.dispatch(NavigationAction_SetIsNewRouteScheduled({ isNewRouteScheduled: true }));

    // Schedule change of route at end of page-fade-out animation
    setTimeout(() => {
      this.router.navigate([`/${link}`], navigationExtras);
    }, pageFadeDurationMs);
  }
}
