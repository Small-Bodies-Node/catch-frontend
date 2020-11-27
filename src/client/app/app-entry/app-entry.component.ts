import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSidenav } from '@angular/material/sidenav';

import { AppState } from '../ngrx/reducers';
import { TPermittedTheme } from '../models/site-settings.model';
import { selectRouterUrl } from '../ngrx/selectors/router.selectors';
import { NavigationCollectRouteRecords } from '../ngrx/actions/navigation.actions';
import { INeatObjectQueryStatus } from '../models/neat-object-query-result-labels.model';
import { SiteSettingsLoadAllFromLocalStorage } from '../ngrx/actions/site-settings.actions';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';
import { selectNeatObjectQueryStatus } from '../ngrx/selectors/neat-object-query.selectors';
import { selectSiteSettingsEffectiveTheme } from '../ngrx/selectors/site-settings.selectors';
import {
  selectNavigationRecords,
  selectIsNewRouteScheduled
} from '../ngrx/selectors/navigation.selectors';
import {
  defaultPageAnimationDelayMs,
  fromHomePageAnimationDelayMs,
  toHomePageAnimationDelayMs,
  pageFadeDurationMs
} from '../../app/utils/animation-constants';
import { concatMap } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { DelayedRouterService } from '../core/services/delayed-router/delayed-router';

@Component({
  selector: 'app-entry-root',
  templateUrl: './app-entry.component.html',
  styleUrls: ['./app-entry.component.scss']
})
export class AppEntryComponent {
  // ~~~~~~~~~~~~~~~~~~~~~~~~>>>

  siteTheme!: TPermittedTheme;
  selectedRoute = '';
  isHomePage = false;
  isAppLoaded = false;
  isPageTransitionScheduled = true;
  isRoutedPageHidden = true;
  isReadyForAnimation = false;
  neatQueryStatus!: INeatObjectQueryStatus;
  delayTimeMs = defaultPageAnimationDelayMs;

  constructor(
    private localStorageService: LocalStorageService,
    private store: Store<AppState>,
    private router: Router,
    private delayedRouter: DelayedRouterService,
    private ref: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this._onSiteLoad();
  }

