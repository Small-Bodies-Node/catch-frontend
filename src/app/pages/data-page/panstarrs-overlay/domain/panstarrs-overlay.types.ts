import { IApiFixum } from '../../../../../models/IApiFixum';
import { IApiMovum } from '../../../../../models/IApiMovum';

export interface IOverlayActiveContext {
  apiActiveDatum: IApiMovum | IApiFixum;
  imageUrl: string;
  ra: number | string;
  dec: number | string;
}

export interface IWcsCentralizationShift {
  dx: number;
  dy: number;
  productId: string;
  runId: string;
}

export type TPanstarrsStatusVariant = 'loading' | 'empty' | 'error' | null;

export interface IPanstarrsRaDec {
  id: number;
  ra: number;
  dec: number;
  raErr: number;
  decErr: number;
  rMeanPSFMag: number;
}

export interface IWcsPixelCoordinate {
  x: number;
  y: number;
  id: number;
  ra: number;
  dec: number;
}

export interface IImageRenderState {
  nativeImageWidth: number;
  nativeImageHeight: number;
  renderedImageWidth: number;
  renderedImageHeight: number;
  containerWidth: number;
  containerHeight: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageScaleX: number;
  imageScaleY: number;
}

export interface IImageRenderInput {
  nativeImageWidth: number;
  nativeImageHeight: number;
  containerWidth: number;
  containerHeight: number;
}

export interface ICrudeOverlayProjectionInput {
  renderedImageWidth: number;
  renderedImageHeight: number;
  imageOffsetX: number;
  imageOffsetY: number;
  angularFovWidthDeg: number;
  angularFovHeightDeg: number;
  displayRa: number | string;
  displayDec: number | string;
}

export interface IOverlayPoint {
  x: number;
  y: number;
}
