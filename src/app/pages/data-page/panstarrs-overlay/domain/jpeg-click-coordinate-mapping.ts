import { getOverlaySurveyScaleFactors } from '../../../../../utils/image-orientation';
import { IImageRenderState, IOverlayPoint } from './panstarrs-overlay.types';

export interface IJpegClickCoordinateInput {
  source: string | null | undefined;
  renderState: IImageRenderState;
  displayX: number;
  displayY: number;
}

export interface INativeImagePixel {
  x: number;
  y: number;
}

export function getNativeImagePixelFromJpegClick(
  input: IJpegClickCoordinateInput,
): INativeImagePixel | null {
  const { renderState } = input;
  if (
    renderState.renderedImageWidth <= 0 ||
    renderState.renderedImageHeight <= 0 ||
    renderState.imageScaleX <= 0 ||
    renderState.imageScaleY <= 0
  ) {
    return null;
  }

  const displayLocalX = input.displayX - renderState.imageOffsetX;
  const displayLocalY = input.displayY - renderState.imageOffsetY;

  if (
    displayLocalX < 0 ||
    displayLocalY < 0 ||
    displayLocalX > renderState.renderedImageWidth ||
    displayLocalY > renderState.renderedImageHeight
  ) {
    return null;
  }

  const untransformedLocalPoint = getUntransformedLocalPoint({
    source: input.source,
    renderedImageWidth: renderState.renderedImageWidth,
    renderedImageHeight: renderState.renderedImageHeight,
    displayLocalX,
    displayLocalY,
  });

  return {
    x: untransformedLocalPoint.x / renderState.imageScaleX,
    y: untransformedLocalPoint.y / renderState.imageScaleY,
  };
}

export function getDisplayPointFromNativeImagePixel(input: {
  source: string | null | undefined;
  renderState: IImageRenderState;
  nativeX: number;
  nativeY: number;
}): IOverlayPoint | null {
  const { renderState } = input;
  if (
    renderState.renderedImageWidth <= 0 ||
    renderState.renderedImageHeight <= 0 ||
    renderState.imageScaleX <= 0 ||
    renderState.imageScaleY <= 0
  ) {
    return null;
  }

  const untransformedLocalX = input.nativeX * renderState.imageScaleX;
  const untransformedLocalY = input.nativeY * renderState.imageScaleY;
  const displayLocalPoint = getDisplayLocalPoint({
    source: input.source,
    renderedImageWidth: renderState.renderedImageWidth,
    renderedImageHeight: renderState.renderedImageHeight,
    untransformedLocalX,
    untransformedLocalY,
  });

  return {
    x: renderState.imageOffsetX + displayLocalPoint.x,
    y: renderState.imageOffsetY + displayLocalPoint.y,
  };
}

function getUntransformedLocalPoint(input: {
  source: string | null | undefined;
  renderedImageWidth: number;
  renderedImageHeight: number;
  displayLocalX: number;
  displayLocalY: number;
}): IOverlayPoint {
  const scale = getOverlaySurveyScaleFactors(input.source);
  return {
    x: scale.x === -1 ? input.renderedImageWidth - input.displayLocalX : input.displayLocalX,
    y: scale.y === -1 ? input.renderedImageHeight - input.displayLocalY : input.displayLocalY,
  };
}

function getDisplayLocalPoint(input: {
  source: string | null | undefined;
  renderedImageWidth: number;
  renderedImageHeight: number;
  untransformedLocalX: number;
  untransformedLocalY: number;
}): IOverlayPoint {
  const scale = getOverlaySurveyScaleFactors(input.source);
  return {
    x:
      scale.x === -1
        ? input.renderedImageWidth - input.untransformedLocalX
        : input.untransformedLocalX,
    y:
      scale.y === -1
        ? input.renderedImageHeight - input.untransformedLocalY
        : input.untransformedLocalY,
  };
}
