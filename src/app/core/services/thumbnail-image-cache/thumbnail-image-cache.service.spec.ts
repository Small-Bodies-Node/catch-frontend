import { fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { lastValueFrom, take } from 'rxjs';

import { ThumbnailImageCacheService } from './thumbnail-image-cache.service';

describe('ThumbnailImageCacheService', () => {
  let service: ThumbnailImageCacheService;
  let fetchSpy: jasmine.Spy;
  let urlCounter = 0;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThumbnailImageCacheService);
    fetchSpy = spyOn(window, 'fetch').and.callFake(() =>
      Promise.resolve(
        new Response(new Blob(['thumbnail'], { type: 'image/jpeg' }), {
          status: 200,
        }),
      ),
    );
  });

  afterEach(async () => {
    service.resetQueues();
    service.clearMemoryCache();
    await service.clearPersistentCache();
  });

  it('deduplicates concurrent loads for the same thumbnail URL', async () => {
    const url = getTestUrl();
    const [firstState, secondState] = await Promise.all([
      lastValueFrom(service.loadImage$({ url })),
      lastValueFrom(service.loadImage$({ url })),
    ]);

    expect(firstState.status).toBe('success');
    expect(secondState.status).toBe('success');
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('serves later loads from memory after a thumbnail has loaded once', async () => {
    const url = getTestUrl();
    const firstState = await lastValueFrom(service.loadImage$({ url }));
    const secondState = await lastValueFrom(service.loadImage$({ url }));

    expect(firstState.status).toBe('success');
    expect(secondState.status).toBe('success');
    expect(fetchSpy.calls.count()).toBe(1);
    if (secondState.status === 'success') {
      expect(secondState.loadedFrom).toBe('memory');
    }
  });

  it('emits a retryable error state when the thumbnail request fails', async () => {
    fetchSpy.and.callFake(() => Promise.resolve(new Response('', { status: 503 })));

    const state = await lastValueFrom(service.loadImage$({ url: getTestUrl() }));

    expect(state.status).toBe('error');
  });

  function getTestUrl(): string {
    urlCounter++;
    return `https://example.test/thumbnail-${urlCounter}.jpg`;
  }

  it('does not start a request until subscribed', async () => {
    service.loadImage$({ url: getTestUrl() });
    await Promise.resolve();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shares preview bytes with metadata consumers', async () => {
    const url = getTestUrl();
    const [preview, metadata] = await Promise.all([
      lastValueFrom(service.loadImage$({ url })),
      lastValueFrom(service.loadImage$({ url, priority: 'high' })),
    ]);
    if (preview.status === 'success' && metadata.status === 'success') {
      expect(preview.blob).toBe(metadata.blob);
    } else fail('Expected shared preview bytes');
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('promotes a selected image already queued behind thumbnails without a second fetch', async () => {
    const pending = new Map<string, (response: Response) => void>();
    fetchSpy.and.callFake(
      (url: string) => new Promise<Response>((resolve) => pending.set(url, resolve)),
    );
    const urls = Array.from({ length: 5 }, getTestUrl);
    const active = urls
      .slice(0, 3)
      .map((url) => lastValueFrom(service.loadImage$({ url, kind: 'fits' })));
    const waitForCalls = async (count: number) => {
      const deadline = Date.now() + 2000;
      while (fetchSpy.calls.count() < count && Date.now() < deadline)
        await new Promise((resolve) => setTimeout(resolve, 10));
      expect(fetchSpy.calls.count()).toBe(count);
    };
    await waitForCalls(3);
    const background = lastValueFrom(service.loadImage$({ url: urls[3], kind: 'fits' }));
    const thumbnail = lastValueFrom(service.loadImage$({ url: urls[4], kind: 'fits' }));
    await new Promise((resolve) => setTimeout(resolve, 10));
    const selected = lastValueFrom(
      service.loadImage$({ url: urls[4], kind: 'fits', priority: 'high' }),
    );
    pending.get(urls[0])!(new Response(new Blob(['science'])));
    await waitForCalls(4);
    expect(fetchSpy.calls.argsFor(3)[0]).toBe(urls[4]);
    fetchSpy.and.callFake(() => Promise.resolve(new Response(new Blob(['science']))));
    pending.forEach((complete) => complete(new Response(new Blob(['science']))));
    const results = await Promise.all([...active, background, thumbnail, selected]);
    expect(results.every((state) => state.status === 'success')).toBeTrue();
    expect(fetchSpy.calls.allArgs().filter(([url]) => url === urls[4]).length).toBe(1);
    expect(fetchSpy.calls.count()).toBe(5);
  });

  it('bounds transient retries and does not retry permanent failures', async () => {
    fetchSpy.and.callFake(() => Promise.resolve(new Response('', { status: 503 })));
    await lastValueFrom(service.loadImage$({ url: getTestUrl() }));
    expect(fetchSpy.calls.count()).toBe(3);
    fetchSpy.calls.reset();
    fetchSpy.and.callFake(() => Promise.resolve(new Response('', { status: 404 })));
    await lastValueFrom(service.loadImage$({ url: getTestUrl() }));
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('aborts obsolete on-demand FITS requests', async () => {
    fetchSpy.and.callFake(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () =>
            reject(new DOMException('Canceled', 'AbortError')),
          );
        }),
    );
    const controller = new AbortController();
    const result = lastValueFrom(
      service.loadImage$({ url: getTestUrl(), kind: 'fits', signal: controller.signal }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    controller.abort();
    expect((await result).status).toBe('error');
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('rejects completion from a reset generation without retaining its bytes', async () => {
    let complete!: (response: Response) => void;
    fetchSpy.and.callFake(() => new Promise<Response>((resolve) => (complete = resolve)));
    const url = getTestUrl();
    const old = lastValueFrom(service.loadImage$({ url, kind: 'fits' }));
    await new Promise((resolve) => setTimeout(resolve, 10));
    service.resetQueues();
    complete(new Response(new Blob(['old'])));
    expect((await old).status).toBe('error');
    fetchSpy.and.callFake(() => Promise.resolve(new Response(new Blob(['new']))));
    expect((await lastValueFrom(service.loadImage$({ url, kind: 'fits' }))).status).toBe('success');
    expect(fetchSpy.calls.count()).toBe(2);
  });

  it('can immediately reload a URL whose previous request was aborted', async () => {
    fetchSpy.and.callFake(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener('abort', () =>
            reject(new DOMException('Canceled', 'AbortError')),
          );
        }),
    );
    const url = getTestUrl();
    const controller = new AbortController();
    const previous = lastValueFrom(
      service.loadImage$({ url, kind: 'fits', signal: controller.signal }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    controller.abort();
    fetchSpy.and.callFake(() => Promise.resolve(new Response(new Blob(['current']))));
    const current = lastValueFrom(
      service.loadImage$({ url, kind: 'fits', signal: new AbortController().signal }),
    );
    expect((await previous).status).toBe('error');
    expect((await current).status).toBe('success');
    expect(fetchSpy.calls.count()).toBe(2);
  });

  it('does not fetch when a consumer takes only the loading state', fakeAsync(() => {
    service.loadImage$({ url: getTestUrl(), kind: 'fits' }).pipe(take(1)).subscribe();
    flushMicrotasks();
    expect(fetchSpy).not.toHaveBeenCalled();
  }));

  it('aborts an active fetch when its last subscriber leaves', fakeAsync(() => {
    holdFetches();
    const subscription = service.loadImage$({ url: getTestUrl(), kind: 'fits' }).subscribe();
    flushMicrotasks();
    const signal = fetchSpy.calls.mostRecent().args[1].signal as AbortSignal;
    subscription.unsubscribe();
    expect(signal.aborted).toBeTrue();
    tick(1000);
    expect(fetchSpy.calls.count()).toBe(1); // Canceled requests must never retry.
  }));

  it('drops queued images from skipped pages without starting them', fakeAsync(() => {
    holdFetches();
    const subscriptions = Array.from({ length: 100 }, () =>
      service.loadImage$({ url: getTestUrl(), kind: 'fits' }).subscribe(),
    );
    tick(300);
    expect(fetchSpy.calls.count()).toBe(3);
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    tick(1000);
    expect(fetchSpy.calls.count()).toBe(3);
    expect(fetchSpy.calls.allArgs().every(([, options]) => options.signal.aborted)).toBeTrue();
  }));

  it('lets each caller cancel independently while sharing one fetch', async () => {
    const pending = holdFetches();
    const url = getTestUrl();
    const thumbnail = new AbortController();
    const viewer = new AbortController();
    let thumbnailStatus = '';
    service.loadImage$({ url, kind: 'fits', signal: thumbnail.signal }).subscribe((state) => {
      thumbnailStatus = state.status;
    });
    const viewerResult = lastValueFrom(
      service.loadImage$({ url, kind: 'fits', signal: viewer.signal }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    thumbnail.abort();
    expect(thumbnailStatus).toBe('error');
    expect(pending.get(url)!.signal.aborted).toBeFalse();
    pending.get(url)!.complete(new Response(new Blob(['shared'])));
    expect((await viewerResult).status).toBe('success');
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('preserves a download when thumbnail subscriptions are destroyed', async () => {
    const pending = holdFetches();
    const url = getTestUrl();
    const thumbnail = service.loadImage$({ url, kind: 'fits' }).subscribe();
    const download = lastValueFrom(service.loadImage$({ url, kind: 'fits' }));
    await new Promise((resolve) => setTimeout(resolve, 10));
    thumbnail.unsubscribe();
    expect(pending.get(url)!.signal.aborted).toBeFalse();
    pending.get(url)!.complete(new Response(new Blob(['download'])));
    expect((await download).status).toBe('success');
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('rechecks the cache when the same observable is subscribed again', async () => {
    const load$ = service.loadImage$({ url: getTestUrl(), kind: 'fits' });
    await lastValueFrom(load$);
    const result = await lastValueFrom(load$);
    expect(result.status === 'success' && result.loadedFrom).toBe('memory');
    expect(fetchSpy.calls.count()).toBe(1);
  });

  it('does not cache bytes arriving after the last consumer canceled', async () => {
    let complete!: (response: Response) => void;
    // Model a response winning a race with abort, rather than rejecting on abort.
    fetchSpy.and.callFake(() => new Promise<Response>((resolve) => (complete = resolve)));
    const url = getTestUrl();
    const subscription = service.loadImage$({ url, kind: 'fits' }).subscribe();
    await new Promise((resolve) => setTimeout(resolve, 10));
    subscription.unsubscribe();
    complete(new Response(new Blob(['obsolete'])));
    await new Promise((resolve) => setTimeout(resolve, 10));
    fetchSpy.and.resolveTo(new Response(new Blob(['current'])));
    const state = await lastValueFrom(service.loadImage$({ url, kind: 'fits' }));
    expect(state.status === 'success' && state.loadedFrom).toBe('network');
    expect(fetchSpy.calls.count()).toBe(2);
  });

  function holdFetches() {
    const pending = new Map<
      string,
      { signal: AbortSignal; complete: (response: Response) => void }
    >();
    fetchSpy.and.callFake(
      (url: string, options: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          const signal = options.signal!;
          pending.set(url, { signal, complete: resolve });
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('Canceled', 'AbortError')),
            { once: true },
          );
        }),
    );
    return pending;
  }
});