  private _onSiteLoad() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-178747936-1', {
          page_path: event.urlAfterRedirects
        });
      }
    });
    // Ensure local storage is setup with default values
    this.localStorageService.verifyAndRepairLocalStorageState();

    // Load localStorage settings into ngrx store
    this.store.dispatch(new SiteSettingsLoadAllFromLocalStorage());

    // Whenever the native StoreRouter dispatches an action (viz. on route updates)
    // we dispatch our own "navigation-collect-route-records" action,
    // which triggers effect 'collectNavigationRecords$'
    this.store.select(selectRouterUrl).subscribe(url => {
      if (!!url) {
        this.store.dispatch(
          new NavigationCollectRouteRecords({
            newPresentRoute: url
          })
        );

        // TEMPORARY: used as part of a rerouting-without-apache hack:
        const queryParams = this.router.parseUrl(url).queryParams;
        queryParams.about && this.delayedRouter.delayedRouter('about');
        queryParams.apis && this.delayedRouter.delayedRouter('apis');
        queryParams.contact && this.delayedRouter.delayedRouter('contact');
        queryParams.terms && this.delayedRouter.delayedRouter('terms');
        queryParams.settings && this.delayedRouter.delayedRouter('settings');
        queryParams.data &&
          this.delayedRouter.delayedRouter('data', { queryParams: { objid: queryParams.data } });
      }
    });

    /*     this.router.events.subscribe(event => {
      const url =  !( event instanceof RouteConfigLoadStart) ? event.url;
      console.log('url: ', url);
    }); */

    // Logic to hide/show footer on route changes
    // We delay the appearance of the footer if navigating to or from homepage
    this.store.select(selectNavigationRecords).subscribe(navSubstate => {
      const isToHomePage = navSubstate.presentRoute === '/';
      const isFromHomePage = navSubstate.previousRoute === '/';

      // Control routed-page animation
      this.delayTimeMs = defaultPageAnimationDelayMs;
      if (isToHomePage) this.delayTimeMs = toHomePageAnimationDelayMs;
      if (isFromHomePage) this.delayTimeMs = fromHomePageAnimationDelayMs;
    });

    this.store.select(selectIsNewRouteScheduled).subscribe(isNewRouteScheduled => {
      this.isPageTransitionScheduled = isNewRouteScheduled;
    });

    // Logic to react to messages received from server
    this.store
      .select(selectNeatObjectQueryStatus)
      .pipe(
        /**
         * This logic controls the minimal time that has to transpire before the next
         * event will be emitted; see: https://stackoverflow.com/a/50322466/8620332
         */
        concatMap(status => {
          if (!status || !status.message) return of(status);
          // Delay longer the message that comes BEFORE '...Generating cutouts...'
          return timer(status.message.includes('Generating cutouts') ? 2000 : 500).pipe(
            concatMap(_ => of(status))
          );
        })
      )
      .subscribe(status => {
        setTimeout(() => {
          // Update component properties
          if (!!status) this.neatQueryStatus = { ...status };

          // ng was struggling to detect property changes here,
          // so we'll force it to check for changes
          this.ref.detectChanges();

          // Once "found", trigger navigation to neat-view page
          if (!!status && status.code === 'found') {
            setTimeout(() => {
              // Routing here has to be carried out within ngZone
              // See: https://stackoverflow.com/a/55087372/8620332
              this.ngZone.run(() => {
                this.delayedRouter.delayedRouter('data', { queryParams: { objid: status.objid } });
              });
            }, 500);
          }
        }, 0);
      });

    // Initialize app
    // Remove loader graphic
    const fadeTimeMs = 2000;
    const delayLoadTime = 3000;

    // Set siteTheme
    this.store.select(selectSiteSettingsEffectiveTheme).subscribe(siteTheme => {
      this.siteTheme = siteTheme;
      // Set body color based on siteTheme value
      const isDark = siteTheme === 'DARK-THEME';
      setTimeout(() => {
        // This makes mobile swiping more attractive with dark theme
        document.body.style.backgroundColor = isDark ? '#303030' : 'white';
      }, delayLoadTime * 2);
    });

    setTimeout(() => {
      const appLoadingDiv = document.getElementById('appLoadingDivId');
      if (!!appLoadingDiv) appLoadingDiv.classList.add(`fade-out-${fadeTimeMs}`);
      setTimeout(() => {
        if (!!appLoadingDiv) appLoadingDiv.remove();
      }, fadeTimeMs);
      this.isAppLoaded = true;
    }, delayLoadTime);
  }

  openSidenav(sidenav: MatSidenav) {
    sidenav.open();
  }

  closeSidenav(sidenav: MatSidenav) {
    setTimeout(() => sidenav.close(), 250); // Add slight delay before closing
  }

  getPageAnimateStyle() {
    const animation = this.isPageTransitionScheduled
      ? `pageFadeOut ${pageFadeDurationMs}ms ease-in-out 0ms 1 normal forwards`
      : `pageFadeIn ${pageFadeDurationMs}ms ease-in-out ${this.delayTimeMs}ms 1 normal forwards`;
    return { animation };
  }

  getFooterAnimateStyle() {
    const top = this.isPageTransitionScheduled || !this.isAppLoaded ? null : 0;
    const transition = this.isPageTransitionScheduled
      ? `top ${pageFadeDurationMs}ms ease-in-out 0ms`
      : `top ${pageFadeDurationMs}ms ease-in-out ${this.delayTimeMs}ms`;
    return { top, transition };
  }

  getSearchMessage(neatQueryStatus: any) {
    const result = ('' + neatQueryStatus.objid + ': ' + neatQueryStatus.message).replace('.', '');
    return result;
  }
}
