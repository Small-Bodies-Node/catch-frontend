import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { reducers } from '../ngrx/reducers';
import { provideEffects } from '@ngrx/effects';

import * as ApiDataEffects from '../ngrx/effects/api-data.effects';
import * as NavigationEffects from '../ngrx/effects/navigation.effects';
import * as ObjectNameMatchEffects from '../ngrx/effects/object-name-match.effects';
import * as ScreenDeviceEffects from '../ngrx/effects/screen-device.effects';
import * as SiteSettingsEffects from '../ngrx/effects/site-settings.effects';
import { provideRouterStore } from '@ngrx/router-store';

// Register PlotlyJS instance with angular-plotly.js once at startup via providers

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    // Plotly
    // importProvidersFrom(PlotlyModule.forRoot(PlotlyJS)),
    // NGRX
    provideRouterStore(),
    provideStore(reducers),
    provideEffects(
      ApiDataEffects,
      NavigationEffects,
      ObjectNameMatchEffects,
      ScreenDeviceEffects,
      SiteSettingsEffects,
    ),
  ],
};
