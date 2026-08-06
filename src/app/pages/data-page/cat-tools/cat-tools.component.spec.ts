import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, of } from 'rxjs';
import { IAstrometryRun } from '../../../../models/IAstrometryRun';
import { initialState } from '../../../ngrx/reducers/api-data.reducer';
import { FitsClickCoordinatesService } from '../fits-click-coordinates.service';
import { CatToolsComponent } from './cat-tools.component';
import { IAnalysisItem } from './domain/cat-tools.types';

describe('CatToolsComponent calibration workflow', () => {
  it('renders both Stage 2 plots and initializes centroid X/Y from the displayed FITS WCS', async () => {
    const requestWorldToImageCoordinatesMapper = jasmine.createSpy(
      'requestWorldToImageCoordinatesMapper',
    );
    const getImageCoordinatesFromWorld = jasmine
      .createSpy('getImageCoordinatesFromWorld')
      .and.callFake((file: string) =>
        file === 'https://example.test/input.fits' ? { imageX: 123.4, imageY: 234.6 } : null,
      );

    await TestBed.configureTestingModule({
      imports: [CatToolsComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          initialState: {
            apiData: {
              ...initialState,
              apiData: [
                {
                  cutout_url: 'https://example.test/input.fits',
                  date: '2026-07-30T00:00:00.000Z',
                  filter: 'r',
                  product_id: 'product-1',
                  source: 'ps1dr2',
                  source_name: 'C/2025 A1',
                },
              ],
              apiDataActiveDatum: {
                cutout_url: 'https://example.test/input.fits',
                date: '2026-07-30T00:00:00.000Z',
                filter: 'r',
                product_id: 'product-1',
                source: 'ps1dr2',
                source_name: 'C/2025 A1',
              },
              apiDataAnalysisSelectionState: { 'product-1': true },
              apiDataAstrometryRunsState: {
                'product-1': [
                  {
                    id: 'astrometry-1',
                    productId: 'product-1',
                    sequence: 1,
                    status: 'complete',
                    createdAt: '2026-07-30T00:00:00.000Z',
                    inputs: {
                      image_url: 'https://example.test/input.fits',
                      ra: 1,
                      dec: 2,
                      use_ra_dec: true,
                      pixel_scale: 0.25,
                      scale_low: null,
                      scale_high: null,
                      search_radius: 2,
                      snr_threshold: 3,
                    },
                    result: {
                      status: 'success',
                      wcs_image_url: 'https://example.test/wcs.fits',
                      wcs_image_s3_key: 'wcs.fits',
                      sources_detected: 10,
                      center_ra_deg: 1,
                      center_dec_deg: 2,
                      pixel_scale: 0.25,
                      request_id: 'request-1',
                      cache: { enabled: false, hit: false, key: null },
                    },
                  },
                ],
              },
              apiDataAstrometryCentralizationState: {
                'product-1': {
                  productId: 'product-1',
                  runId: 'astrometry-1',
                  centerRaDeg: 1,
                  centerDecDeg: 2,
                },
              },
              apiDataPhotometricCalibrationRunsState: {
                'product-1': {
                  'astrometry-1': [
                    {
                      id: 'calibration-1',
                      productId: 'product-1',
                      astrometryRunId: 'astrometry-1',
                      sequence: 1,
                      status: 'complete',
                      createdAt: '2026-07-30T00:01:00.000Z',
                      inputs: {
                        wcs_image_url: 'https://example.test/wcs.fits',
                        snr_threshold: 3,
                        aperture_radius: 7,
                        catalog: 'PanSTARRS1',
                        cal_band: 'r',
                        color_term: 'g-r',
                      },
                      result: {
                        status: 'success',
                        photometry: {
                          zero_point: 25,
                          color_term: 0.1,
                          uncertainty: 0.02,
                          color_index: 'g-r',
                          catalog: 'PanSTARRS1',
                          cal_band: 'r',
                        },
                        sources: { detected: 10, matched: 8 },
                        photometry_image_url: 'https://example.test/photometry.fits',
                        photometry_image_s3_key: 'photometry.fits',
                        plots: {
                          color_correction: {
                            url: 'https://example.test/color.png',
                            s3_key: 'color.png',
                          },
                          image_overlay: {
                            url: 'https://example.test/overlay.png',
                            s3_key: 'overlay.png',
                          },
                        },
                        request_id: 'request-2',
                        cache: { enabled: true, hit: false, key: 'cache-key' },
                      },
                    },
                  ],
                },
              },
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}), snapshot: { queryParams: {} } },
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: jasmine.createSpy('createUrlTree'),
            serializeUrl: jasmine.createSpy('serializeUrl'),
          },
        },
        {
          provide: MatSnackBar,
          useValue: { open: jasmine.createSpy('open') },
        },
        {
          provide: FitsClickCoordinatesService,
          useValue: {
            coordinates$: of(null),
            mapperVersion$: of(0),
            requestWorldToImageCoordinatesMapper,
            getImageCoordinatesFromWorld,
            getWorldCoordinatesFromImage: jasmine
              .createSpy('getWorldCoordinatesFromImage')
              .and.returnValue(null),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CatToolsComponent);
    fixture.componentInstance.activeDetailView = {
      kind: 'astrometry-review',
      title: 'Calibration Results',
      productId: 'product-1',
      runId: 'astrometry-1',
    };
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const imageSources = Array.from(
      element.querySelectorAll<HTMLImageElement>('.cat-tools-diagnostic-grid img'),
    ).map((image) => image.getAttribute('src'));
    expect(imageSources).toEqual([
      'https://example.test/color.png',
      'https://example.test/overlay.png',
    ]);
    expect(element.querySelector('input[name="wcs_image_url"]')).toBeNull();
    expect(fixture.componentInstance.centroidDraft).toEqual(
      jasmine.objectContaining({
        file: 'https://example.test/photometry.fits',
        target_x: 123,
        target_y: 235,
        astrometry_center_x: 123,
        astrometry_center_y: 235,
      }),
    );
    expect(requestWorldToImageCoordinatesMapper).toHaveBeenCalledWith(
      'https://example.test/input.fits',
    );
    expect(requestWorldToImageCoordinatesMapper).not.toHaveBeenCalledWith(
      'https://example.test/photometry.fits',
    );

    const summary = await firstValueFrom(fixture.componentInstance.analysisSelectionSummary$);
    const completedRun = summary.items[0].astrometryRuns[0];
    fixture.componentInstance.photometricCalibrationDraft!.wcs_image_url =
      'https://attacker.example/untrusted.fits';
    const store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    fixture.componentInstance.launchPhotometricCalibration(summary.items[0], completedRun);

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        inputs: jasmine.objectContaining({
          wcs_image_url: 'https://example.test/wcs.fits',
        }),
      }),
    );
    const runningRun: IAstrometryRun = {
      ...summary.items[0].astrometryRuns[0],
      status: 'running',
      result: undefined,
    };
    const runningItem: IAnalysisItem = {
      ...summary.items[0],
      astrometryRuns: [runningRun],
      astrometryCentralization: undefined,
      photometricCalibrationRunsState: {},
      centroidRunsState: {},
      centroidization: undefined,
      targetPhotometryRunsState: {},
      sourceMagnitudeState: {},
    };
    const outputState = (
      fixture.componentInstance as unknown as {
        getOutputAutoscrollState: (
          item: IAnalysisItem,
          run: IAstrometryRun,
        ) => { signature: string; target: string | null };
      }
    ).getOutputAutoscrollState(runningItem, runningRun);

    expect(outputState).toEqual({
      signature: 'astrometry-running:astrometry-1',
      target: 'astrometry-output-astrometry-1',
    });
  });
});
