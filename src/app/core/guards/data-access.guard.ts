import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { SiteBannerService } from '../services/site-banner/site-banner.service';

export const dataAccessGuard: CanActivateFn = () => {
  const router = inject(Router);
  const siteBannerService = inject(SiteBannerService);

  return siteBannerService
    .getBanner()
    .pipe(map((banner) => (banner.isDataAccessDisabled ? router.createUrlTree(['/']) : true)));
};
