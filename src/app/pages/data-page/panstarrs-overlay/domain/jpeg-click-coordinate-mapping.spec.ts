import {
  getDisplayPointFromNativeImagePixel,
  getNativeImagePixelFromJpegClick,
} from './jpeg-click-coordinate-mapping';
import { IImageRenderState } from './panstarrs-overlay.types';

describe('jpeg click coordinate mapping', () => {
  const renderState: IImageRenderState = {
    nativeImageWidth: 100,
    nativeImageHeight: 50,
    renderedImageWidth: 200,
    renderedImageHeight: 100,
    containerWidth: 240,
    containerHeight: 140,
    imageOffsetX: 20,
    imageOffsetY: 20,
    imageScaleX: 2,
    imageScaleY: 2,
  };

  it('maps display clicks to native pixels without a survey transform', () => {
    expect(
      getNativeImagePixelFromJpegClick({
        source: 'loneos',
        renderState,
        displayX: 120,
        displayY: 70,
      }),
    ).toEqual({ x: 50, y: 25 });
  });

  it('inverts horizontal overlay flips before returning native pixels', () => {
    expect(
      getNativeImagePixelFromJpegClick({
        source: 'ps1dr2',
        renderState,
        displayX: 60,
        displayY: 70,
      }),
    ).toEqual({ x: 80, y: 25 });
  });

  it('returns null for clicks outside the rendered image', () => {
    expect(
      getNativeImagePixelFromJpegClick({
        source: 'ps1dr2',
        renderState,
        displayX: 10,
        displayY: 70,
      }),
    ).toBeNull();
  });

  it('round-trips native pixels through the display transform', () => {
    const displayPoint = getDisplayPointFromNativeImagePixel({
      source: 'skymapper_dr4',
      renderState,
      nativeX: 80,
      nativeY: 25,
    });

    expect(displayPoint).toEqual({ x: 60, y: 70 });
    expect(
      getNativeImagePixelFromJpegClick({
        source: 'skymapper_dr4',
        renderState,
        displayX: displayPoint!.x,
        displayY: displayPoint!.y,
      }),
    ).toEqual({ x: 80, y: 25 });
  });
});
