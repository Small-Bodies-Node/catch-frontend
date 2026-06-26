import { Request, Response } from 'express';

export type SiteBannerLevel = 'info' | 'warning' | 'error';

export interface SiteBannerResponse {
  enabled: boolean;
  level: SiteBannerLevel;
  message: string;
  startsAt?: string;
  expiresAt?: string;
  isDataAccessDisabled: boolean;
}

const DEFAULT_LEVEL: SiteBannerLevel = 'warning';
const SITE_BANNER_LEVELS = new Set<SiteBannerLevel>(['info', 'warning', 'error']);

export const siteBanner = async (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(getSiteBannerFromEnv(process.env));
};

export function getSiteBannerFromEnv(env: NodeJS.ProcessEnv): SiteBannerResponse {
  const message = getTrimmedValue(env['CATCH_SITE_BANNER_MESSAGE']);
  const startsAt = getTrimmedValue(env['CATCH_SITE_BANNER_STARTS_AT']);
  const expiresAt = getTrimmedValue(env['CATCH_SITE_BANNER_EXPIRES_AT']);
  const isInActiveWindow = hasStarted(startsAt) && !isExpired(expiresAt);

  return {
    enabled: !!message && isInActiveWindow,
    level: getBannerLevel(env['CATCH_SITE_BANNER_LEVEL']),
    message,
    ...(startsAt ? { startsAt } : {}),
    ...(expiresAt ? { expiresAt } : {}),
    isDataAccessDisabled: getBooleanValue(env['CATCH_DATA_ACCESS_DISABLED']) && isInActiveWindow,
  };
}

function getBannerLevel(value: string | undefined): SiteBannerLevel {
  const level = getTrimmedValue(value).toLowerCase();
  return SITE_BANNER_LEVELS.has(level as SiteBannerLevel)
    ? (level as SiteBannerLevel)
    : DEFAULT_LEVEL;
}

function getTrimmedValue(value: string | undefined): string {
  return value?.trim() ?? '';
}

function getBooleanValue(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(getTrimmedValue(value).toLowerCase());
}

function hasStarted(startsAt: string): boolean {
  if (!startsAt) {
    return true;
  }

  const startsAtMs = Date.parse(startsAt);
  return !Number.isFinite(startsAtMs) || startsAtMs <= Date.now();
}

function isExpired(expiresAt: string): boolean {
  if (!expiresAt) {
    return false;
  }

  const expiresAtMs = Date.parse(expiresAt);
  return Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now();
}
