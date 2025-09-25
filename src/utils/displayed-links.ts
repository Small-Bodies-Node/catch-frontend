export interface DisplayLink {
  label: string;
  path: string;
  exact?: boolean;
  requiresAuth?: boolean;
  requiresUnauth?: boolean;
  requiresAdmin?: boolean;
}

export const displayedLinks: DisplayLink[] = [
  { label: 'Home', path: '/', exact: true },
  { label: 'About', path: '/about' },
  // { label: 'Users CSR', path: '/users-csr' },
  // { label: 'Users SSR', path: '/users-ssr' },
  // { label: 'Users Prerender', path: '/users-prerender' },
  // Auth-conditional links
  // { label: 'Admin', path: '/admin', requiresAuth: true, requiresAdmin: true },
  // { label: 'Login', path: '/login', requiresUnauth: true },
  // { label: 'Sign up', path: '/signup', requiresUnauth: true },
];
