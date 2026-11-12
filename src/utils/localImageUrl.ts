/** Route owned cutouts through the development renderer, retaining the original URL. */
export function localImageUrl(value: string, enabled: boolean): string {
  if (!enabled) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }
  const owned =
    url.hostname === 'sbnsurveys.astro.umd.edu' ||
    (url.hostname.startsWith('uxzqjwo0ye.execute-api.') && url.hostname.endsWith('.amazonaws.com'));
  const format = url.searchParams.get('format')?.toLowerCase();
  if (
    url.protocol !== 'https:' ||
    !owned ||
    !url.pathname.startsWith('/api/images/') ||
    !['fits', 'jpeg', 'jpg', 'png'].includes(format ?? '')
  )
    return value;
  return `/api/local-image-preview/owned?${new URLSearchParams({ url: url.href })}`;
}
