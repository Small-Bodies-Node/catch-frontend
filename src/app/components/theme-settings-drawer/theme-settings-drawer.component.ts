import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { TThemePreference, themePreferences } from '../../../models/ISiteSettings';
import { ThemeService } from '../../core/services/theme/theme.service';
import { SiteSettingsAction_SetThemePreference } from '../../ngrx/actions/site-settings.actions';
import { IAppState } from '../../ngrx/reducers';
import { selectSiteSettingsThemePreference } from '../../ngrx/selectors/site-settings.selectors';

@Component({
  selector: 'app-theme-settings-drawer',
  templateUrl: './theme-settings-drawer.component.html',
  styleUrls: ['./theme-settings-drawer.component.scss'],
  imports: [AsyncPipe, MatButtonModule, MatIconModule],
})
export class ThemeSettingsDrawerComponent {
  @Output() closeSettings = new EventEmitter<void>();

  private readonly store$ = inject<Store<IAppState>>(Store);
  private readonly themeService = inject(ThemeService);

  readonly themePreference$ = this.store$.select(selectSiteSettingsThemePreference);
  readonly effectiveTheme$ = this.themeService.effectiveTheme$;
  readonly themePreferences = themePreferences;

  setThemePreference(themePreference: TThemePreference): void {
    this.store$.dispatch(
      SiteSettingsAction_SetThemePreference({
        themePreference,
      }),
    );
  }
}
