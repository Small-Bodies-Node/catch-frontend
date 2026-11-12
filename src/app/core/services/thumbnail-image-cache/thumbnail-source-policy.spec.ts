import { getThumbnailSourcePolicy } from './thumbnail-source-policy';
describe('physical image server capacity', () => {
  it('bypasses persistent previews locally while retaining production capacity limits', () => {
    const request = { url: 'https://sbnsurveys.astro.umd.edu/api/images/id?format=jpeg' };
    const local = getThumbnailSourcePolicy(request, true);
    const deployed = getThumbnailSourcePolicy(request, false);
    expect(local.usePersistentCache).toBeFalse();
    expect(deployed.usePersistentCache).toBeTrue();
    expect(local.bucketId).toBe(deployed.bucketId);
    expect(local.maxConcurrent).toBe(deployed.maxConcurrent);
  });
  it('shares the UMD limit between surveys and SkyMapper preview normalization', () => {
    const atlas = getThumbnailSourcePolicy({
      url: 'https://sbnsurveys.astro.umd.edu/api/images/atlas?format=jpeg',
      source: 'atlas',
    });
    const neat = getThumbnailSourcePolicy({
      url: 'https://sbnsurveys.astro.umd.edu/api/images/neat?format=fits',
      kind: 'fits',
    });
    const sky = getThumbnailSourcePolicy({
      url: 'https://api.skymapper.nci.org.au/public/siap/dr4/get_image',
      source: 'skymapper_dr4',
    });
    const ps1 = getThumbnailSourcePolicy({
      url: 'https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?format=png',
    });
    expect(atlas.bucketId).toBe(neat.bucketId);
    expect(sky.bucketId).toBe(atlas.bucketId);
    expect(ps1.bucketId).toBe(atlas.bucketId);
    expect(atlas.maxConcurrent).toBe(2);
    expect(neat.usePersistentCache).toBeFalse();
  });
  it('keeps original SkyMapper FITS on the upstream bucket', () => {
    expect(
      getThumbnailSourcePolicy({
        url: 'https://api.skymapper.nci.org.au/public/siap/dr4/get_image',
        kind: 'fits',
      }).bucketId,
    ).toBe('skymapper');
  });
  it('shares the AWS limit across its surveys', () => {
    expect(
      getThumbnailSourcePolicy({
        url: 'https://uxzqjwo0ye.execute-api.us-east-1.amazonaws.com/cutout',
        source: 'catalina',
      }).bucketId,
    ).toBe('aws');
  });
});
