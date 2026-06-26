import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import { selectUrl } from '../../ngrx/selectors/router.selectors';
import { SiteBanner, SiteBannerService } from '../../core/services/site-banner/site-banner.service';

interface SiteBannerViewModel {
  banner: SiteBanner;
  isHomeRoute: boolean;
}

@Component({
  selector: 'app-site-banner',
  standalone: true,
  templateUrl: './site-banner.component.html',
  styleUrls: ['./site-banner.component.scss'],
  imports: [AsyncPipe, MatIcon],
})
export class SiteBannerComponent {
  readonly viewModel$: Observable<SiteBannerViewModel>;

  constructor(
    private siteBannerService: SiteBannerService,
    private store$: Store<IAppState>,
  ) {
    this.viewModel$ = combineLatest([
      this.siteBannerService.getBanner(),
      this.store$.select(selectUrl),
    ]).pipe(
      map(([banner, url]) => ({
        banner,
        isHomeRoute: isHomeRoute(url),
      })),
    );
  }

  getIconName(level: SiteBanner['level']): string {
    switch (level) {
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
    }
  }
}

function isHomeRoute(url: string | undefined): boolean {
  const path = (url ?? '/').split(/[?#]/, 1)[0];
  return path === '/' || path === '/home';
}
