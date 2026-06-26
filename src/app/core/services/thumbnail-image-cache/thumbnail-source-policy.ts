import { ThumbnailImageRequest, ThumbnailSourcePolicy } from './thumbnail-image.types';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TTL_MS = 7 * ONE_DAY_MS;

const DEFAULT_POLICY: ThumbnailSourcePolicy = {
  bucketId: 'default',
  maxConcurrent: 6,
  minStartDelayMs: 75,
  requestTimeoutMs: 30_000,
  persistentTtlMs: DEFAULT_TTL_MS,
  usePersistentCache: true,
};

const POLICY_BY_BUCKET: Record<string, ThumbnailSourcePolicy> = {
  atlas: {
    ...DEFAULT_POLICY,
    bucketId: 'atlas',
    maxConcurrent: 2,
    minStartDelayMs: 300,
  },
  catalina: {
    ...DEFAULT_POLICY,
    bucketId: 'catalina',
    maxConcurrent: 4,
    minStartDelayMs: 150,
  },
  neat: {
    ...DEFAULT_POLICY,
    bucketId: 'neat',
    maxConcurrent: 4,
    minStartDelayMs: 150,
  },
  panstarrs: {
    ...DEFAULT_POLICY,
    bucketId: 'panstarrs',
    maxConcurrent: 8,
    minStartDelayMs: 50,
  },
  skymapper: {
    ...DEFAULT_POLICY,
    bucketId: 'skymapper',
    maxConcurrent: 3,
    minStartDelayMs: 200,
  },
};

export function getThumbnailSourcePolicy(request: ThumbnailImageRequest): ThumbnailSourcePolicy {
  const keyText = [request.source, request.sourceName, request.url]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase();

  if (keyText.includes('atlas')) {
    return POLICY_BY_BUCKET['atlas'];
  }

  if (keyText.includes('skymapper')) {
    return POLICY_BY_BUCKET['skymapper'];
  }

  if (keyText.includes('neat')) {
    return POLICY_BY_BUCKET['neat'];
  }

  if (keyText.includes('catalina') || keyText.includes('uxzqjwo0ye')) {
    return POLICY_BY_BUCKET['catalina'];
  }

  if (keyText.includes('panstarrs') || keyText.includes('ps1dr2')) {
    return POLICY_BY_BUCKET['panstarrs'];
  }

  return DEFAULT_POLICY;
}

export const thumbnailSourcePoliciesForTesting = {
  defaultPolicy: DEFAULT_POLICY,
  policyByBucket: POLICY_BY_BUCKET,
};
