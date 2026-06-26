import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  isDevMode,
} from '@angular/core';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import {
  defaultPageAnimationDelayMs,
  fromHomePageAnimationDelayMs,
  pageFadeDurationMs,
  toHomePageAnimationDelayMs,
} from '../../utils/animation-constants';
import { IAppState } from '../ngrx/reducers';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';
import { SiteSettingsAction_LoadAllFromLocalStorage } from '../ngrx/actions/site-settings.actions';
import { selectUrl } from '../ngrx/selectors/router.selectors';
import { NavigationAction_UpdateRouteRecords } from '../ngrx/actions/navigation.actions';
import {
  selectIsNewRouteScheduled,
  selectNavigationRecords,
} from '../ngrx/selectors/navigation.selectors';
import { selectSiteSettingsThemePreference } from '../ngrx/selectors/site-settings.selectors';
import { selectApiDataStatus } from '../ngrx/selectors/api-data.selectors';
import { footerHeightPx, headerHeightPx } from '../../utils/constants';

import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { BackgroundComponent } from '../components/background/background.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { StreamingMessagesComponent } from '../components/streaming-messages/streaming-messages.component';
import { ThemeSettingsDrawerComponent } from '../components/theme-settings-drawer/theme-settings-drawer.component';
import { SiteBannerComponent } from '../components/site-banner/site-banner.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { NgStyle, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../core/services/theme/theme.service';
import { HttpClient } from '@angular/common/http';

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
    ThemeSettingsDrawerComponent,
    SiteBannerComponent,
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
  isFooterHidden = false;

  constructor(
    private store$: Store<IAppState>,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private googleAnalyticsService: GoogleAnalyticsService,
    private themeService: ThemeService,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

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

    if (isPlatformBrowser(this.platformId)) {
      this.pingLocalApi();
    }

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

    // Apply theme preference to document-level Material tokens.
    this.store$
      .select(selectSiteSettingsThemePreference)
      .pipe(takeUntil(this.destroy$))
      .subscribe((themePreference) => this.themeService.setThemePreference(themePreference));

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

  private pingLocalApi(): void {
    // Sanity check that same-origin API proxying is alive during local development.
    const helloRequestId = createDebugRequestId('catch-hello-probe');
    this.httpClient
      .get('/api/hello', {
        headers: {
          'X-CATCH-Debug': 'true',
          'X-CATCH-Request-Id': helloRequestId,
        },
        responseType: 'text',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => console.log('[CATCH API sanity] /api/hello replied:', message),
        error: (error) => console.error('[CATCH API sanity] /api/hello failed:', error),
      });

    if (isDevMode()) {
      this.pingAstrometryRoute();
    }
  }

  private pingAstrometryRoute(): void {
    const requestId = createDebugRequestId('catch-astrometry-probe');
    console.log(
      `[CATCH API sanity ${requestId}] probing /api/cat/astrometry with intentionally invalid payload`,
    );

    this.httpClient
      .post(
        '/api/cat/astrometry',
        {},
        {
          headers: {
            'X-CATCH-Debug': 'true',
            'X-CATCH-Request-Id': requestId,
            'X-CATCH-Timeout-Ms': '15000',
          },
          responseType: 'text',
        },
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) =>
          console.log(`[CATCH API sanity ${requestId}] /api/cat/astrometry replied:`, message),
        error: (error) =>
          console.error(
            `[CATCH API sanity ${requestId}] /api/cat/astrometry probe completed as error:`,
            error,
          ),
      });
  }

  closeSidenav(sidenav: MatSidenav) {
    setTimeout(() => sidenav.close(), 250); // Add slight delay before closing
  }

  openSettingsSidenav(sidenav: MatSidenav) {
    sidenav.open();
  }

  closeSettingsSidenav(sidenav: MatSidenav) {
    sidenav.close();
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

function createDebugRequestId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
