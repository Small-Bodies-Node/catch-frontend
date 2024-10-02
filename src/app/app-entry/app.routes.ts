import { Routes } from '@angular/router';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { AboutPageComponent } from '../components/about-page/about-page.component';
import { ApisPageComponent } from '../components/apis-page/apis-page.component';
import { ContactPageComponent } from '../components/contact-page/contact-page.component';
import { SettingsPageComponent } from '../components/settings-page/settings-page.component';

export const routes: Routes = [
  //
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
    data: { preload: true }, // Mark this route for pre-rendering
  },
  {
    path: 'about',
    component: AboutPageComponent,
    pathMatch: 'full',
    data: { preload: true }, // Mark this route for pre-rendering
  },
  {
    path: 'apis',
    component: ApisPageComponent,
    pathMatch: 'full',
    data: { preload: true }, // Mark this route for pre-rendering
  },
  {
    path: 'contact',
    component: ContactPageComponent,
    pathMatch: 'full',
    data: { preload: true }, // Mark this route for pre-rendering
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    pathMatch: 'full',
    data: { preload: true }, // Mark this route for pre-rendering
  },
  {
    path: 'data',
    loadChildren: () =>
      import('../data-display/data-display.module').then(
        (m) => m.DataDisplayModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
