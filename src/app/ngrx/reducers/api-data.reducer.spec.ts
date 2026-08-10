import {
  ApiDataAction_BeginAstrometryRun,
  ApiDataAction_BeginPhotometricCalibrationRun,
  ApiDataAction_CompleteAstrometryRun,
} from '../actions/api-data.actions';
import { apiDataReducer, IApiDataSubstate, initialState } from './api-data.reducer';

describe('apiDataReducer CAT workflow', () => {
  it('stores and automatically applies the complete astrometry response', () => {
    const running = apiDataReducer(
      initialState,
      ApiDataAction_BeginAstrometryRun({
        productId: 'product-1',
        runId: 'astrometry-1',
        createdAt: '2026-07-30T00:00:00.000Z',
        inputs: {
          image_url: 'input.fits',
          ra: 1,
          dec: 2,
          use_ra_dec: true,
          pixel_scale: 0.25,
          scale_low: null,
          scale_high: null,
          search_radius: 2,
          snr_threshold: 3,
        },
      }),
    );
    const completed = apiDataReducer(
      running,
      ApiDataAction_CompleteAstrometryRun({
        productId: 'product-1',
        runId: 'astrometry-1',
        completedAt: '2026-07-30T00:01:00.000Z',
        result: {
          status: 'success',
          wcs_image_url: 'wcs.fits',
          wcs_image_s3_key: 'wcs-key',
          sources_detected: 10,
          center_ra_deg: 1,
          center_dec_deg: 2,
          pixel_scale: 0.25,
          request_id: 'request-1',
          cache: { enabled: false, hit: false, key: null },
        },
      }),
    );

    expect(completed.apiDataAstrometryRunsState['product-1'][0].result?.wcs_image_url).toBe(
      'wcs.fits',
    );
    expect(completed.apiDataAstrometryRunsState['product-1'][0].result).not.toEqual(
      jasmine.objectContaining({ photometry: jasmine.anything() }),
    );
    expect(completed.apiDataAstrometryCentralizationState['product-1']).toEqual({
      productId: 'product-1',
      runId: 'astrometry-1',
      centerRaDeg: 1,
      centerDecDeg: 2,
    });
  });

  it('starts a photometric rerun without creating a new astrometry run', () => {
    const state = createStateWithDownstreamResults();
    const next = apiDataReducer(
      state,
      ApiDataAction_BeginPhotometricCalibrationRun({
        productId: 'product-1',
        astrometryRunId: 'astrometry-1',
        runId: 'calibration-2',
        createdAt: '2026-07-30T01:00:00.000Z',
        inputs: {
          wcs_image_url: 'wcs.fits',
          snr_threshold: 5,
          aperture_radius: 9,
          catalog: 'Gaia',
          cal_band: 'G',
          color_term: 'bp-rp',
        },
      }),
    );

    expect(next.apiDataAstrometryRunsState['product-1']).toBe(
      state.apiDataAstrometryRunsState['product-1'],
    );
    expect(next.apiDataPhotometricCalibrationRunsState['product-1']['astrometry-1']).toHaveSize(2);
    expect(
      next.apiDataPhotometricCalibrationRunsState['product-1']['astrometry-1'][1].inputs,
    ).toEqual(jasmine.objectContaining({ wcs_image_url: 'wcs.fits', color_term: 'bp-rp' }));
  });

  it('invalidates only the rerun astrometry branch downstream of Stage 2', () => {
    const state = createStateWithDownstreamResults();
    const next = apiDataReducer(
      state,
      ApiDataAction_BeginPhotometricCalibrationRun({
        productId: 'product-1',
        astrometryRunId: 'astrometry-1',
        runId: 'calibration-2',
        createdAt: '2026-07-30T01:00:00.000Z',
        inputs: {
          wcs_image_url: 'wcs.fits',
          snr_threshold: 3,
          aperture_radius: 7,
          catalog: 'PanSTARRS1',
          cal_band: 'r',
          color_term: 'g-r',
        },
      }),
    );

    expect(next.apiDataAstrometryRunsState['product-1']).toHaveSize(2);
    expect(next.apiDataAstrometryCentralizationState['product-1']?.runId).toBe('astrometry-1');
    expect(next.apiDataCentroidRunsState['product-1']['astrometry-1']).toBeUndefined();
    expect(next.apiDataTargetPhotometryRunsState['product-1']['astrometry-1']).toBeUndefined();
    expect(next.apiDataSourceMagnitudeState['product-1']['astrometry-1']).toBeUndefined();
    expect(next.apiDataCentroidizationState['product-1']).toBeUndefined();
    expect(next.apiDataCentroidRunsState['product-1']['astrometry-old']).toBeDefined();
  });

  it('starting a new astrometry run clears applied downstream selections but preserves history', () => {
    const state = createStateWithDownstreamResults();
    const next = apiDataReducer(
      state,
      ApiDataAction_BeginAstrometryRun({
        productId: 'product-1',
        runId: 'astrometry-3',
        createdAt: '2026-07-30T02:00:00.000Z',
        inputs: {
          image_url: 'new-input.fits',
          ra: 1,
          dec: 2,
          use_ra_dec: true,
          pixel_scale: 0.25,
          scale_low: null,
          scale_high: null,
          search_radius: 2,
          snr_threshold: 3,
        },
      }),
    );

    expect(next.apiDataAstrometryRunsState['product-1']).toHaveSize(3);
    expect(next.apiDataAstrometryCentralizationState['product-1']).toBeUndefined();
    expect(next.apiDataCentroidizationState['product-1']).toBeUndefined();
    expect(next.apiDataCentroidRunsState['product-1']['astrometry-1']).toBeDefined();
  });
});

