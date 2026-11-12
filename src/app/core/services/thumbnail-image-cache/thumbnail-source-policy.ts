import { ThumbnailImageRequest, ThumbnailSourcePolicy } from './thumbnail-image.types';
import { environment } from '../../../../environments/environment.local';

const DEFAULT_POLICY: ThumbnailSourcePolicy = {
  bucketId: 'default',
  maxConcurrent: 3,
  minStartDelayMs: 150,
  requestTimeoutMs: 45_000,
  persistentTtlMs: 7 * 86400_000,
  usePersistentCache: true,
};
const POLICY_BY_BUCKET: Record<string, ThumbnailSourcePolicy> = {
  umd: { ...DEFAULT_POLICY, bucketId: 'umd', maxConcurrent: 2, minStartDelayMs: 300 },
  aws: { ...DEFAULT_POLICY, bucketId: 'aws', maxConcurrent: 4 },
  panstarrs: { ...DEFAULT_POLICY, bucketId: 'panstarrs', maxConcurrent: 8, minStartDelayMs: 50 },
  skymapper: { ...DEFAULT_POLICY, bucketId: 'skymapper', maxConcurrent: 3, minStartDelayMs: 200 },
};

export function getThumbnailSourcePolicy(
  request: ThumbnailImageRequest,
  localImages = environment.localImageService === true,
): ThumbnailSourcePolicy {
  // Surveys sharing a server share its capacity limit, including metadata/FITS.
  const url = request.url.toLowerCase();
  const text = `${request.source ?? ''} ${request.sourceName ?? ''} ${url}`.toLowerCase();
  const bucket =
    url.includes('sbnsurveys.astro.umd.edu') ||
    ((text.includes('skymapper') ||
      url.includes('/api/image-preview/') ||
      url.includes('ps1images')) &&
      request.kind !== 'fits')
      ? 'umd'
      : url.includes('uxzqjwo0ye.')
        ? 'aws'
        : text.includes('skymapper')
          ? 'skymapper'
          : text.includes('panstarrs') || text.includes('ps1dr2') || url.includes('ps1images')
            ? 'panstarrs'
            : 'default';
  const policy = POLICY_BY_BUCKET[bucket] ?? DEFAULT_POLICY;
  // A development session must not reuse previews rendered by an earlier checkout.
  return request.kind === 'fits' || localImages ? { ...policy, usePersistentCache: false } : policy;
}
export const thumbnailSourcePoliciesForTesting = {
  defaultPolicy: DEFAULT_POLICY,
  policyByBucket: POLICY_BY_BUCKET,
};
