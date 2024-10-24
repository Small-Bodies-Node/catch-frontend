import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import {
  defaultPageAnimationDelayMs,
  fromHomePageAnimationDelayMs,
  pageFadeDurationMs,
  toHomePageAnimationDelayMs,
} from '../../utils/animation-constants';
import { TPermittedTheme } from '../../models/ISiteSettings';
import { IAppState } from '../ngrx/reducers';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';
import { SiteSettingsAction_LoadAllFromLocalStorage } from '../ngrx/actions/site-settings.actions';
import { selectUrl } from '../ngrx/selectors/router.selectors';
import { NavigationAction_UpdateRouteRecords } from '../ngrx/actions/navigation.actions';
import {
  selectIsNewRouteScheduled,
  selectNavigationRecords,
} from '../ngrx/selectors/navigation.selectors';
import { selectSiteSettingsEffectiveTheme } from '../ngrx/selectors/site-settings.selectors';
import { selectApiStatus } from '../ngrx/selectors/api-data.selectors';
import { footerHeightPx, headerHeightPx } from '../../utils/constants';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { AboutPageComponent } from '../components/about-page/about-page.component';
import { ApisPageComponent } from '../components/apis-page/apis-page.component';
import { BackgroundComponent } from '../components/background/background.component';
import { CometAnimationsComponent } from '../components/comet-animations/comet-animations.component';
import { ContactPageComponent } from '../components/contact-page/contact-page.component';
import { HeaderComponent } from '../components/header/header.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { SettingsPageComponent } from '../components/settings-page/settings-page.component';
import { TermsPageComponent } from '../components/terms-page/terms-page.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SearchFieldComponent } from '../components/search-field/search-field.component';
import { UnrecognizedNameDialogComponent } from '../components/search-field/unrecognized-name-dialog.component';
import { StreamingMessagesComponent } from '../components/streaming-messages/streaming-messages.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './app-entry.component.html',
  styleUrls: ['./app-entry.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    CoreModule,
    RouterModule,
    //
    AboutPageComponent,
    ApisPageComponent,
    BackgroundComponent,
    CometAnimationsComponent,
    ContactPageComponent,
    HeaderComponent,
    HomePageComponent,
    SettingsPageComponent,
    SidenavComponent,
    TermsPageComponent,
    FooterComponent,
    SearchFieldComponent,
    UnrecognizedNameDialogComponent,
    StreamingMessagesComponent,
  ],
})
export class AppEntryComponent implements OnInit {
  // --->>>

  isPageTransitionScheduled = false;
  delayTimeMs = defaultPageAnimationDelayMs;
  isAppLoaded = false;
  isStreamingMessage = false;
  siteTheme: TPermittedTheme = 'DARK-THEME';

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
    this.store$.dispatch(SiteSettingsAction_LoadAllFromLocalStorage());

    /**
     * Whenever the native StoreRouter dispatches an action (viz. on route updates)
     * we dispatch our own "navigation-update-route-records" action,
     * so that the previous and present routes get updated
     */
    this.store$.select(selectUrl).subscribe((url) => {
      if (!!url) {
        this.store$.dispatch(
          NavigationAction_UpdateRouteRecords({
            newPresentRoute: url,
          })
        );
      }
    });

    this.store$
      .select(selectIsNewRouteScheduled)
      .subscribe((isNewRouteScheduled) => {
        console.log('isNewRouteScheduled:', isNewRouteScheduled);
        this.isPageTransitionScheduled = isNewRouteScheduled;
      });

    /**
     * Logic to hide/show footer on route changes
     * We delay the reappearance of the footer if navigating to/from homepage
     */
    this.store$.select(selectNavigationRecords).subscribe((navSubstate) => {
      console.log('navSubstate:', navSubstate);
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
          try {
            document.body.style.backgroundColor = isDark ? '#303030' : 'white';
          } catch (e) {
            console.error("Couldn't set body color");
          }
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
