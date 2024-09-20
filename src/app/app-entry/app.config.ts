import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import * as ApiDataEffects from '../ngrx/effects/api-data.effects';
import * as NavigationEffects from '../ngrx/effects/navigation.effects';
import * as ObjectNameMatchEffects from '../ngrx/effects/object-name-match.effects';
import * as ScreenDeviceEffects from '../ngrx/effects/screen-device.effects';
import * as SiteSettingsEffects from '../ngrx/effects/site-settings.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    // NGRX
    provideStore(),
    provideEffects(
      ApiDataEffects,
      NavigationEffects,
      ObjectNameMatchEffects,
      ScreenDeviceEffects,
      SiteSettingsEffects
    ),
  ],
};
