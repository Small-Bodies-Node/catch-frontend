import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IFitsClickCoordinates {
  displayX: number;
  displayY: number;
  /** Pixel coordinates in the loaded image array, not detector-frame physical coordinates. */
  imageX: number;
  imageY: number;
  imageFrameX?: number;
  imageFrameY?: number;
  physicalX?: number;
  physicalY?: number;
  ra?: number;
  dec?: number;
  wcsSystem?: string;
  wcsString?: string;
  file?: string;
  productId?: string;
  coordinateSource?: 'fits-viewer' | 'jpeg-preview';
}

export interface IFitsImageCoordinates {
  imageX: number;
  imageY: number;
  wcsPixelX?: number;
  wcsPixelY?: number;
  wcsPixelAsPhysicalX?: number;
  wcsPixelAsPhysicalY?: number;
  wcsPixelAsImageX?: number;
  wcsPixelAsImageY?: number;
  wcsString?: string;
}

export interface IFitsWorldCoordinates {
  ra: number;
  dec: number;
  wcsSystem?: string;
  wcsString?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FitsClickCoordinatesService {
  private readonly coordinatesSubject = new BehaviorSubject<IFitsClickCoordinates | null>(null);
  private readonly mapperVersionSubject = new BehaviorSubject(0);
  private readonly worldToImageCoordinatesRequestSubject = new BehaviorSubject<string | null>(null);
  private readonly worldToImageMappers = new Map<
    string,
    (ra: number, dec: number) => IFitsImageCoordinates | null
  >();
  private readonly imageToWorldMappers = new Map<
    string,
    (x: number, y: number) => IFitsWorldCoordinates | null
  >();

  readonly coordinates$ = this.coordinatesSubject.asObservable();
  readonly mapperVersion$ = this.mapperVersionSubject.asObservable();
  readonly worldToImageCoordinatesRequest$ =
    this.worldToImageCoordinatesRequestSubject.asObservable();

  setCoordinates(coordinates: IFitsClickCoordinates): void {
    this.coordinatesSubject.next(coordinates);
  }

  clearCoordinates(): void {
    this.coordinatesSubject.next(null);
  }

  requestWorldToImageCoordinatesMapper(file: string): void {
    if (this.worldToImageCoordinatesRequestSubject.value === file) {
      return;
    }

    this.worldToImageCoordinatesRequestSubject.next(file);
  }

  setWorldToImageCoordinatesMapper(
    file: string,
    mapper: (ra: number, dec: number) => IFitsImageCoordinates | null,
  ): void {
    this.worldToImageMappers.set(file, mapper);
    this.mapperVersionSubject.next(this.mapperVersionSubject.value + 1);
  }

  clearWorldToImageCoordinatesMapper(file?: string): void {
    if (file !== undefined) {
      this.worldToImageMappers.delete(file);
      this.imageToWorldMappers.delete(file);
    } else {
      this.worldToImageMappers.clear();
      this.imageToWorldMappers.clear();
    }
    if (file === undefined) this.worldToImageCoordinatesRequestSubject.next(null);
    this.mapperVersionSubject.next(this.mapperVersionSubject.value + 1);
  }

  setImageToWorldCoordinatesMapper(
    file: string,
    mapper: (imageX: number, imageY: number) => IFitsWorldCoordinates | null,
  ): void {
    this.imageToWorldMappers.set(file, mapper);
    this.mapperVersionSubject.next(this.mapperVersionSubject.value + 1);
  }

  getImageCoordinatesFromWorld(
    file: string,
    ra: number,
    dec: number,
  ): IFitsImageCoordinates | null {
    return this.worldToImageMappers.get(file)?.(ra, dec) ?? null;
  }

  getWorldCoordinatesFromImage(
    file: string,
    imageX: number,
    imageY: number,
  ): IFitsWorldCoordinates | null {
    return this.imageToWorldMappers.get(file)?.(imageX, imageY) ?? null;
  }
}
