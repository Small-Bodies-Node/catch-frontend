import { Injectable } from '@angular/core';
import { Observable, from, throwError, filter, switchMap, map, shareReplay, tap } from 'rxjs';
import ExifReader from 'exifreader';
import { getWCSfromXMP, pixel_to_world, world_to_pixel } from '../../../../utils/avm';
import { ThumbnailImageCacheService } from '../thumbnail-image-cache/thumbnail-image-cache.service';
import { normalizeThumbnailUrl } from '../thumbnail-image-cache/thumbnail-url.utils';

export interface IWcs {
  referenceValue: [number, number];
  referencePixel: [number, number];
  size: [number, number];
  scale: [number, number];
  rotation: number;
  cdMatrix?: [[number, number], [number, number]];
  coordinateFrame?: string;
}

@Injectable({ providedIn: 'root' })
export class ImageWcsService {
  private wcsCache = new Map<string, Observable<IWcs>>();
  constructor(private images: ThumbnailImageCacheService) {}

  getWcsObservable(imageUrl: string): Observable<IWcs> {
    const key = normalizeThumbnailUrl(imageUrl);
    const existing = this.wcsCache.get(key);
    if (existing) return existing;
    const result = this.images.loadImage$({ url: imageUrl, priority: 'high' }).pipe(
      filter((state) => state.status === 'success' || state.status === 'error'),
      switchMap((state) =>
        state.status === 'success'
          ? from(state.blob.arrayBuffer())
          : throwError(
              () => new Error(state.status === 'error' ? state.message : 'Preview unavailable'),
            ),
      ),
      map((buffer) => {
        const wcs: IWcs = getWCSfromXMP(ExifReader.load(buffer));
        if (
          ![
            ...wcs.referenceValue,
            ...wcs.referencePixel,
            ...wcs.size,
            ...wcs.scale,
            wcs.rotation,
          ].every(Number.isFinite)
        )
          throw new Error('Incomplete preview WCS');
        return wcs;
      }),
      tap({ error: () => this.wcsCache.delete(key) }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.wcsCache.set(key, result);
    // Metadata is small, but selection across a long session must remain bounded.
    if (this.wcsCache.size > 600) this.wcsCache.delete(this.wcsCache.keys().next().value!);
    return result;
  }

  /** Top-left browser coordinates measured from image edges; centers are .5. */
  getPixelCoordinatesFromUrl(
    imageUrl: string,
    ra: number,
    dec: number,
  ): Observable<[number, number]> {
    return this.getWcsObservable(imageUrl).pipe(
      map((wcs) => world_to_pixel(wcs, ra, dec) as [number, number]),
    );
  }
  getWorldCoordinatesFromPixel(
    imageUrl: string,
    x: number,
    y: number,
  ): Observable<{ ra: number; dec: number }> {
    return this.getWcsObservable(imageUrl).pipe(
      map((wcs) => {
        const [ra, dec] = pixel_to_world(wcs, x, y);
        return { ra, dec };
      }),
    );
  }
}
