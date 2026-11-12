import { localImageUrl } from './localImageUrl';

describe('local image routing', () => {
  it('preserves original owned cutout parameters inside the local proxy URL', () => {
    const source =
      'https://sbnsurveys.astro.umd.edu/api/images/urn:nasa:pds:example?ra=10&dec=20&size=5arcmin&format=jpeg&align=true';
    const local = new URL(localImageUrl(source, true), 'http://localhost:4000');
    expect(local.pathname).toBe('/api/local-image-preview/owned');
    expect(local.searchParams.get('url')).toBe(source);
    expect(localImageUrl(local.pathname + local.search, true)).toBe(local.pathname + local.search);
  });

  it('routes matching native science through the same local cache', () => {
    const source =
      'https://uxzqjwo0ye.execute-api.us-west-1.amazonaws.com/api/images/id?format=fits&size=720';
    expect(localImageUrl(source, true)).toContain('/api/local-image-preview/owned?');
    expect(localImageUrl(source, false)).toBe(source);
  });

  it('preserves unrelated hosts, API routes, formats, and disabled-mode URLs', () => {
    for (const source of [
      'https://sbnsurveys.astro.umd.edu/api/labels/id?format=jpeg',
      'https://sbnsurveys.astro.umd.edu/api/images/id?format=label',
      'https://images.example/api/images/id?format=fits',
      'https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?format=fits',
      '/api/image-preview/skymapper?image=123',
    ])
      expect(localImageUrl(source, true)).toBe(source);
    const owned = 'https://sbnsurveys.astro.umd.edu/api/images/id?format=jpeg';
    expect(localImageUrl(owned, false)).toBe(owned);
  });
});
