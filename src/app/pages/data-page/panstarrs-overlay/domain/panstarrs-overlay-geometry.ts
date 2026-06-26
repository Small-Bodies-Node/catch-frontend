import { ICentroidization } from '../../../../../models/ICentroid';
import { ITargetPhotometryApertureParams } from '../../../../../models/ITargetPhotometry';
import { convertToDecimal } from '../../../../../utils/convertToDecimal';
import { DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG } from '../../../../../utils/crudeOverlayFov';
import { transformOverlaySurveyDelta } from '../../../../../utils/image-orientation';
import {
  ICrudeOverlayProjectionInput,
  IImageRenderInput,
  IImageRenderState,
  IOverlayPoint,
  IWcsCentralizationShift,
} from './panstarrs-overlay.types';

export function createDefaultImageRenderState(): IImageRenderState {
  return {
    nativeImageWidth: 1,
    nativeImageHeight: 1,
    renderedImageWidth: 0,
    renderedImageHeight: 0,
    containerWidth: 0,
    containerHeight: 0,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageScaleX: 1,
    imageScaleY: 1,
  };
}

export function calculateImageRenderState(input: IImageRenderInput): IImageRenderState {
  const { nativeImageWidth, nativeImageHeight, containerWidth, containerHeight } = input;

  if (containerWidth <= 0 || containerHeight <= 0) {
    return {
      ...createDefaultImageRenderState(),
      nativeImageWidth,
      nativeImageHeight,
    };
  }

  if (nativeImageWidth <= 0 || nativeImageHeight <= 0) {
    return {
      ...createDefaultImageRenderState(),
      nativeImageWidth,
      nativeImageHeight,
      containerWidth,
      containerHeight,
    };
  }

  let renderedImageHeight = containerHeight;
  const imageAspectRatio = nativeImageWidth / nativeImageHeight;
  let renderedImageWidth = renderedImageHeight * imageAspectRatio;

  if (renderedImageWidth > containerWidth) {
    renderedImageWidth = containerWidth;
    renderedImageHeight = renderedImageWidth / imageAspectRatio;
  }

  return {
    nativeImageWidth,
    nativeImageHeight,
    renderedImageWidth,
    renderedImageHeight,
    containerWidth,
    containerHeight,
    imageOffsetX: (containerWidth - renderedImageWidth) / 2,
    imageOffsetY: (containerHeight - renderedImageHeight) / 2,
    imageScaleX: renderedImageWidth / nativeImageWidth,
    imageScaleY: renderedImageHeight / nativeImageHeight,
  };
}

export function getCrudeOverlayBaseAngularFovDeg(imageUrl: string): number {
  if (!imageUrl) {
    return DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG;
  }

  try {
    const url = new URL(imageUrl, 'https://catch.local');
    const sizeParam = Array.from(url.searchParams.entries()).find(
      ([key]) => key.toLowerCase() === 'size',
    )?.[1];
    return parseAngularSizeDeg(sizeParam) ?? DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG;
  } catch {
    return DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG;
  }
}

function parseAngularSizeDeg(sizeParam: string | undefined): number | null {
  const normalizedSize = sizeParam?.trim().toLowerCase();
  if (!normalizedSize) {
    return null;
  }

  const match = normalizedSize.match(
    /^([0-9]+(?:\.[0-9]+)?)(?:\s*(deg|degree|degrees|arcmin|arcmins|arcminute|arcminutes))?$/,
  );
  if (!match) {
    return null;
  }

  const size = Number(match[1]);
  if (!Number.isFinite(size) || size <= 0) {
    return null;
  }

  const unit = match[2];
  if (unit?.startsWith('arcmin')) {
    return size / 60;
  }

  if (unit?.startsWith('deg')) {
    return size;
  }

  return size <= 1 ? size : null;
}

export function getCrudeOverlayLeft(ra: number, input: ICrudeOverlayProjectionInput): number {
  const raCenter = convertToDecimal(input.displayRa);
  const decCenter = convertToDecimal(input.displayDec);

  if (!isFiniteNumber(raCenter) || !isFiniteNumber(decCenter) || input.renderedImageWidth <= 0) {
    return -1000;
  }

  const cosDecCenter = Math.cos(deg2rad(decCenter));
  const normXOffset = ((ra - raCenter) * cosDecCenter) / input.angularFovWidthDeg;
  const pixelXOnImage = (normXOffset + 0.5) * input.renderedImageWidth;

  return input.imageOffsetX + pixelXOnImage;
}

