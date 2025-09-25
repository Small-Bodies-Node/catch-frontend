import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Home prerendered at build
  { path: '', renderMode: RenderMode.Prerender },

  // Prerender page with server fallback
  // {
  //   path: 'users-prerender',
  //   renderMode: RenderMode.Prerender,
  // },

  // About page prerendered
  { path: 'about', renderMode: RenderMode.Prerender },

  // Additional prerendered pages
  { path: 'game', renderMode: RenderMode.Prerender },
  { path: 'apis', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },

  // SSR on each request
  // { path: 'users-ssr', renderMode: RenderMode.Server },
  { path: 'dashboard', renderMode: RenderMode.Server },

  // CSR only
  // { path: 'users-csr', renderMode: RenderMode.Client },
  { path: 'data', renderMode: RenderMode.Client },

  // Fallback to SSR for anything else
  { path: '**', renderMode: RenderMode.Server },
];
