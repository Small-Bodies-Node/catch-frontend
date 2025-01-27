import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import { IAppState } from '../../ngrx/reducers';
import { TPermittedTheme } from '../../../models/ISiteSettings';
import { selectNavigationRecords } from '../../ngrx/selectors/navigation.selectors';
import { selectSiteSettingsEffectiveTheme } from '../../ngrx/selectors/site-settings.selectors';
import {
  backgroundSwipeIntervalMs as intervalMs,
  backgroundSwipeDurationMs as durationMs,
} from '../../../utils/animation-constants';
import { CometAnimationsComponent } from '../comet-animations/comet-animations.component';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    //
    CometAnimationsComponent,
  ],
  //
})
export class BackgroundComponent implements OnInit {
  // --->>>

  varHostClassName = 'host-dark-theme';
  imageNames = ['mountains', 'ground', 'telescope'];
  isBackgroundShown = true;
  isAnimating = false;
  selectedRoute = '';
  siteTheme: TPermittedTheme = 'DARK-THEME';

  constructor(private store$: Store<IAppState>) {
    // --->>

    this.store$.select(selectNavigationRecords).subscribe((navRecords) => {
      // --->>

      // Remove query params from url
      const urlPath = (navRecords.presentRoute || '').split('?')[0];
      this.isBackgroundShown =
        ['/', '/home'].includes(urlPath) || urlPath === '';
      // this.isBackgroundShown = true;
      this.varHostClassName = 'host-' + this.siteTheme.toLowerCase();
    });

    this.store$.select(selectSiteSettingsEffectiveTheme).subscribe((theme) => {
      this.siteTheme = theme;
    });
  }

  ngOnInit() {}

  backgroundImageClassLogic() {
    const className =
      this.varHostClassName + (this.isBackgroundShown ? '' : ' fade-out');
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
      this.siteTheme.toLowerCase().replace('-theme', '') +
      '_' +
      imageLabel +
      '_v1.png';
    const filePath = `images/pngs/${fileName}`;

    const delayBeforeTransitionMs = imageIndex * intervalMs;
    const dynamicStyles: Partial<CSSStyleDeclaration> = {
      backgroundImage: `url(${filePath})`,
      transform: `translateX(${this.isBackgroundShown ? 0 : -100}%)`,
      transition: `transform ${durationMs}ms ease-in-out ${delayBeforeTransitionMs}ms`,
    };
    return dynamicStyles;
  }
}