export function getCrudeOverlayTop(dec: number, input: ICrudeOverlayProjectionInput): number {
  const decCenter = convertToDecimal(input.displayDec);

  if (!isFiniteNumber(decCenter) || input.renderedImageHeight <= 0) {
    return -1000;
  }

  const normYOffset = (dec - decCenter) / input.angularFovHeightDeg;
  const pixelYOnImage = (0.5 - normYOffset) * input.renderedImageHeight;

  return input.imageOffsetY + pixelYOnImage;
}

export function getCrudeOverlayWidth(raErr: number, input: ICrudeOverlayProjectionInput): number {
  const decCenter = convertToDecimal(input.displayDec);
  if (!isFiniteNumber(decCenter) || input.renderedImageWidth <= 0) {
    return 2;
  }

  const cosDecCenter = Math.cos(deg2rad(decCenter));
  const correctedRaErrAngular = raErr * cosDecCenter;
  const pixelWidth = (correctedRaErrAngular / input.angularFovWidthDeg) * input.renderedImageWidth;

  return Math.max(2, pixelWidth);
}

export function getCrudeOverlayHeight(decErr: number, input: ICrudeOverlayProjectionInput): number {
  if (input.renderedImageHeight <= 0) {
    return 2;
  }

  const pixelHeight = (decErr / input.angularFovHeightDeg) * input.renderedImageHeight;

  return Math.max(2, pixelHeight);
}

export function getOverlayOpacity(raErr: number): number {
  return Math.max(0.1, 1.0 - (raErr - 0.003) / 0.004);
}

export function getWcsOverlayLeft(
  coord: { x: number },
  renderState: IImageRenderState,
  starDivDiameter: number,
  shift?: IWcsCentralizationShift,
): number {
  return (
    (coord.x + (shift?.dx ?? 0)) * renderState.imageScaleX +
    renderState.imageOffsetX -
    starDivDiameter / 2
  );
}

export function getWcsOverlayTop(
  coord: { y: number },
  renderState: IImageRenderState,
  starDivDiameter: number,
  shift?: IWcsCentralizationShift,
): number {
  return (
    (coord.y + (shift?.dy ?? 0)) * renderState.imageScaleY +
    renderState.imageOffsetY -
    starDivDiameter / 2
  );
}

export function getCentroidAstrometryAnchorX(centroidization: ICentroidization): number {
  return isFiniteNumber(centroidization.astrometryCenterX)
    ? centroidization.astrometryCenterX
    : centroidization.initX;
}

export function getCentroidAstrometryAnchorY(centroidization: ICentroidization): number {
  return isFiniteNumber(centroidization.astrometryCenterY)
    ? centroidization.astrometryCenterY
    : centroidization.initY;
}

export function getCentroidOverlayDelta(
  source: string | null | undefined,
  centroidization: ICentroidization,
): IOverlayPoint {
  return transformOverlaySurveyDelta(
    source,
    centroidization.centX - getCentroidAstrometryAnchorX(centroidization),
    centroidization.centY - getCentroidAstrometryAnchorY(centroidization),
  );
}

export function getApertureOverlayCenter(input: {
  source: string | null | undefined;
  baseX: number;
  baseY: number;
  imageScaleX: number;
  imageScaleY: number;
  centroidization?: ICentroidization;
  aperturePosition?: [number, number];
}): IOverlayPoint {
  if (!input.centroidization || !input.aperturePosition) {
    return { x: input.baseX, y: input.baseY };
  }

  const delta = transformOverlaySurveyDelta(
    input.source,
    input.aperturePosition[0] - getCentroidAstrometryAnchorX(input.centroidization),
    input.aperturePosition[1] - getCentroidAstrometryAnchorY(input.centroidization),
  );

  return {
    x: input.baseX + delta.x * input.imageScaleX,
    y: input.baseY + delta.y * input.imageScaleY,
  };
}

export function getApertureDiameter(
  aperture: ITargetPhotometryApertureParams | undefined,
  renderState: Pick<IImageRenderState, 'imageScaleX' | 'imageScaleY'>,
  radiusKey: 'size' | 'inner_r' | 'outer_r' = 'size',
): number {
  if (!aperture || !isFiniteNumber(aperture[radiusKey])) {
    return 0;
  }

  return Math.max(0, aperture[radiusKey] * 2 * getAverageImageScale(renderState));
}

export function getAverageImageScale(
  renderState: Pick<IImageRenderState, 'imageScaleX' | 'imageScaleY'>,
): number {
  return (Math.abs(renderState.imageScaleX) + Math.abs(renderState.imageScaleY)) / 2;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function deg2rad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
