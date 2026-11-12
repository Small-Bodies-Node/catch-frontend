import { Injectable } from '@angular/core';
import { concat, defer, from, Observable, of } from 'rxjs';
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
  blob: Blob;
  kind?: 'preview' | 'fits';
  createdAtMs: number;
}

interface NetworkTask {
  url: string;
  signal?: AbortSignal;
  queuedAbort?: () => void;
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
  private readonly persistentCacheName = 'catch-image-view-v3';
  private readonly maxMemoryEntries = 600;
  private readonly maxPersistentEntries = 1500;

  private readonly memoryCache = new Map<string, MemoryCacheEntry>();
  private readonly inFlightLoads = new Map<
    string,
    { load$: Observable<ThumbnailLoadResult>; controller: AbortController; promote: () => void }
  >();
  private readonly queueBuckets = new Map<string, QueueBucket>();
  private queueGeneration = 0;
  private refreshId = 0;

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

    return new Observable((subscriber) => {
      // A caller releases only its own subscription. The shared load owns the fetch signal.
      const abort = () => {
        subscriber.next(
          this.createErrorState(normalizedRequest, policy, 'Image request canceled.'),
        );
        subscriber.complete();
      };
      normalizedRequest.signal?.addEventListener('abort', abort, { once: true });
      if (normalizedRequest.signal?.aborted) {
        abort();
      } else {
        concat(
          of(loadingState),
          defer(() => this.getLoadResult$(normalizedRequest, policy)),
        ).subscribe(subscriber);
      }
      return () => normalizedRequest.signal?.removeEventListener('abort', abort);
    });
  }

  resetQueues(): void {
    this.queueGeneration++;
    this.inFlightLoads.forEach((load) => load.controller.abort());
    this.inFlightLoads.clear();

    for (const bucket of this.queueBuckets.values()) {
      if (bucket.timerId) {
        clearTimeout(bucket.timerId);
        bucket.timerId = undefined;
      }

      const canceledTasks = bucket.queue.splice(0);
      canceledTasks.forEach((task) => {
        if (task.queuedAbort) task.signal?.removeEventListener('abort', task.queuedAbort);
        task.reject(new Error('Thumbnail request canceled.'));
      });
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
    const resourceUrl = getThumbnailCacheKey(request.url);
    const cacheKey = new URL(
      resourceUrl,
      typeof window === 'undefined' ? 'https://catch.local' : window.location.href,
    ).href;
    const generation = this.queueGeneration;
    const memoryHit = request.forceRefresh ? undefined : this.getMemoryCacheHit(cacheKey, policy);
    if (memoryHit) {
      return of(memoryHit);
    }

    const inFlightKey = request.forceRefresh
      ? `${cacheKey}|generation:${this.queueGeneration}|force:${++this.refreshId}`
      : `${cacheKey}|generation:${this.queueGeneration}`;
    const existingLoad = this.inFlightLoads.get(inFlightKey);
    if (existingLoad && !existingLoad.controller.signal.aborted) {
      if (request.priority === 'high') existingLoad.promote();
      return existingLoad.load$;
    }

    const controller = new AbortController();
    const sharedRequest = { ...request, signal: controller.signal };
    const load$ = defer(() =>
      from(this.resolveImage(sharedRequest, policy, cacheKey, generation)),
    ).pipe(
      finalize(() => {
        // Unsubscribing the last consumer must also cancel queued work and native fetch().
        controller.abort();
        if (this.inFlightLoads.get(inFlightKey)?.load$ === load$)
          this.inFlightLoads.delete(inFlightKey);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.inFlightLoads.set(inFlightKey, {
      load$,
      controller,
      promote: () => {
        // Selection may share a thumbnail queued before it became the active row.
        // Preserve that one request while moving it ahead of background thumbnails.
        sharedRequest.priority = 'high';
        this.promoteQueuedRequest(resourceUrl, controller.signal);
      },
    });
    return load$;
  }

  private promoteQueuedRequest(url: string, signal?: AbortSignal): void {
    for (const bucket of this.queueBuckets.values()) {
      const index = bucket.queue.findIndex((task) => task.url === url && task.signal === signal);
      if (index < 0) continue;
      const [task] = bucket.queue.splice(index, 1);
      task.priority = 'high';
      bucket.queue.unshift(task);
    }
  }

  private async resolveImage(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
    generation: number,
  ): Promise<ThumbnailLoadResult> {
    try {
      this.assertCurrentGeneration(generation);
      if (request.signal?.aborted) throw new DOMException('Image request canceled.', 'AbortError');
      if (!request.forceRefresh) {
        const persistentCacheHit = await this.getPersistentCacheHit(
          request,
          policy,
          cacheKey,
          generation,
        );
        this.assertCurrentGeneration(generation);
        request.signal?.throwIfAborted();
        if (persistentCacheHit) return persistentCacheHit;
      }
      const blob = await this.fetchBlobFromNetwork(request, policy, generation);
      this.assertCurrentGeneration(generation);
      request.signal?.throwIfAborted();
      const successState = this.storeBlobInMemory(request, policy, cacheKey, blob, 'network');
      void this.writePersistentCache(policy, cacheKey, blob, generation);
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
      blob: entry.blob,
      loadedFrom: 'memory',
    };
  }

  private async getPersistentCacheHit(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
    generation: number,
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
      this.assertCurrentGeneration(generation);
      request.signal?.throwIfAborted();
      return this.storeBlobInMemory(request, policy, cacheKey, blob, 'persistent-cache');
    } catch (_) {
      return undefined;
    }
  }

  private async writePersistentCache(
    policy: ThumbnailSourcePolicy,
    cacheKey: string,
    blob: Blob,
    generation: number,
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
      if (generation !== this.queueGeneration) return;
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
      blob,
      kind: request.kind,
      createdAtMs: Date.now(),
    });
    this.trimMemoryCache();

    return {
      status: 'success',
      originalUrl: request.url,
      bucketId: policy.bucketId,
      objectUrl,
      blob,
      loadedFrom,
    };
  }

  private async fetchBlobFromNetwork(
    request: ThumbnailImageRequest,
    policy: ThumbnailSourcePolicy,
    generation: number,
  ): Promise<Blob> {
    const candidateUrls =
      request.kind === 'fits'
        ? [getThumbnailCacheKey(request.url)]
        : getThumbnailCandidateUrls(request.url);
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < 3; attempt++) {
      this.assertCurrentGeneration(generation);
      const url = candidateUrls[0];
      if (request.signal?.aborted) throw new DOMException('Image request canceled.', 'AbortError');
      try {
        return await this.enqueueNetworkFetch({
          url,
          signal: request.signal,
          label: request.label ?? request.url,
          priority: request.priority ?? 'normal',
          policy,
        });
      } catch (error) {
        this.assertCurrentGeneration(generation);
        lastError = asError(error);
        // Abort, permanent HTTP errors and malformed content do not retry.
        if (
          lastError.name === 'AbortError' ||
          lastError.message.startsWith('Empty ') ||
          (lastError.message.startsWith('HTTP ') &&
            !/^HTTP (429|502|503|504)$/.test(lastError.message))
        )
          break;
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
      }
    }

    throw lastError ?? new Error('Thumbnail request failed.');
  }

  private enqueueNetworkFetch(taskInput: {
    url: string;
    signal?: AbortSignal;
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
      if (task.signal?.aborted) {
        reject(new DOMException('Image request canceled.', 'AbortError'));
        return;
      }
      task.queuedAbort = () => {
        const index = bucket.queue.indexOf(task);
        if (index >= 0) bucket.queue.splice(index, 1);
        reject(new DOMException('Image request canceled.', 'AbortError'));
      };
      task.signal?.addEventListener('abort', task.queuedAbort, { once: true });

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
    if (task.queuedAbort) task.signal?.removeEventListener('abort', task.queuedAbort);
    const abort = () => controller.abort();
    task.signal?.addEventListener('abort', abort, { once: true });
    if (task.signal?.aborted) controller.abort();
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
        task.signal?.removeEventListener('abort', abort);
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
    const fitsEntries = Array.from(this.memoryCache).filter(([, entry]) => entry.kind === 'fits');
    for (const [key, entry] of fitsEntries.slice(0, Math.max(0, fitsEntries.length - 3))) {
      URL.revokeObjectURL(entry.objectUrl);
      this.memoryCache.delete(key);
    }
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

  private assertCurrentGeneration(generation: number): void {
    if (generation !== this.queueGeneration) throw new Error('Image request canceled.');
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
