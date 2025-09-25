import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
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
import { selectApiDataStatus } from '../ngrx/selectors/api-data.selectors';
import { footerHeightPx, headerHeightPx } from '../../utils/constants';

import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { BackgroundComponent } from '../components/background/background.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { StreamingMessagesComponent } from '../components/streaming-messages/streaming-messages.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [
    RouterModule,
    RouterOutlet,
    //
    BackgroundComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    StreamingMessagesComponent,
    //
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgStyle,
  ],
})
export class AppComponent implements OnInit {
  private destroy$ = new Subject<void>();

  isPageTransitionScheduled = false;
  delayTimeMs = defaultPageAnimationDelayMs;
  isAppLoaded = false;
  isStreamingMessage = false;
  siteTheme: TPermittedTheme = 'DARK-THEME';
  isFooterHidden = false;
  private isBrowser: boolean;

  constructor(
    private store$: Store<IAppState>,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private googleAnalyticsService: GoogleAnalyticsService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // this.googleAnalyticsService.initPageViewTracking();
    this._onSiteLoad();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _onSiteLoad() {
    // Ensure local storage is setup with default values
    this.localStorageService.verifyAndRepairLocalStorageState();

    // Load localStorage settings into ngrx store
    this.store$.dispatch(SiteSettingsAction_LoadAllFromLocalStorage());

    // Handle route updates
    this.store$
      .select(selectUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe((url) => {
        if (!!url) {
          this.store$.dispatch(
            NavigationAction_UpdateRouteRecords({
              newPresentRoute: url,
            }),
          );
        }
      });

    // Handle route scheduling
    this.store$
      .select(selectIsNewRouteScheduled)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isNewRouteScheduled) => {
        if (this.isPageTransitionScheduled !== isNewRouteScheduled) {
          this.isPageTransitionScheduled = isNewRouteScheduled;
          this.cdr.detectChanges();
        }
      });

    // Handle navigation state
    this.store$
      .select(selectNavigationRecords)
      .pipe(takeUntil(this.destroy$))
      .subscribe((navSubstate) => {
        const isToHomePage = navSubstate.presentRoute === '/';
        const isFromHomePage = navSubstate.previousRoute === '/';

        const newDelayTime = isToHomePage
          ? toHomePageAnimationDelayMs
          : isFromHomePage
          ? fromHomePageAnimationDelayMs
          : defaultPageAnimationDelayMs;

        if (this.delayTimeMs !== newDelayTime) {
          this.delayTimeMs = newDelayTime;
          this.cdr.detectChanges();
        }

        this.isFooterHidden = !!navSubstate.presentRoute?.startsWith('/data');
      });

    // Handle theme changes
    this.store$
      .select(selectSiteSettingsEffectiveTheme)
      .pipe(takeUntil(this.destroy$))
      .subscribe((siteTheme) => {
        if (this.siteTheme !== siteTheme) {
          this.siteTheme = siteTheme;

          // Set body color based on siteTheme value
          const isDark = siteTheme === 'DARK-THEME';
          if (this.isBrowser) {
            queueMicrotask(() => {
              try {
                document.body.style.backgroundColor = isDark ? '#303030' : 'white';
              } catch (e) {
                console.error("Couldn't set body color");
              }
            });
          }

          this.cdr.detectChanges();
        }
      });

    // Monitor API Status
    this.store$
      .select(selectApiDataStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const newIsStreaming = ['initiated', 'searching'].includes(status.code);
        if (this.isStreamingMessage !== newIsStreaming) {
          this.isStreamingMessage = newIsStreaming;
          this.cdr.detectChanges();
        }
      });

    // this.store$
    //   .select(selectApiFixedStatus)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((fixedStatus) => {
    //     const newIsStreaming = fixedStatus.code === 'searching';
    //     if (this.isStreamingMessage !== newIsStreaming) {
    //       this.isStreamingMessage = newIsStreaming;
    //       this.cdr.detectChanges();
    //     }
    //   });
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
    // Hide footer if route begins /data
    if (this.isFooterHidden) {
      return { display: 'none' };
    }

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
