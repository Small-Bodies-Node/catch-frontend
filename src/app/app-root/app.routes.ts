import { Routes } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';
import { DataPageComponent } from '../pages/data-page/data-page.component';

const pageLinks = [
  '',
  'home',
  'about',
  'apis',
  'contact',
  'dashboard',
  'terms',
  'data',
  'game',
] as const;

export type TPageLink = (typeof pageLinks)[number];

interface ILinkedRoute {
  path: TPageLink | '**';
  component?: ComponentType<any>;
  pathMatch?: 'full';
  redirectTo?: string;
  loadChildren?: () => Promise<any>;
  data?: { preload: true | false };
}

export const routes: Routes | ILinkedRoute[] = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('../pages/about-page/about-page.component').then((m) => m.AboutPageComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('../pages/game-page/game-page.component').then((m) => m.GamePageComponent),
  },
  {
    path: 'apis',
    loadComponent: () =>
      import('../pages/apis-page/apis-page.component').then((m) => m.ApisPageComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('../pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('../pages/terms-page/terms-page.component').then((m) => m.TermsPageComponent),
  },
  {
    path: 'data',
    loadComponent: () =>
      import('../pages/data-page/data-page.component').then((m) => m.DataPageComponent),
  },
  { path: '**', redirectTo: '' },
];
