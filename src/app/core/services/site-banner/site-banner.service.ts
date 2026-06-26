import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

export type SiteBannerLevel = 'info' | 'warning' | 'error';

export interface SiteBanner {
  enabled: boolean;
  level: SiteBannerLevel;
  message: string;
  startsAt?: string;
  expiresAt?: string;
  isDataAccessDisabled: boolean;
}

const DEFAULT_SITE_BANNER: SiteBanner = {
  enabled: false,
  level: 'warning',
  message: '',
  isDataAccessDisabled: false,
};

const SITE_BANNER_LEVELS = new Set<SiteBannerLevel>(['info', 'warning', 'error']);

@Injectable({
  providedIn: 'root',
})
export class SiteBannerService {
  private readonly banner$: Observable<SiteBanner>;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.banner$ = isPlatformBrowser(this.platformId)
      ? this.httpClient.get<Partial<SiteBanner>>('/api/site-banner').pipe(
          map((banner) => normalizeSiteBanner(banner)),
          catchError((error) => {
            console.error('[CATCH site banner] Failed to load runtime banner config:', error);
            return of(DEFAULT_SITE_BANNER);
          }),
          shareReplay({ bufferSize: 1, refCount: true }),
        )
      : of(DEFAULT_SITE_BANNER);
  }

  getBanner(): Observable<SiteBanner> {
    return this.banner$;
  }
}

export function normalizeSiteBanner(banner: Partial<SiteBanner> | null | undefined): SiteBanner {
  const message = typeof banner?.message === 'string' ? banner.message.trim() : '';
  const level =
    typeof banner?.level === 'string' && SITE_BANNER_LEVELS.has(banner.level)
      ? banner.level
      : DEFAULT_SITE_BANNER.level;
  const startsAt = typeof banner?.startsAt === 'string' ? banner.startsAt.trim() : '';
  const expiresAt = typeof banner?.expiresAt === 'string' ? banner.expiresAt.trim() : '';

  return {
    enabled: !!banner?.enabled && !!message,
    level,
    message,
    ...(startsAt ? { startsAt } : {}),
    ...(expiresAt ? { expiresAt } : {}),
    isDataAccessDisabled: !!banner?.isDataAccessDisabled,
  };
}
