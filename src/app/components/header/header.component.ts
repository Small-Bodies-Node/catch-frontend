import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';

import { NAVIGATION_MENU_ITEMS, IMenuItem } from '../../../utils/navigation-menu';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { headerHeightPx } from '../../../utils/constants';
import { TPageLink } from '../../app-root/app.routes';
import { SiteBanner, SiteBannerService } from '../../core/services/site-banner/site-banner.service';
import { IAppState } from '../../ngrx/reducers';
import { selectUrl } from '../../ngrx/selectors/router.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    //
    CommonModule,
    MatToolbar,
    MatIcon,
    MatRipple,
    MatIconButton,
    MatTooltip,
  ],
})
export class HeaderComponent implements OnInit {
  // --->>>

  @Output()
  openSidenav: EventEmitter<any> = new EventEmitter();

  @Output()
  openSettings: EventEmitter<void> = new EventEmitter();

  menuItems: IMenuItem[] = [];
  readonly siteBannerAlert$: Observable<SiteBanner | null>;

  constructor(
    private delayedRouter: DelayedRouterService,
    private siteBannerService: SiteBannerService,
    private store$: Store<IAppState>,
  ) {
    this.siteBannerAlert$ = combineLatest([
      this.siteBannerService.getBanner(),
      this.store$.select(selectUrl),
    ]).pipe(map(([banner, url]) => (banner.enabled && isDataRoute(url) ? banner : null)));
  }

  ngOnInit() {
    this.menuItems = NAVIGATION_MENU_ITEMS;
  }

  _openSidenav() {
    this.openSidenav.emit();
  }

  _openSettings() {
    this.openSettings.emit();
  }

  delayedRouting(link: TPageLink) {
    this.delayedRouter.delayedRouter(link);
  }

  getMatToolbarStyles() {
    return { height: `${headerHeightPx}px` };
  }
}

function isDataRoute(url: string | undefined): boolean {
  const path = (url ?? '').split(/[?#]/, 1)[0];
  return path === '/data' || path.startsWith('/data/');
}