function createStateWithDownstreamResults(): IApiDataSubstate {
  const astrometryInputs = {
    image_url: 'input.fits',
    ra: 1,
    dec: 2,
    use_ra_dec: true as const,
    pixel_scale: 0.25,
    scale_low: null,
    scale_high: null,
    search_radius: 2,
    snr_threshold: 3,
  };
  const centroidRun = {
    id: 'centroid-1',
    productId: 'product-1',
    astrometryRunId: 'astrometry-1',
    photometricCalibrationRunId: 'calibration-1',
    sequence: 1,
    status: 'complete' as const,
    inputs: { file: 'photometry.fits', target_x: 10, target_y: 20, search_radius: 7 },
    createdAt: '2026-07-30T00:02:00.000Z',
    result: {
      search_results: {
        init_guess_x: 10,
        init_guess_y: 20,
        search_radius: 7,
        cent_x: 11,
        cent_y: 21,
      },
    },
  };

  return {
    ...initialState,
    apiDataAstrometryRunsState: {
      'product-1': [
        {
          id: 'astrometry-old',
          productId: 'product-1',
          sequence: 1,
          status: 'complete',
          inputs: astrometryInputs,
          createdAt: '2026-07-29T00:00:00.000Z',
        },
        {
          id: 'astrometry-1',
          productId: 'product-1',
          sequence: 2,
          status: 'complete',
          inputs: astrometryInputs,
          createdAt: '2026-07-30T00:00:00.000Z',
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
              wcs_image_url: 'wcs.fits',
              snr_threshold: 3,
              aperture_radius: 7,
              catalog: 'PanSTARRS1',
              cal_band: 'r',
              color_term: 'g-r',
            },
          },
        ],
      },
    },
    apiDataCentroidRunsState: {
      'product-1': {
        'astrometry-old': {},
        'astrometry-1': { 'calibration-1': [centroidRun] },
      },
    },
    apiDataCentroidizationState: {
      'product-1': {
        productId: 'product-1',
        astrometryRunId: 'astrometry-1',
        photometricCalibrationRunId: 'calibration-1',
        centroidRunId: 'centroid-1',
        initX: 10,
        initY: 20,
        centX: 11,
        centY: 21,
      },
    },
    apiDataTargetPhotometryRunsState: {
      'product-1': {
        'astrometry-1': {
          'calibration-1': {
            'centroid-1': [
              {
                id: 'target-1',
                productId: 'product-1',
                astrometryRunId: 'astrometry-1',
                photometricCalibrationRunId: 'calibration-1',
                centroidRunId: 'centroid-1',
                sequence: 1,
                status: 'complete',
                createdAt: '2026-07-30T00:03:00.000Z',
                inputs: {
                  file: 'photometry.fits',
                  target_aperture_params: {
                    shape: 'Circular',
                    position: [11, 21],
                    size: 5,
                    inner_r: 0,
                    outer_r: 0,
                  },
                  background_aperture_params: {
                    shape: 'Circular_Annulus',
                    position: [11, 21],
                    size: 5,
                    inner_r: 5,
                    outer_r: 10,
                  },
                },
              },
            ],
          },
        },
      },
    },
    apiDataSourceMagnitudeState: {
      'product-1': {
        'astrometry-1': {
          'calibration-1': {
            'centroid-1': {
              'target-1': {
                productId: 'product-1',
                astrometryRunId: 'astrometry-1',
                photometricCalibrationRunId: 'calibration-1',
                centroidRunId: 'centroid-1',
                targetPhotometryRunId: 'target-1',
                sourceColor: 0.4,
                magnitude: 20.04,
                magnitudeUncertainty: 0.06,
                calculatedAt: '2026-07-30T00:04:00.000Z',
              },
            },
          },
        },
      },
    },
  };
}
