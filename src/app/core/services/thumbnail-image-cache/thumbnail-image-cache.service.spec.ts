import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';

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
});
