import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  permittedThemes,
  TPermittedTheme,
} from '../../../models/ISiteSettings';
import { IAppState } from '../../ngrx/reducers';
import {
  selectSiteSettingsEffectiveTheme,
  selectSiteSettingsIsAutoNightMode,
} from '../../ngrx/selectors/site-settings.selectors';
import {
  SiteSettingsAction_SetIsAutoNightMode,
  SiteSettingsAction_SetSiteTheme,
} from '../../ngrx/actions/site-settings.actions';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss'],
    imports: [
        CommonModule,
        //
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSlideToggleModule,
    ]
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
    this.store$.dispatch(
      SiteSettingsAction_SetSiteTheme({ theme: choice.value })
    );
  }

  getIconStyle() {
    const style = {
      color: this.selectedSiteTheme === 'DARK-THEME' ? 'white' : 'black',
    };
    return style;
  }

  onAutoNightModeToggle(event: any | MatSlideToggleChange) {
    this.store$.dispatch(
      SiteSettingsAction_SetIsAutoNightMode({ isAutoNightMode: event.checked })
    );
  }
}
