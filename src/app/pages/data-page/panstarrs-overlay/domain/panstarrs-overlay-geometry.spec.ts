import {
  calculateImageRenderState,
  getApertureDiameter,
  getApertureOverlayCenter,
  getCentroidAstrometryAnchorX,
  getCentroidOverlayDelta,
  getCrudeOverlayBaseAngularFovDeg,
  getCrudeOverlayLeft,
  getCrudeOverlayTop,
  getOverlayOpacity,
  getWcsOverlayLeft,
} from './panstarrs-overlay-geometry';

describe('panstarrs overlay geometry', () => {
  it('fits a native image inside the container while preserving aspect ratio', () => {
    const renderState = calculateImageRenderState({
      nativeImageWidth: 1000,
      nativeImageHeight: 500,
      containerWidth: 600,
      containerHeight: 600,
    });

    expect(renderState.renderedImageWidth).toBe(600);
    expect(renderState.renderedImageHeight).toBe(300);
    expect(renderState.imageOffsetX).toBe(0);
    expect(renderState.imageOffsetY).toBe(150);
    expect(renderState.imageScaleX).toBe(0.6);
    expect(renderState.imageScaleY).toBe(0.6);
  });

  it('keeps native dimensions when the container is temporarily empty', () => {
    const renderState = calculateImageRenderState({
      nativeImageWidth: 1000,
      nativeImageHeight: 500,
      containerWidth: 0,
      containerHeight: 600,
    });

    expect(renderState.nativeImageWidth).toBe(1000);
    expect(renderState.nativeImageHeight).toBe(500);
    expect(renderState.renderedImageWidth).toBe(0);
    expect(renderState.imageScaleX).toBe(1);
  });

  it('extracts the crude overlay base FOV from URL size params', () => {
    expect(getCrudeOverlayBaseAngularFovDeg('https://example.test/image?SIZE=0.12')).toBe(0.12);
    expect(getCrudeOverlayBaseAngularFovDeg('https://example.test/image?size=0.16deg')).toBe(0.16);
    expect(
      getCrudeOverlayBaseAngularFovDeg('https://example.test/image?size=7.20arcmin'),
    ).toBeCloseTo(0.12, 6);
    expect(getCrudeOverlayBaseAngularFovDeg('https://example.test/image?size=1199')).toBe(0.0833);
    expect(getCrudeOverlayBaseAngularFovDeg('not a normal url')).toBe(0.0833);
  });

  it('projects crude RA/Dec positions around the displayed center', () => {
    const input = {
      renderedImageWidth: 400,
      renderedImageHeight: 200,
      imageOffsetX: 10,
      imageOffsetY: 20,
      angularFovWidthDeg: 0.2,
      angularFovHeightDeg: 0.1,
      displayRa: 100,
      displayDec: 30,
    };

    expect(getCrudeOverlayLeft(100, input)).toBe(210);
    expect(getCrudeOverlayTop(30, input)).toBe(120);
    expect(getCrudeOverlayTop(30.05, input)).toBeCloseTo(20, 6);
  });

  it('applies WCS centralization shifts in rendered image coordinates', () => {
    const left = getWcsOverlayLeft(
      { x: 10 },
      {
        nativeImageWidth: 100,
        nativeImageHeight: 100,
        renderedImageWidth: 200,
        renderedImageHeight: 200,
        containerWidth: 300,
        containerHeight: 300,
        imageOffsetX: 50,
        imageOffsetY: 50,
        imageScaleX: 2,
        imageScaleY: 2,
      },
      6,
      { dx: 2, dy: 0, productId: 'product-1', runId: 'run-1' },
    );

    expect(left).toBe(71);
  });

  it('derives centroid and aperture positions with survey orientation transforms', () => {
    const centroidization = {
      productId: 'product-1',
      astrometryRunId: 'astrometry-1',
      centroidRunId: 'centroid-1',
      initX: 10,
      initY: 20,
      astrometryCenterX: undefined,
      astrometryCenterY: undefined,
      centX: 12,
      centY: 17,
    };

    expect(getCentroidAstrometryAnchorX(centroidization)).toBe(10);
    expect(getCentroidOverlayDelta('ps1dr2', centroidization)).toEqual({ x: -2, y: -3 });
    expect(
      getApertureOverlayCenter({
        source: 'ps1dr2',
        baseX: 100,
        baseY: 200,
        imageScaleX: 2,
        imageScaleY: 3,
        centroidization,
        aperturePosition: [14, 16],
      }),
    ).toEqual({ x: 92, y: 188 });
  });

  it('scales aperture diameters from average rendered image scale', () => {
    expect(
      getApertureDiameter(
        {
          shape: 'Circular',
          position: [10, 20],
          size: 5,
          inner_r: 8,
          outer_r: 12,
        },
        { imageScaleX: 2, imageScaleY: 4 },
      ),
    ).toBe(30);
  });

  it('keeps Pan-STARRS marker opacity within the lower visual bound', () => {
    expect(getOverlayOpacity(0.003)).toBe(1);
    expect(getOverlayOpacity(0.02)).toBe(0.1);
  });
});
