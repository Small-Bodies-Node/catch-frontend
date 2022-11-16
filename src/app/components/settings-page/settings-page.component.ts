import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IAppState } from 'src/app/ngrx/reducers';
import { permittedThemes, TPermittedTheme } from 'src/app/models/ISiteSettings';
import {
  SiteSettingsSetIsAutoNightMode,
  SiteSettingsSetSiteTheme,
} from 'src/app/ngrx/actions/site-settings.actions';
import {
  selectSiteSettingsEffectiveTheme,
  selectSiteSettingsIsAutoNightMode,
} from 'src/app/ngrx/selectors/site-settings.selectors';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  // --->>>

  subscriptions: Subscription = new Subscription();
  routeAnimationsElements = '';
  selectedSiteTheme!: TPermittedTheme;
  permittedThemes?: TPermittedTheme[];
  isAutoNightMode = false;

  constructor(private store$: Store<IAppState>) {
    this.subscriptions.add(
      this.store$
        .select(selectSiteSettingsEffectiveTheme)
        .subscribe((siteTheme) => {
          this.selectedSiteTheme = siteTheme;
          this.permittedThemes = siteTheme.includes('DARK')
            ? permittedThemes
            : permittedThemes.reverse();
        })
    );

    this.subscriptions.add(
      this.store$
        .select(selectSiteSettingsIsAutoNightMode)
        .subscribe(
          (isAutoNightMode) => (this.isAutoNightMode = isAutoNightMode)
        )
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onThemeSelect(choice: any) {
    this.store$.dispatch(new SiteSettingsSetSiteTheme({ theme: choice.value }));
  }

  getIconStyle() {
    const style = {
      color: this.selectedSiteTheme === 'DARK-THEME' ? 'white' : 'black',
    };
    return style;
  }

  onAutoNightModeToggle(event: MatSlideToggleChange) {
    this.store$.dispatch(
      new SiteSettingsSetIsAutoNightMode({ isAutoNightMode: event.checked })
    );
  }
}
