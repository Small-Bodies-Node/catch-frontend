import { NgxJs9Component } from '../../../../projects/ngx-js9/src/lib/ngx-js9.component';
import { previewFitsHeader } from '../../../../projects/ngx-js9/src/lib/utils/previewFitsHeader';
import { reprojectDisplay } from '../../../../projects/ngx-js9/src/lib/utils/reprojectDisplay';
import { previewViewTransform } from '../../../../projects/ngx-js9/src/lib/utils/previewViewTransform';
import { northArrowAngle } from '../../../utils/northArrowAngle';
import { world_to_pixel } from '../../../utils/avm';
import { nativePreviewUrl } from '../../../utils/nativePreviewUrl';
import { selectActiveImageView } from '../../ngrx/selectors/active-image-view.selector';
import { BehaviorSubject, of } from 'rxjs';
import { FitsClickCoordinatesService } from './fits-click-coordinates.service';
import { FitsCoordinateLoaderComponent } from './fits-coordinate-loader.component';
import { FitsJpgTogglerComponent } from './fits-jpg-toggler/fits-jpg-toggler.component';
import {
  selectApiData,
  selectApiDataAstrometryRunsState,
} from '../../ngrx/selectors/api-data.selectors';

describe('full-panel preview view synchronisation', () => {
  it('maps pan, zoom, rotation and flips between unequal FITS and preview canvases', () => {
    const size = { width: 576, height: 606 };
    const fits = { width: 480, height: 477 };
    const preview = { width: 480, height: 549 };
    const fit = Math.min(fits.width / size.width, fits.height / size.height);
    const previewFit = Math.min(preview.width / size.width, preview.height / size.height);
    const offsetX = (preview.width - size.width * previewFit) / 2;
    const offsetY = (preview.height - size.height * previewFit) / 2;
    for (const rotation of [0, 37, -23]) {
      for (const flip of [1, -1]) {
        const angle = (rotation * Math.PI) / 180;
        const imageToDisplay = (point: { x: number; y: number }) => {
          const x = (point.x - 0.5 - size.width / 2) * fit * 1.7 * flip;
          const y = (size.height + 0.5 - point.y - size.height / 2) * fit * 1.7;
          return {
            x: fits.width / 2 + Math.cos(angle) * x - Math.sin(angle) * y + 13 - 0.5,
            y: fits.height / 2 + Math.sin(angle) * x + Math.cos(angle) * y - 7 - 0.5,
          };
        };
        const transform = new DOMMatrix(previewViewTransform(size, fits, preview, imageToDisplay));
        for (const [x, y] of [
          [0.5, 0.5],
          [288.5, 303.5],
          [575.5, 605.5],
        ]) {
          const original = imageToDisplay({ x: x + 0.5, y: size.height - y + 0.5 });
          const actual = transform.transformPoint(
            new DOMPoint(offsetX + x * previewFit, offsetY + y * previewFit),
          );
          const expectedX =
            preview.width / 2 + ((original.x + 0.5 - fits.width / 2) * previewFit) / fit;
          const expectedY =
            preview.height / 2 + ((original.y + 0.5 - fits.height / 2) * previewFit) / fit;
          expect(actual.x).toBeCloseTo(expectedX, 8);
          expect(actual.y).toBeCloseTo(expectedY, 8);
        }
      }
    }
  });

  it('ignores zero-sized and non-finite viewports while layout is settling', () => {
    expect(
      previewViewTransform(
        { width: 10, height: 10 },
        { width: 0, height: 10 },
        { width: 10, height: 10 },
        (p) => p,
      ),
    ).toBe('none');
  });
});

describe('north indicator WCS direction', () => {
  const wcs = {
    referenceValue: [344.31, -16.2] as [number, number],
    referencePixel: [288.5, 303.5] as [number, number],
    size: [576, 606] as [number, number],
    scale: [-0.00014, 0.00014] as [number, number],
    rotation: 0,
  };

  it('points upwards for the standard north-up preview', () => {
    expect(northArrowAngle(wcs)).toBeCloseTo(0, 7);
  });

  it('derives a rotated direction from the full CD matrix', () => {
    expect(
      northArrowAngle({
        ...wcs,
        cdMatrix: [
          [0, 0.00014],
          [0.00014, 0],
        ],
      }),
    ).toBeCloseTo(90, 7);
  });

  it('does not guess a direction for singular WCS or the celestial poles', () => {
    expect(
      northArrowAngle({
        ...wcs,
        cdMatrix: [
          [0, 0],
          [0, 0],
        ],
      }),
    ).toBeNull();
    expect(northArrowAngle({ ...wcs, referenceValue: [0, 90] })).toBeNull();
  });
});

