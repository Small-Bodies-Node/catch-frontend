import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@client/app/ngrx/reducers';
import { NavigationSetIsNewRouteScheduled } from '@client/app/ngrx/actions/navigation.actions';
import { pageFadeDurationMs } from '@client/app/utils/animation-constants';
import { selectNavigationRecordsPresentRoute } from '@client/app/ngrx/selectors/navigation.selectors';

@Injectable({
  providedIn: 'root'
})
export class DelayedRouterService {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  presentRoute?: string;

  constructor(private router: Router, private store: Store<AppState>) {
    this.store.select(selectNavigationRecordsPresentRoute).subscribe(presentRoute => {
      this.presentRoute = presentRoute;
    });
  }

  delayedRouter(link: string, navigationExtras = {}) {
    // Don't change to same page
    if (this.presentRoute && this.presentRoute.includes(link)) return;
    if (this.presentRoute === '/' && link === 'home') return;

    // Signal that a route change will take place soon
    this.store.dispatch(new NavigationSetIsNewRouteScheduled({ isNewRouteScheduled: true }));

    // Schedule change of route at end of page-fade-out animation
    setTimeout(() => {
      this.router.navigate([link], navigationExtras);
    }, pageFadeDurationMs);
  }
}
