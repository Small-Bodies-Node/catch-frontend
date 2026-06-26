import { swapRaDecInFilename } from '../../../../utils/swapRaDecInFilename';

const CATALINA_CACHE_BASE_URL = 'https://dkbhqxdnxmt7r.cloudfront.net/';

export function normalizeThumbnailUrl(url: string): string {
  return withAlignParam(url.trim());
}

export function withAlignParam(url: string): string {
  const hashIndex = url.indexOf('#');
  const urlWithoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';

  if (/[?&]align=/.test(urlWithoutHash)) {
    return url;
  }

  const separator = urlWithoutHash.includes('?') ? '&' : '?';
  return `${urlWithoutHash}${separator}align=true${hash}`;
}

export function getThumbnailCacheKey(url: string): string {
  return normalizeThumbnailUrl(url);
}

export function getThumbnailCandidateUrls(url: string): string[] {
  const normalizedUrl = normalizeThumbnailUrl(url);
  return uniqueValues([getCatalinaCacheCandidateUrl(normalizedUrl), normalizedUrl]);
}

export function getCatalinaCacheCandidateUrl(url: string): string | null {
  if (!url.includes('uxzqjwo0ye')) {
    return null;
  }

  return `${CATALINA_CACHE_BASE_URL}${convertUrlToCatalinaCacheFilename(url)}`;
}

function convertUrlToCatalinaCacheFilename(fullUrl: string): string {
  const urlWithoutHash = fullUrl.split('#')[0];
  const lastSlashIndex = urlWithoutHash.lastIndexOf('/');
  const contentAfterLastSlash =
    lastSlashIndex === -1 ? urlWithoutHash : urlWithoutHash.substring(lastSlashIndex + 1);

  let safeFilename = contentAfterLastSlash.replace(/[/:?&=.]/g, '_');
  if (/(_format_jpg|_format_jpeg)/i.test(safeFilename)) {
    safeFilename = safeFilename.replace(/_format_jpeg/i, '') + '.jpeg';
  } else if (/_format_fits/i.test(safeFilename)) {
    safeFilename = safeFilename.replace(/_format_fits/i, '') + '.fits';
  }

  return swapRaDecInFilename(safeFilename);
}

function uniqueValues(values: Array<string | null>): string[] {
  return Array.from(new Set(values.filter((value): value is string => !!value)));
}
