import { Injectable } from '@angular/core';
import { concat, from, Observable, of } from 'rxjs';
import { finalize, shareReplay } from 'rxjs/operators';

import {
  ThumbnailImageRequest,
  ThumbnailImageState,
  ThumbnailLoadResult,
  ThumbnailSourcePolicy,
  ThumbnailSuccessState,
} from './thumbnail-image.types';
import { getThumbnailSourcePolicy } from './thumbnail-source-policy';
import { getThumbnailCacheKey, getThumbnailCandidateUrls } from './thumbnail-url.utils';

interface MemoryCacheEntry {
  objectUrl: string;
  createdAtMs: number;
}

interface NetworkTask {
  url: string;
  label: string;
  priority: 'high' | 'normal';
  policy: ThumbnailSourcePolicy;
  resolve: (blob: Blob) => void;
  reject: (error: Error) => void;
}

interface QueueBucket {
  activeCount: number;
  activeControllers: Set<AbortController>;
  queue: NetworkTask[];
  nextStartAtMs: number;
  timerId?: ReturnType<typeof setTimeout>;
}

@Injectable({
  providedIn: 'root',
})
export class ThumbnailImageCacheService {
  private readonly persistentCacheName = 'catch-thumbnail-image-v2';
  private readonly maxMemoryEntries = 600;
  private readonly maxPersistentEntries = 1500;

  private readonly memoryCache = new Map<string, MemoryCacheEntry>();
  private readonly inFlightLoads = new Map<string, Observable<ThumbnailLoadResult>>();
  private readonly queueBuckets = new Map<string, QueueBucket>();
  private queueGeneration = 0;

  loadImage$(request: ThumbnailImageRequest): Observable<ThumbnailImageState> {
    const normalizedRequest = {
      ...request,
      url: request.url.trim(),
      priority: request.priority ?? 'normal',
    } satisfies ThumbnailImageRequest;
    const policy = getThumbnailSourcePolicy(normalizedRequest);
    const loadingState: ThumbnailImageState = {
      status: 'loading',
      originalUrl: normalizedRequest.url,
      bucketId: policy.bucketId,
    };

    if (normalizedRequest.url.length === 0) {
      return of(this.createErrorState(normalizedRequest, policy, 'No thumbnail URL is available.'));
    }

    return concat(of(loadingState), this.getLoadResult$(normalizedRequest, policy));
  }

  resetQueues(): void {
    this.queueGeneration++;
    this.inFlightLoads.clear();

    for (const bucket of this.queueBuckets.values()) {
      if (bucket.timerId) {
        clearTimeout(bucket.timerId);
        bucket.timerId = undefined;
      }

      const canceledTasks = bucket.queue.splice(0);
      canceledTasks.forEach((task) => task.reject(new Error('Thumbnail request canceled.')));
      bucket.activeControllers.forEach((controller) => controller.abort());
    }
  }

  clearMemoryCache(): void {
    for (const entry of this.memoryCache.values()) {
      URL.revokeObjectURL(entry.objectUrl);
    }
    this.memoryCache.clear();
  }

  async clearPersistentCache(): Promise<void> {
    if (this.isPersistentCacheAvailable()) {
      await caches.delete(this.persistentCacheName);
    }
  }

