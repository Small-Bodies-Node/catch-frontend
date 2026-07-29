import { getThumbnailSourcePolicy } from './thumbnail-source-policy';

describe('getThumbnailSourcePolicy', () => {
  it('uses conservative policies for known sensitive image sources', () => {
    expect(getThumbnailSourcePolicy({ url: 'https://example.test/atlas/image.jpg' }).bucketId).toBe(
      'atlas',
    );
    expect(
      getThumbnailSourcePolicy({ url: 'https://example.test/skymapper/image.jpg' }).bucketId,
    ).toBe('skymapper');
    expect(getThumbnailSourcePolicy({ url: 'https://example.test/neat/image.jpg' }).bucketId).toBe(
      'neat',
    );
  });

  it('recognizes source fields as well as URL text', () => {
    expect(
      getThumbnailSourcePolicy({
        url: 'https://example.test/image.jpg',
        source: 'ps1dr2',
        sourceName: 'PanSTARRS 1 DR2',
      }).bucketId,
    ).toBe('panstarrs');
  });

  it('routes Catalina cutout host URLs through the Catalina bucket', () => {
    expect(
      getThumbnailSourcePolicy({ url: 'https://uxzqjwo0ye.example.test/image.jpg' }).bucketId,
    ).toBe('catalina');
  });
});