describe('CAT coordinate lookup ownership', () => {
  it('retains independent native and solved WCS mappers until their owner releases them', () => {
    const coordinates = new FitsClickCoordinatesService();
    coordinates.setWorldToImageCoordinatesMapper('native.fits', () => ({ imageX: 10, imageY: 20 }));
    coordinates.setWorldToImageCoordinatesMapper('solved.fits', () => ({ imageX: 30, imageY: 40 }));
    expect(coordinates.getImageCoordinatesFromWorld('native.fits', 0, 0)?.imageX).toBe(10);
    expect(coordinates.getImageCoordinatesFromWorld('solved.fits', 0, 0)?.imageX).toBe(30);
    coordinates.clearWorldToImageCoordinatesMapper('solved.fits');
    expect(coordinates.getImageCoordinatesFromWorld('native.fits', 0, 0)?.imageX).toBe(10);
    expect(coordinates.getImageCoordinatesFromWorld('solved.fits', 0, 0)).toBeNull();
  });

  it('loads a reviewed solution without replacing the visible native image pair', () => {
    const datum = { product_id: 'p', preview_url: 'native.png', cutout_url: 'native.fits' };
    const view = new BehaviorSubject({ datum, previewUrl: 'native.png', fitsUrl: 'native.fits' });
    const runs = of({
      p: [{ id: 'r', status: 'complete', result: { wcs_image_url: 'solved.fits' } }],
    });
    const store = {
      select: (selector: unknown) =>
        selector === selectApiData
          ? of([datum])
          : selector === selectApiDataAstrometryRunsState
            ? runs
            : view,
    };
    const coordinates = new FitsClickCoordinatesService();
    const images = {
      loadImage$: jasmine
        .createSpy()
        .and.returnValue(of({ status: 'success', blob: new Blob(['fits']) })),
    };
    const primary = new FitsJpgTogglerComponent(
      store as any,
      coordinates,
      images as any,
      { getWcsObservable: () => of(undefined) } as any,
    );
    const hidden = new FitsCoordinateLoaderComponent(store as any, images as any, coordinates);
    coordinates.requestWorldToImageCoordinatesMapper('solved.fits');
    expect(hidden.file).toBe('solved.fits');
    expect(primary.desiredFitsUrl).toBe('native.fits');
    expect(primary.viewerFitsUrl).toBe('');
    expect(primary.previewUrl).toBe('native.png');
    expect(images.loadImage$.calls.count()).toBe(1);
    hidden.ngOnDestroy();
    primary.ngOnDestroy();
  });
});

describe('paired image revisions and footprints', () => {
  const datum = {
    product_id: 'p',
    preview_url: 'https://images.example/native.png',
    cutout_url: 'https://images.example/native.fits',
  } as any;
  it('uses both artifacts from a solved revision', () => {
    const result = selectActiveImageView.projector(
      datum,
      {
        p: [
          {
            id: 'r',
            status: 'complete',
            result: { preview_url: 'solved.png', wcs_image_url: 'solved.fits' },
          },
        ],
      } as any,
      { p: { runId: 'r' } } as any,
    );
    expect(result?.previewUrl).toBe('solved.png');
    expect(result?.fitsUrl).toBe('solved.fits');
  });
  it('keeps a native pair for older runs without a solved preview', () => {
    const result = selectActiveImageView.projector(
      datum,
      { p: [{ id: 'r', status: 'complete', result: { wcs_image_url: 'old-solved.fits' } }] } as any,
      { p: { runId: 'r' } } as any,
    );
    expect(result?.previewUrl).toBe(datum.preview_url);
    expect(result?.fitsUrl).toBe(datum.cutout_url);
  });
  it('derives PS1 preview geometry from its FITS cutout', () => {
    const result = new URL(
      nativePreviewUrl(
        'https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?size=1199&format=jpeg',
        'https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?red=image.fits&ra=83.63&dec=22.01&size=720&format=fits',
      ),
    );
    expect(result.searchParams.get('size')).toBe('720');
    expect(result.searchParams.get('format')).toBe('png');
    expect(result.searchParams.get('red')).toBe('image.fits');
  });
});

