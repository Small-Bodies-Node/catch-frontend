import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { switchMap, catchError, map, shareReplay, tap } from 'rxjs/operators';
import ExifReader, { type Tags } from 'exifreader';
import { getWCSfromXMP, world_to_pixel } from '../../../../utils/avm';

// Define an interface for the WCS object for better type safety
export interface IWcs {
  referenceValue: [number, number];
  referencePixel: [number, number];
  size: [number, number];
  scale: [number, number];
  rotation: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageWcsService {
  private wcsCache = new Map<string, Observable<IWcs>>();

  constructor(private http: HttpClient) {}

  /**
   * Gets an Observable that emits WCS data for a given image URL.
   * Implements caching to avoid redundant fetching and processing.
   * @param imageUrl The URL of the image.
   * @returns An Observable emitting the IWcs object.
   */
  private getWcsObservable(imageUrl: string): Observable<IWcs> {
    if (this.wcsCache.has(imageUrl)) {
      return this.wcsCache.get(imageUrl)!;
    }

    const wcsObservable = this.http.get(imageUrl, { responseType: 'arraybuffer' }).pipe(
      switchMap((arrayBuffer: ArrayBuffer): Observable<IWcs> => {
        try {
          const xmpData: Tags = ExifReader.load(arrayBuffer);
          if (!xmpData || Object.keys(xmpData).length === 0) {
            return throwError(() => new Error('Failed to load XMP data or XMP data is empty.'));
          }
          const wcs: IWcs = getWCSfromXMP(xmpData as any);
          if (!wcs || !wcs.referenceValue || !wcs.referencePixel || !wcs.size || !wcs.scale || wcs.rotation === undefined) {
            return throwError(() => new Error('Failed to derive complete WCS information.'));
          }
          return of(wcs);
        } catch (e: any) {
          return throwError(() => new Error(e.message || 'Error processing image metadata'));
        }
      }),
      tap({
        // On error, remove from cache so subsequent calls retry.
        error: () => this.wcsCache.delete(imageUrl)
      }),
      shareReplay(1) // Cache the IWcs object and replay for subsequent subscribers.
    );

    this.wcsCache.set(imageUrl, wcsObservable);
    return wcsObservable;
  }

  /**
   * Fetches an image, extracts WCS information (utilizing cache),
   * and converts RA/Dec to pixel coordinates.
   * @param imageUrl The URL of the image to process.
   * @param ra Right Ascension in degrees.
   * @param dec Declination in degrees.
   * @returns An Observable emitting a tuple [x, y] of pixel coordinates.
   *          (x, y) = (1, 1) is the upper-left corner.
   */
  public getPixelCoordinatesFromUrl(
    imageUrl: string,
    ra: number,
    dec: number
  ): Observable<[number, number]> {
    return this.getWcsObservable(imageUrl).pipe(
      map((wcs: IWcs) => {
        // WCS object validity is checked within getWcsObservable before it's emitted by 'of(wcs)'
        // or an error is thrown. So, a check here is redundant if getWcsObservable is robust.
        return world_to_pixel(wcs, ra, dec) as [number, number];
      }),
      catchError((error) => {
        // Catch errors from getWcsObservable or the map operation
        console.error('Error getting pixel coordinates for URL:', imageUrl, error);
        return throwError(() => new Error(`Failed to get pixel coordinates for ${imageUrl}: ${error.message || error}`));
      })
    );
  }
}