  private getLoadResult$(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
  ): Observable<ThumbnailLoadResult> {
    const cacheKey = getThumbnailCacheKey(request.url);
    const memoryHit = request.forceRefresh ? undefined : this.getMemoryCacheHit(cacheKey, policy);
    if (memoryHit) {
      return of(memoryHit);
    }

    const inFlightKey = request.forceRefresh
      ? `${cacheKey}|generation:${this.queueGeneration}|force:${Date.now()}`
      : `${cacheKey}|generation:${this.queueGeneration}`;
    const existingLoad = this.inFlightLoads.get(inFlightKey);
    if (existingLoad) {
      return existingLoad;
    }

    const load$ = from(this.resolveImage(request, policy, cacheKey)).pipe(
      finalize(() => this.inFlightLoads.delete(inFlightKey)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.inFlightLoads.set(inFlightKey, load$);
    return load$;
  }

  private async resolveImage(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
  ): Promise<ThumbnailLoadResult> {
    if (!request.forceRefresh) {
      const persistentCacheHit = await this.getPersistentCacheHit(request, policy, cacheKey);
      if (persistentCacheHit) {
        return persistentCacheHit;
      }
    }

    try {
      const blob = await this.fetchBlobFromNetwork(request, policy);
      const successState = this.storeBlobInMemory(request, policy, cacheKey, blob, 'network');
      void this.writePersistentCache(policy, cacheKey, blob);
      return successState;
    } catch (error) {
      return this.createErrorState(request, policy, getErrorMessage(error));
    }
  }

  private getMemoryCacheHit(
    cacheKey: string,
    policy: ThumbnailSourcePolicy,
  ): ThumbnailSuccessState | undefined {
    const entry = this.memoryCache.get(cacheKey);
    if (!entry) {
      return undefined;
    }

    if (this.isExpired(entry.createdAtMs, policy.persistentTtlMs)) {
      URL.revokeObjectURL(entry.objectUrl);
      this.memoryCache.delete(cacheKey);
      return undefined;
    }

    this.memoryCache.delete(cacheKey);
    this.memoryCache.set(cacheKey, entry);

    return {
      status: 'success',
      originalUrl: cacheKey,
      bucketId: policy.bucketId,
      objectUrl: entry.objectUrl,
      loadedFrom: 'memory',
    };
  }

  private async getPersistentCacheHit(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
  ): Promise<ThumbnailSuccessState | undefined> {
    if (!policy.usePersistentCache || !this.isPersistentCacheAvailable()) {
      return undefined;
    }

    try {
      const cache = await caches.open(this.persistentCacheName);
      const cacheRequest = new Request(cacheKey);
      const cachedResponse = await cache.match(cacheRequest);
      if (!cachedResponse) {
        return undefined;
      }

      const cachedAtMs = Number(cachedResponse.headers.get('x-catch-thumbnail-cached-at-ms') ?? 0);
      if (!Number.isFinite(cachedAtMs) || this.isExpired(cachedAtMs, policy.persistentTtlMs)) {
        await cache.delete(cacheRequest);
        return undefined;
      }

      const blob = await cachedResponse.blob();
      return this.storeBlobInMemory(request, policy, cacheKey, blob, 'persistent-cache');
    } catch (_) {
      return undefined;
    }
  }

  private async writePersistentCache(
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
    blob: Blob,
  ): Promise<void> {
    if (!policy.usePersistentCache || !this.isPersistentCacheAvailable()) {
      return;
    }

    try {
      const headers = new Headers({
        'x-catch-thumbnail-cached-at-ms': String(Date.now()),
      });
      if (blob.type) {
        headers.set('Content-Type', blob.type);
      }

      const cache = await caches.open(this.persistentCacheName);
      await cache.put(new Request(cacheKey), new Response(blob, { headers }));
      await this.trimPersistentCache(cache);
    } catch (_) {
      // Persistent caching is a performance feature; image display should not depend on it.
    }
  }

  private storeBlobInMemory(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
    blob: Blob,
    loadedFrom: 'persistent-cache' | 'network',
  ): ThumbnailSuccessState {
    const oldEntry = this.memoryCache.get(cacheKey);
    if (oldEntry) {
      URL.revokeObjectURL(oldEntry.objectUrl);
      this.memoryCache.delete(cacheKey);
    }

    const objectUrl = URL.createObjectURL(blob);
    this.memoryCache.set(cacheKey, {
      objectUrl,
      createdAtMs: Date.now(),
    });
    this.trimMemoryCache();

    return {
      status: 'success',
      originalUrl: request.url,
      bucketId: policy.bucketId,
      objectUrl,
      loadedFrom,
    };
  }

  private async fetchBlobFromNetwork(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
  ): Promise<Blob> {
    const candidateUrls = getThumbnailCandidateUrls(request.url);
    let lastError: Error | undefined;

    for (const url of candidateUrls) {
      try {
        return await this.enqueueNetworkFetch({
          url,
          label: request.label ?? request.url,
          priority: request.priority ?? 'normal',
          policy,
        });
      } catch (error) {
        lastError = asError(error);
      }
    }

    throw lastError ?? new Error('Thumbnail request failed.');
  }

  private enqueueNetworkFetch(taskInput: {
    url: string;
    label: string;
    priority: 'high' | 'normal';
    policy: ThumbnailSourcePolicy;
  }): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const task: NetworkTask = {
        ...taskInput,
        resolve,
        reject,
      };
      const bucket = this.getQueueBucket(task.policy.bucketId);

      if (task.priority === 'high') {
        bucket.queue.unshift(task);
      } else {
        bucket.queue.push(task);
      }

      this.pumpQueue(task.policy);
    });
  }

  private pumpQueue(policy: ThumbnailSourcePolicy): void {
    const bucket = this.getQueueBucket(policy.bucketId);
    if (bucket.activeCount >= policy.maxConcurrent || bucket.queue.length === 0) {
      return;
    }

    const waitMs = Math.max(0, bucket.nextStartAtMs - Date.now());
    if (waitMs > 0) {
      if (!bucket.timerId) {
        bucket.timerId = setTimeout(() => {
          bucket.timerId = undefined;
          this.pumpQueue(policy);
        }, waitMs);
      }
      return;
    }

    while (bucket.activeCount < policy.maxConcurrent && bucket.queue.length > 0) {
      const task = bucket.queue.shift()!;
      this.startNetworkTask(bucket, task);
      bucket.nextStartAtMs = Date.now() + policy.minStartDelayMs;

      if (policy.minStartDelayMs > 0) {
        this.pumpQueue(policy);
        return;
      }
    }
  }

  private startNetworkTask(bucket: QueueBucket, task: NetworkTask): void {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), task.policy.requestTimeoutMs);
    bucket.activeCount++;
    bucket.activeControllers.add(controller);

    fetch(task.url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        if (blob.size === 0) {
          throw new Error('Empty thumbnail response.');
        }
        task.resolve(blob);
      })
      .catch((error) => task.reject(asError(error)))
      .finally(() => {
        clearTimeout(timeoutId);
        bucket.activeControllers.delete(controller);
        bucket.activeCount = Math.max(0, bucket.activeCount - 1);
        this.pumpQueue(task.policy);
      });
  }

  private getQueueBucket(bucketId: string): QueueBucket {
    const bucket = this.queueBuckets.get(bucketId);
    if (bucket) {
      return bucket;
    }

    const newBucket: QueueBucket = {
      activeCount: 0,
      activeControllers: new Set<AbortController>(),
      queue: [],
      nextStartAtMs: 0,
    };
    this.queueBuckets.set(bucketId, newBucket);
    return newBucket;
  }

  private trimMemoryCache(): void {
    while (this.memoryCache.size > this.maxMemoryEntries) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (!oldestKey) {
        return;
      }

      const oldestEntry = this.memoryCache.get(oldestKey);
      if (oldestEntry) {
        URL.revokeObjectURL(oldestEntry.objectUrl);
      }
      this.memoryCache.delete(oldestKey);
    }
  }

  private async trimPersistentCache(cache: Cache): Promise<void> {
    const requests = await cache.keys();
    const extraEntryCount = requests.length - this.maxPersistentEntries;
    if (extraEntryCount <= 0) {
      return;
    }

    await Promise.all(requests.slice(0, extraEntryCount).map((request) => cache.delete(request)));
  }

  private createErrorState(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    message: string,
  ): ThumbnailLoadResult {
    return {
      status: 'error',
      originalUrl: request.url,
      bucketId: policy.bucketId,
      message,
    };
  }

  private isExpired(createdAtMs: number, ttlMs: number): boolean {
    return Date.now() - createdAtMs > ttlMs;
  }

  private isPersistentCacheAvailable(): boolean {
    return typeof window !== 'undefined' && typeof caches !== 'undefined';
  }
}

function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error || 'Thumbnail request failed.'));
}

function getErrorMessage(error: unknown): string {
  const message = asError(error).message.trim();
  return message || 'Thumbnail request failed.';
}
