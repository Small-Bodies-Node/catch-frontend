import {
  getCatalinaCacheCandidateUrl,
  getThumbnailCandidateUrls,
  normalizeThumbnailUrl,
} from './thumbnail-url.utils';

describe('thumbnail URL utilities', () => {
  it('adds the align flag while preserving URL hashes', () => {
    expect(normalizeThumbnailUrl('https://example.test/cutout.jpg?format=jpg#row')).toBe(
      'https://example.test/cutout.jpg?format=jpg&align=true#row',
    );
  });

  it('does not duplicate an existing align flag', () => {
    expect(normalizeThumbnailUrl('https://example.test/cutout.jpg?align=true')).toBe(
      'https://example.test/cutout.jpg?align=true',
    );
  });

  it('tries the Catalina CloudFront cache before the original URL', () => {
    const url = 'https://uxzqjwo0ye.example.test/cutout?format=jpeg';
    const candidates = getThumbnailCandidateUrls(url);

    expect(candidates.length).toBe(2);
    expect(candidates[0]).toContain('https://dkbhqxdnxmt7r.cloudfront.net/');
    expect(candidates[1]).toBe('https://uxzqjwo0ye.example.test/cutout?format=jpeg&align=true');
  });

  it('does not create a Catalina candidate for unrelated hosts', () => {
    expect(getCatalinaCacheCandidateUrl('https://example.test/cutout.jpg')).toBeNull();
  });
});
