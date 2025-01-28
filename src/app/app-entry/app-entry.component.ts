import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { selectApiDataStatus } from '../ngrx/selectors/api-data.selectors';
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
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-entry',
  templateUrl: './app-entry.component.html',
  styleUrls: ['./app-entry.component.scss'],
  imports: [
    SharedModule,
    CoreModule,
    RouterModule,
    // RouterLink,
    RouterOutlet,
    // RouterLinkActive,
    //
    // AboutPageComponent,
    // ApisPageComponent,
    BackgroundComponent,
    // CometAnimationsComponent,
    // ContactPageComponent,
    HeaderComponent,
    // HomePageComponent,
    // SettingsPageComponent,
    SidenavComponent,
    // TermsPageComponent,
    FooterComponent,
    // SearchFieldComponent,
    // UnrecognizedNameDialogComponent,
    StreamingMessagesComponent,
  ],
})
export class AppEntryComponent implements OnInit {
  private destroy$ = new Subject<void>();

  isPageTransitionScheduled = false;
  delayTimeMs = defaultPageAnimationDelayMs;
  isAppLoaded = false;
  isStreamingMessage = false;
  siteTheme: TPermittedTheme = 'DARK-THEME';
  isFooterHidden = false;

  constructor(
    private store$: Store<IAppState>,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
            })
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
          queueMicrotask(() => {
            try {
              document.body.style.backgroundColor = isDark
                ? '#303030'
                : 'white';
            } catch (e) {
              console.error("Couldn't set body color");
            }
          });

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
