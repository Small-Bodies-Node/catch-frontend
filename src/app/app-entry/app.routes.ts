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
  },
  {
    path: 'about',
    component: AboutPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'apis',
    component: ApisPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'contact',
    component: ContactPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'data',
    loadChildren: () =>
      import('../dataDisplay/data-display.module').then(
        (m) => m.DataDisplayModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
