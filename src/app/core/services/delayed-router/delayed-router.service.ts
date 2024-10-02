import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationAction_SetIsNewRouteScheduled } from '../../../ngrx/actions/navigation.actions';

import { IAppState } from '../../../ngrx/reducers';
import { selectNavigationRecordsPresentRoute } from '../../../ngrx/selectors/navigation.selectors';
import { pageFadeDurationMs } from '../../../../utils/animation-constants';

@Injectable({
  providedIn: 'root',
})
export class DelayedRouterService {
  // --->>>

  presentRoute?: string;

  constructor(private router: Router, private store$: Store<IAppState>) {
    this.store$
      .select(selectNavigationRecordsPresentRoute)
      .subscribe((presentRoute) => {
        this.presentRoute = presentRoute;
      });
  }

  delayedRouter(link: string, navigationExtras = {}) {
    // Don't change to same page
    if (this.presentRoute && this.presentRoute.includes(link)) return;
    if (this.presentRoute === '/' && link === 'home') return;

    // Signal that a route change will take place soon
    this.store$.dispatch(
      NavigationAction_SetIsNewRouteScheduled({ isNewRouteScheduled: true })
    );

    // Schedule change of route at end of page-fade-out animation
    setTimeout(() => {
      console.log('Debug 0');
      this.router.navigate([link], navigationExtras);
      console.log('Debug 1');
    }, pageFadeDurationMs);
  }
}
