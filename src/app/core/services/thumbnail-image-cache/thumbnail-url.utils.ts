import { environment } from '../../../../environments/environment.local';
import { localImageUrl } from '../../../../utils/localImageUrl';

/** Provider capabilities, shared by thumbnails, previews and preview metadata. */
export function normalizeThumbnailUrl(value: string): string {
  const url = value.trim();
  let parsed: URL;
  try {
    parsed = new URL(url, 'https://catch.local');
  } catch {
    return url;
  }
  if (
    parsed.hostname === 'ps1images.stsci.edu' &&
    parsed.pathname === '/cgi-bin/fitscut.cgi' &&
    ['jpeg', 'jpg', 'png'].includes(parsed.searchParams.get('format')?.toLowerCase() ?? '')
  ) {
    const image = parsed.searchParams.get('red');
    const ra = parsed.searchParams.get('ra'),
      dec = parsed.searchParams.get('dec'),
      size = parsed.searchParams.get('size');
    if (
      image &&
      ra &&
      dec &&
      size &&
      !parsed.searchParams.has('green') &&
      !parsed.searchParams.has('blue')
    ) {
      return `/api/image-preview/panstarrs?${new URLSearchParams({ image, ra, dec, size, renderer: 'north-up-v1' })}`;
    }
  }
  if (
    parsed.hostname === 'api.skymapper.nci.org.au' &&
    parsed.pathname === '/public/siap/dr4/get_image'
  ) {
    const params = new Map(
      Array.from(parsed.searchParams, ([key, value]) => [key.toUpperCase(), value]),
    );
    if (params.get('FORMAT')?.toLowerCase() === 'fits') return url;
    const position = params.get('POS')?.split(',');
    if (!position || position.length !== 2 || !params.get('IMAGE') || !params.get('SIZE'))
      return url;
    const query = new URLSearchParams({
      image: params.get('IMAGE')!,
      ra: position[0],
      dec: position[1],
      size: params.get('SIZE')!,
      renderer: 'north-up-v1',
    });
    return `/api/image-preview/skymapper?${query}`;
  }
  return localImageUrl(withAlignParam(url), environment.localImageService === true);
}

export function withAlignParam(url: string): string {
  const parsed = new URL(url, 'https://catch.local');
  const isUmd = parsed.hostname === 'sbnsurveys.astro.umd.edu';
  const isAws =
    parsed.hostname.startsWith('uxzqjwo0ye.') && parsed.hostname.endsWith('.amazonaws.com');
  if (!(isUmd || isAws)) return url;
  const format = parsed.searchParams.get('format')?.toLowerCase();
  if (!['jpeg', 'jpg', 'png'].includes(format ?? '')) return url;
  parsed.searchParams.set('align', 'true');
  parsed.searchParams.set('renderer', 'north-up-v1');
  return parsed.href;
}

export function getThumbnailCacheKey(url: string): string {
  return normalizeThumbnailUrl(url);
}

export function getThumbnailCandidateUrls(url: string): string[] {
  // Old CloudFront filenames identify previews rendered before alignment worked.
  return [normalizeThumbnailUrl(url)];
}

export function getCatalinaCacheCandidateUrl(_url: string): null {
  return null;
}
