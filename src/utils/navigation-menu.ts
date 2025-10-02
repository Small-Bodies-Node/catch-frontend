import { TPageLink } from '../app/app-root/app.routes';

export interface IMenuItem {
  icon: string;
  label: string;
  route: TPageLink;
}

export const NAVIGATION_MENU_ITEMS: IMenuItem[] = [
  { icon: 'home', label: 'Home', route: 'home' },
  { icon: 'info', label: 'About', route: 'about' },
  { icon: 'sync_alt', label: 'APIs', route: 'apis' },
  { icon: 'pie_chart', label: 'Dashboard', route: 'dashboard' },
  // { icon: 'toys', label: 'Game', route: 'game' },
  { icon: 'mail', label: 'Contact', route: 'contact' },
  // { icon: 'settings', label: 'Settings', route: 'settings' },
];
