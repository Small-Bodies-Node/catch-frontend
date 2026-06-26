import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import { IAppState } from '../../ngrx/reducers';
import { TEffectiveTheme } from '../../../models/ISiteSettings';
import { selectNavigationRecords } from '../../ngrx/selectors/navigation.selectors';
import {
  backgroundSwipeIntervalMs as intervalMs,
  backgroundSwipeDurationMs as durationMs,
} from '../../../utils/animation-constants';
import { ThemeService } from '../../core/services/theme/theme.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
  imports: [CommonModule],
})
export class BackgroundComponent implements OnInit {
  // --->>>

  varHostClassName = 'host-dark-theme';
  imageNames = ['mountains', 'ground', 'telescope'];
  isBackgroundShown = true;
  isAnimating = false;
  selectedRoute = '';
  effectiveTheme: TEffectiveTheme = 'light';

  constructor(
    private store$: Store<IAppState>,
    private themeService: ThemeService,
  ) {
    // --->>

    this.store$.select(selectNavigationRecords).subscribe((navRecords) => {
      // --->>

      // Remove query params from url
      const urlPath = (navRecords.presentRoute || '').split('?')[0];
      if (!false) {
        this.isBackgroundShown = ['/', '/home'].includes(urlPath) || urlPath === '';
      }
      this.varHostClassName = `host-${this.effectiveTheme}-theme`;
    });

    this.themeService.effectiveTheme$.subscribe((theme) => {
      this.effectiveTheme = theme;
      this.varHostClassName = `host-${theme}-theme`;
    });
  }

  ngOnInit() {}

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
    const imageVersion = this.effectiveTheme === 'dark' ? 'v3' : 'v1';
    const fileName = `${this.effectiveTheme}_${imageLabel}_${imageVersion}.png`;
    const filePath = `assets/images/pngs/${fileName}`;

    const delayBeforeTransitionMs = imageIndex * intervalMs;
    const dynamicStyles: Partial<CSSStyleDeclaration> = {
      backgroundImage: `url(${filePath})`,
      transform: `translateX(${this.isBackgroundShown ? 0 : -100}%)`,
      transition: `transform ${durationMs}ms ease-in-out ${delayBeforeTransitionMs}ms`,
    };
    return dynamicStyles;
  }
}
