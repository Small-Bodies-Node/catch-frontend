import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';

import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { TPermittedTheme } from 'src/app/models/ISiteSettings';
import { NavigationUpdateRouteRecords } from 'src/app/ngrx/actions/navigation.actions';
import { SiteSettingsLoadAllFromLocalStorage } from 'src/app/ngrx/actions/site-settings.actions';
import { IAppState } from 'src/app/ngrx/reducers';
import { selectApiStatus } from 'src/app/ngrx/selectors/api.selectors';
import {
  selectIsNewRouteScheduled,
  selectNavigationRecords,
} from 'src/app/ngrx/selectors/navigation.selectors';
import { selectRouterUrl } from 'src/app/ngrx/selectors/router.selectors';
import { selectSiteSettingsEffectiveTheme } from 'src/app/ngrx/selectors/site-settings.selectors';
import {
  defaultPageAnimationDelayMs,
  fromHomePageAnimationDelayMs,
  pageFadeDurationMs,
  toHomePageAnimationDelayMs,
} from 'src/app/utils/animation-constants';
import { footerHeightPx, headerHeightPx } from 'src/app/utils/layout-constants';

@Component({
  selector: 'app-entry',
  templateUrl: './app-entry.component.html',
  styleUrls: ['./app-entry.component.scss'],
})
export class AppEntryComponent implements OnInit {
  // --->>>

  isPageTransitionScheduled = false;
  delayTimeMs = defaultPageAnimationDelayMs;
  isAppLoaded = false;
  isStreamingMessage = false;
  siteTheme!: TPermittedTheme;

  constructor(
    private store$: Store<IAppState>,
    private localStorageService: LocalStorageService
  ) {
    // this._onSiteLoad();
  }

  ngOnInit(): void {
    this._onSiteLoad();
  }

  private _onSiteLoad() {
    // --->>

    // Ensure local storage is setup with default values
    this.localStorageService.verifyAndRepairLocalStorageState();

    // Load localStorage settings into ngrx store
    this.store$.dispatch(new SiteSettingsLoadAllFromLocalStorage());

    /**
     * Whenever the native StoreRouter dispatches an action (viz. on route updates)
     * we dispatch our own "navigation-update-route-records" action,
     * so that the previous and present routes get updated
     */
    this.store$.select(selectRouterUrl).subscribe((url) => {
      if (!!url) {
        this.store$.dispatch(
          new NavigationUpdateRouteRecords({
            newPresentRoute: url,
          })
        );
      }
    });

    this.store$
      .select(selectIsNewRouteScheduled)
      .subscribe((isNewRouteScheduled) => {
        this.isPageTransitionScheduled = isNewRouteScheduled;
      });

    /**
     * Logic to hide/show footer on route changes
     * We delay the reappearance of the footer if navigating to/from homepage
     */
    this.store$.select(selectNavigationRecords).subscribe((navSubstate) => {
      const isToHomePage = navSubstate.presentRoute === '/';
      const isFromHomePage = navSubstate.previousRoute === '/';
      // Control delay time for footer to reappear
      this.delayTimeMs = defaultPageAnimationDelayMs;
      if (isToHomePage) this.delayTimeMs = toHomePageAnimationDelayMs;
      if (isFromHomePage) this.delayTimeMs = fromHomePageAnimationDelayMs;
    });

    // Set siteTheme
    this.store$
      .select(selectSiteSettingsEffectiveTheme)
      .subscribe((siteTheme) => {
        this.siteTheme = siteTheme;
        // Set body color based on siteTheme value
        const isDark = siteTheme === 'DARK-THEME';
        setTimeout(() => {
          // This makes mobile swiping more attractive with dark theme
          document.body.style.backgroundColor = isDark ? '#303030' : 'white';
        }, 0);
      });

    // Monitor API Status
    this.store$.select(selectApiStatus).subscribe((status) => {
      this.isStreamingMessage = status.code === 'searching';
      // console.log('%%%', status.code, this.isStreamingMessage);
    });
  }

  openSidenav(sidenav: MatSidenav) {
    sidenav.open();
  }

  closeSidenav(sidenav: MatSidenav) {
    setTimeout(() => sidenav.close(), 250); // Add slight delay before closing
  }

  getHeaderWrapperStyle() {
    return { height: `${headerHeightPx}px` };
  }

  getContentWrapperStyle() {
    const delayMs = this.isPageTransitionScheduled ? 0 : this.delayTimeMs;
    const durationsMs = pageFadeDurationMs;
    const animation = this.isPageTransitionScheduled
      ? `pageFadeOut ${durationsMs}ms ease-in-out ${delayMs}ms 1 normal forwards`
      : ` pageFadeIn ${durationsMs}ms ease-in-out ${delayMs}ms 1 normal forwards`;
    return { animation };
  }

  getFooterStyle() {
    return {
      height: `${footerHeightPx}px`,
      maxHeight: `${footerHeightPx}px`,
    };
  }

  getFooterAnimatorStyle() {
    const top = this.isPageTransitionScheduled ? `${footerHeightPx}px` : `0px`;
    const delayMs = this.isPageTransitionScheduled ? 0 : this.delayTimeMs;
    const transition = `top ${pageFadeDurationMs}ms ease-in-out ${delayMs}ms`;
    return { top, transition };
  }
}
