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
  private worldToImageCoordinatesMapperFile: string | null = null;
  private worldToImageCoordinatesMapper:
    | ((ra: number, dec: number) => IFitsImageCoordinates | null)
    | null = null;
  private imageToWorldCoordinatesMapperFile: string | null = null;
  private imageToWorldCoordinatesMapper:
    | ((imageX: number, imageY: number) => IFitsWorldCoordinates | null)
    | null = null;

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
    this.worldToImageCoordinatesMapperFile = file;
    this.worldToImageCoordinatesMapper = mapper;
    this.mapperVersionSubject.next(this.mapperVersionSubject.value + 1);
  }

  clearWorldToImageCoordinatesMapper(): void {
    this.worldToImageCoordinatesMapperFile = null;
    this.worldToImageCoordinatesMapper = null;
    this.imageToWorldCoordinatesMapperFile = null;
    this.imageToWorldCoordinatesMapper = null;
    this.mapperVersionSubject.next(this.mapperVersionSubject.value + 1);
  }

  setImageToWorldCoordinatesMapper(
    file: string,
    mapper: (imageX: number, imageY: number) => IFitsWorldCoordinates | null,
  ): void {
    this.imageToWorldCoordinatesMapperFile = file;
    this.imageToWorldCoordinatesMapper = mapper;
    this.mapperVersionSubject.next(this.mapperVersionSubject.value + 1);
  }

  getImageCoordinatesFromWorld(
    file: string,
    ra: number,
    dec: number,
  ): IFitsImageCoordinates | null {
    if (this.worldToImageCoordinatesMapperFile !== file) {
      return null;
    }

    return this.worldToImageCoordinatesMapper?.(ra, dec) ?? null;
  }

  getWorldCoordinatesFromImage(
    file: string,
    imageX: number,
    imageY: number,
  ): IFitsWorldCoordinates | null {
    if (this.imageToWorldCoordinatesMapperFile !== file) {
      return null;
    }

    return this.imageToWorldCoordinatesMapper?.(imageX, imageY) ?? null;
  }
}
