import { Injectable } from '@angular/core';
import { firstValueFrom, filter } from 'rxjs';
import { ThumbnailImageCacheService } from '../thumbnail-image-cache/thumbnail-image-cache.service';

@Injectable({ providedIn: 'root' })
export class ImageFetchService {
  constructor(private images: ThumbnailImageCacheService) {}
  resetQueue(): void {
    this.images.resetQueues();
  }

  async fetchImage(
    url: string,
    options?: { isPriority: boolean; label: string; signal?: AbortSignal },
  ): Promise<string | undefined> {
    const result = await firstValueFrom(
      this.images
        .loadImage$({
          url,
          priority: options?.isPriority ? 'high' : 'normal',
          label: options?.label,
          signal: options?.signal,
        })
        .pipe(filter((state) => state.status === 'success' || state.status === 'error')),
    );
    return result.status === 'success' ? result.objectUrl : undefined;
  }
}
