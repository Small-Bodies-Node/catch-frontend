import { getThumbnailCandidateUrls, normalizeThumbnailUrl } from './thumbnail-url.utils';

describe('preview provider URLs', () => {
  it('changes alignment only for owned browse endpoints and invalidates old views', () => {
    const url = normalizeThumbnailUrl(
      'https://sbnsurveys.astro.umd.edu/api/images/id?format=jpeg&align=false#row',
    );
    const parsed = new URL(url);
    expect(parsed.searchParams.get('align')).toBe('true');
    expect(parsed.searchParams.get('renderer')).toBe('north-up-v1');
    expect(parsed.hash).toBe('#row');
    expect(normalizeThumbnailUrl(url)).toBe(url);
  });
  it('preserves scientific FITS and external URLs exactly', () => {
    for (const url of [
      'https://sbnsurveys.astro.umd.edu/api/images/id?format=fits',
      'https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?format=jpg&size=1200',
      'https://images.example/generated.png',
    ])
      expect(normalizeThumbnailUrl(url)).toBe(url);
  });
  it('pairs SkyMapper IMAGE/POS/SIZE on the normalization adapter', () => {
    const url = normalizeThumbnailUrl(
      'https://api.skymapper.nci.org.au/public/siap/dr4/get_image?IMAGE=20180516174436-12&SIZE=0.0833&POS=344.31182,-16.20253&FORMAT=png',
    );
    const parsed = new URL(url, 'https://catch.test');
    expect(parsed.pathname).toBe('/api/image-preview/skymapper');
    expect(parsed.searchParams.get('image')).toBe('20180516174436-12');
    expect(parsed.searchParams.get('ra')).toBe('344.31182');
    expect(parsed.searchParams.get('dec')).toBe('-16.20253');
    expect(parsed.searchParams.get('size')).toBe('0.0833');
    expect(normalizeThumbnailUrl(url)).toBe(url);
  });
  it('never serves pre-alignment CloudFront objects', () => {
    const url = 'https://uxzqjwo0ye.execute-api.us-east-1.amazonaws.com/image?format=jpeg';
    expect(getThumbnailCandidateUrls(url)).toEqual([normalizeThumbnailUrl(url)]);
  });
  it('routes a single-band PS1 cutout through the exact-header adapter', () => {
    const url = normalizeThumbnailUrl(
      'https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?red=%2Frings.v3.skycell%2F1784%2F059%2Frings.v3.skycell.1784.059.wrp.g.55560_46188.fits&ra=83.63&dec=22.01&size=720&format=png',
    );
    const parsed = new URL(url, 'https://catch.test');
    expect(parsed.pathname).toBe('/api/image-preview/panstarrs');
    expect(parsed.searchParams.get('size')).toBe('720');
    expect(parsed.searchParams.get('ra')).toBe('83.63');
  });
});
