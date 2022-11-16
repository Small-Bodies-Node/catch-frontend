import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './components/home-page/home-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { ApisPageComponent } from './components/apis-page/apis-page.component';

const routes: Routes = [
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
    path: 'dataXXX',
    component: SettingsPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'data',
    loadChildren: () => import('./data/data.module').then((m) => m.DataModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