describe('scientific pixels behind a reprojected JS9 display', () => {
  let previous: unknown;
  let viewer: NgxJs9Component;
  beforeEach(() => {
    previous = (window as any).JS9;
    const original = { wcs: 17 };
    (window as any).JS9 = {
      GetImage: () => ({ raw: { wcs: 99 }, raws: [original] }),
      wcs2pix: jasmine.createSpy().and.returnValue('11 21'),
      pix2wcs: jasmine.createSpy().and.returnValue('344.31 -16.20 ICRS'),
    };
    viewer = new NgxJs9Component({ open: () => {} } as any);
  });
  afterEach(() => ((window as any).JS9 = previous));
  it('returns CAT zero-based pixels from the original WCS', () => {
    expect(viewer.getImageCoordinatesFromWorld(344.31, -16.2)?.imageX).toBe(10);
    expect(viewer.getImageCoordinatesFromWorld(344.31, -16.2)?.imageY).toBe(20);
    expect((window as any).JS9.wcs2pix).toHaveBeenCalledWith(17, 344.31, -16.2);
  });
  it('converts CAT pixels back through the original WCS', () => {
    expect(viewer.getWorldCoordinatesFromImage(10, 20)?.ra).toBe(344.31);
    expect((window as any).JS9.pix2wcs).toHaveBeenCalledWith(17, 11, 21);
  });
  it('builds the display FITS header with rectangular dimensions and full CD matrix', () => {
    const header = previewFitsHeader({
      referenceValue: [344.31, -16.2],
      referencePixel: [288.5, 303.5],
      size: [576, 606],
      scale: [-0.00014, 0.00014],
      rotation: 0,
      cdMatrix: [
        [-0.00014, 0.000001],
        [0.000002, 0.00014],
      ],
    });
    expect(header['NAXIS1']).toBe(576);
    expect(header['NAXIS2']).toBe(606);
    expect(header['CD1_2']).toBe(0.000001);
    expect(header['CD2_1']).toBe(0.000002);
  });

  it('closes an obsolete JS9 completion before it can replace the current WCS', () => {
    const callbacks: Array<(image: unknown) => void> = [];
    const js9 = {
      CloseDisplay: () => {},
      Load: (_file: unknown, options: any) => callbacks.push(options.onload),
    };
    (viewer as any).loadFitsUrl(js9, 'old.fits');
    (viewer as any).loadFitsUrl(js9, 'current.fits');
    const obsolete = { close: jasmine.createSpy('close obsolete image') };
    callbacks[0](obsolete);
    expect(obsolete.close).toHaveBeenCalled();
  });
});

describe('bounded scientific display resampling', () => {
  const preview = {
    referenceValue: [344.31, -16.2] as [number, number],
    referencePixel: [3, 2] as [number, number],
    size: [5, 3] as [number, number],
    scale: [-0.00014, 0.00014] as [number, number],
    rotation: 0,
  };
  it('uses the native inverse WCS and preserves the source array', async () => {
    const science = new Float32Array(Array.from({ length: 15 }, (_, i) => i));
    const rendered = await reprojectDisplay(
      { data: science, width: 5, height: 3 },
      preview,
      (ra, dec) => {
        const [x, y] = world_to_pixel(preview, ra, dec);
        return [4 - (x - 0.5), 3 - y - 0.5];
      },
      () => true,
    );
    expect(Array.from(rendered)).toEqual([4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 14, 13, 12, 11, 10]);
    expect(Array.from(science)).toEqual(Array.from({ length: 15 }, (_, i) => i));
  });
  it('cancels before touching a stale native WCS', async () => {
    const mapper = jasmine.createSpy('native WCS');
    await expectAsync(
      reprojectDisplay({ data: [1], width: 1, height: 1 }, preview, mapper, () => false),
    ).toBeRejected();
    expect(mapper).not.toHaveBeenCalled();
  });
});
