import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppState } from '../../ngrx/reducers';
const startStars = require('./starry-sky.js');
import { CometAnimation } from './comet-animations';

import { Store } from '@ngrx/store';
import { selectSiteSettingsEffectiveTheme } from '@client/app/ngrx/selectors/site-settings.selectors';
import { TPermittedTheme } from '@client/app/models/site-settings.model';
import { simpleUid } from '@client/app/utils/simple-uid';
import {
  backgroundSwipeIntervalMs as intervalMs,
  backgroundSwipeDurationMs as durationMs
} from '@client/app/utils/animation-constants';
import { selectNavigationRecords } from '@client/app/ngrx/selectors/navigation.selectors';

@Component({
  selector: 'app-background-graphic',
  templateUrl: './background-graphic.component.html',
  styleUrls: ['./background-graphic.component.scss']
})
export class BackgroundGraphicComponent implements OnInit, AfterViewInit {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  varHostClassName = 'host-dark-theme';

  imageNames = ['ground', 'mountains', 'telescope'];

  videoSrc = 'assets/videos/webms/cometz7.webm';

  isBackgroundShown = true;
  isAnimating = false;
  selectedRoute = '';
  siteTheme: TPermittedTheme = 'DARK-THEME';
  videoId = simpleUid() + 'backgroundVideoId';

  constructor(private store: Store<AppState>) {
    // ------------------------------------->>>

    // Listen to changes in route; show/hide background based on present route
    this.store.select(selectNavigationRecords).subscribe(navRecords => {
      this.isBackgroundShown =
        !!navRecords.presentRoute && ['/', '/home'].includes(navRecords.presentRoute);
      this.varHostClassName = 'host-' + this.siteTheme.toLowerCase();

      if (false) setTimeout(() => startStars(), 300);
      if (!false) {
        if (!!this.isBackgroundShown) setTimeout(() => CometAnimation.start(), 0);
        if (!this.isBackgroundShown)
          setTimeout(() => {
            if (!this.isBackgroundShown) CometAnimation.stop();
          }, 1500);
      }
    });

    this.store.select(selectSiteSettingsEffectiveTheme).subscribe(theme => {
      this.siteTheme = theme;
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Slow down video
    const vidEl = document.getElementById(this.videoId);
    if (!!vidEl) (vidEl as HTMLVideoElement).playbackRate = 0.4;
  }

  backgroundImageClassLogic() {
    const className = this.varHostClassName + (this.isBackgroundShown ? '' : ' fade-out');
    return className;
  }

  getSelectedRoute() {
    return this.selectedRoute;
  }

  isRouteChanged() {
    return this.selectedRoute;
  }

  getAnimatedImageStyle(imageLabel: string, imageIndex: number) {
    // Build file path:
    const fileName =
      this.siteTheme.toLowerCase().replace('-theme', '') + '_' + imageLabel + '_v1.png';
    const filePath = `assets/images/pngs/${fileName}`;

    const delayBeforeTransitionMs = imageIndex * intervalMs;
    const dynamicStyles: Partial<CSSStyleDeclaration> = {
      backgroundImage: `url(${filePath})`,
      transform: `translateX(${this.isBackgroundShown ? 0 : -100}%)`,
      transition: `transform ${durationMs}ms ease-in-out ${delayBeforeTransitionMs}ms`
    };
    return dynamicStyles;
  }
}
