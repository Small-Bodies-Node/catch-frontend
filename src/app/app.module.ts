// Standard modules
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

// NGRX Modules
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// My Modules
import { AppRoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';

// Core Components
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ApisPageComponent } from './components/apis-page/apis-page.component';
import { AppEntryComponent } from './components/app-entry/app-entry.component';
import { BackgroundComponent } from './components/background/background.component';
import { CometAnimationsComponent } from './components/comet-animations/comet-animations.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TermsPageComponent } from './components/terms-page/terms-page.component';
import { UnrecognizedNameDialogComponent } from './components/search-field/unrecognized-name-dialog.component';

// My NGRX Stuff
import { ApiEffects } from './ngrx/effects/api.effects';
import { NavigationEffects } from './ngrx/effects/navigation.effects';
import { ObjectNameMatchEffects } from './ngrx/effects/object-name-match.effects';
import { SiteSettingsEffects } from './ngrx/effects/site-settings.effects';
import { ScreenDeviceEffects } from './ngrx/effects/screen-device.effects';
import { reducers } from './ngrx/reducers';

// My Misc
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { ApiService } from './core/services/api/api.service';
import { ApiMockService } from './core/services/api/api-mock.service';
import { NgxJs9Module } from 'projects/ngx-js9/src/public-api';
import { StreamingMessagesComponent } from './components/streaming-messages/streaming-messages.component';
import { ObjectNameMatchService } from './core/services/object-name-match/object-name-match.service';
import { ObjectNameMatchMockService } from './core/services/object-name-match/object-name-match-mock.service';

export const isMockDataUsed = !false && environment.apiData === 'mock';
// console.log('Env Details: ', environment);
// export const isMockDataUsed = true;
// export const apiData = environment.apiData;

// console.log(environment);

@NgModule({
  declarations: [
    AboutPageComponent,
    ApisPageComponent,
    AppEntryComponent,
    BackgroundComponent,
    CometAnimationsComponent,
    ContactPageComponent,
    HeaderComponent,
    HomePageComponent,
    SettingsPageComponent,
    SidenavComponent,
    TermsPageComponent,
    FooterComponent,
    SearchFieldComponent,
    UnrecognizedNameDialogComponent,
    StreamingMessagesComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxJs9Module,
    CoreModule,
    //
    // NGRX: enable effects
    //
    EffectsModule.forRoot([
      //
      SiteSettingsEffects,
      NavigationEffects,
      ObjectNameMatchEffects,
      ApiEffects,
      ScreenDeviceEffects,
    ]),
    //
    // NGRX: enable store
    //
    StoreModule.forRoot(reducers),
    //
    // NGRX: enable dev tools
    //
    !!environment.production ? [] : StoreDevtoolsModule.instrument(),
    //
    // NGRX: dispatch actions on routing events
    //
    // StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    /**
     * Use mock data in development
     */
    {
      provide: ApiService,
      useClass: isMockDataUsed ? ApiMockService : ApiService,
    },
    {
      provide: ObjectNameMatchService,
      useClass: isMockDataUsed
        ? ObjectNameMatchMockService
        : ObjectNameMatchService,
    },
  ],
  bootstrap: [AppEntryComponent],
})
export class AppModule {}
