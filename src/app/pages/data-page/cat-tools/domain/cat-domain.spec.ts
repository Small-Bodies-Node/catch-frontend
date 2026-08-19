import { IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ICentroidRun } from '../../../../../models/ICentroid';
import {
  IPhotometricCalibrationRun,
  photometricCalibrationCatalogs,
} from '../../../../../models/IPhotometricCalibrationRun';
import { ITargetPhotometryRun } from '../../../../../models/ITargetPhotometry';
import { createDefaultAstrometryInputs, getAstrometryResultGroups } from './cat-astrometry';
import {
  createDefaultPhotometricCalibrationInputs,
  getPhotometricCalibrationPlots,
} from './cat-photometric-calibration';
import { calculateSourceMagnitude } from './cat-source-magnitude';
import {
  getPhotometricCalibrationCatalogConfiguration,
  isPhotometricCalibrationBandSupported,
  isPhotometricCalibrationColorTermSupported,
  reconcilePhotometricCalibrationCatalog,
} from './cat-photometric-catalog';
import {
  createDefaultTargetPhotometryInputs,
  roundTargetPhotometryRequestPixels,
} from './cat-target-photometry';
import { formatDatumValue } from './cat-tools-formatters';
import { IAnalysisItem, TApiDatum } from './cat-tools.types';
import { createCatWorkflowExport, getCatWorkflowExportFilename } from './cat-workflow-export';

describe('cat tools domain', () => {
  it('formats datum values consistently for CAT result rows', () => {
    expect(formatDatumValue(null)).toBe('N/A');
    expect(formatDatumValue('')).toBe('N/A');
    expect(formatDatumValue(3)).toBe('3');
    expect(formatDatumValue(3.14159265)).toBe('3.141593');
  });

  it('creates constrained astrometry inputs without combined photometry fields', () => {
    const apiDatum = createApiDatum();
    const inputs = createDefaultAstrometryInputs(apiDatum);

    expect(inputs).toEqual(
      jasmine.objectContaining({
        image_url: apiDatum.cutout_url,
        ra: 123.45,
        dec: -54.321,
        use_ra_dec: true,
        pixel_scale: 0.25,
        snr_threshold: 3,
      }),
    );
    expect(inputs).not.toEqual(jasmine.objectContaining({ obs_band: jasmine.anything() }));
    expect(inputs).not.toEqual(jasmine.objectContaining({ return_plot: jasmine.anything() }));
    expect(inputs).not.toEqual(jasmine.objectContaining({ plot_type: jasmine.anything() }));
  });

  it('formats the separated astrometry response and treats a disabled cache as informational', () => {
    const groups = getAstrometryResultGroups(createAstrometryRun().result!);

    expect(groups.map((group) => group.title)).toEqual([
      'Astrometric Calibration Output',
      'Request',
    ]);
    expect(groups[0].rows).toContain(
      jasmine.objectContaining({ label: 'WCS FITS URL', value: 'https://example.test/wcs.fits' }),
    );
    expect(groups[1].rows).toContain(
      jasmine.objectContaining({ label: 'Cache status', value: 'Backend cache disabled' }),
    );
  });

  it('creates the default Stage 2 request from wcs_image_url without obs_band', () => {
    const inputs = createDefaultPhotometricCalibrationInputs(createAstrometryRun());

    expect(inputs).toEqual({
      wcs_image_url: 'https://example.test/wcs.fits',
      snr_threshold: 3,
      aperture_radius: 7,
      catalog: 'PanSTARRS1',
      cal_band: 'r',
      color_term: 'g-r',
    });
    expect(inputs).not.toEqual(jasmine.objectContaining({ obs_band: jasmine.anything() }));
  });

  it('defines the exact backend catalogues and compatible bands', () => {
    expect(photometricCalibrationCatalogs).toEqual(['PanSTARRS1', 'Gaia', 'SkyMapper']);
    expect(getPhotometricCalibrationCatalogConfiguration('PanSTARRS1').bands).toEqual([
      'g',
      'r',
      'i',
      'z',
      'y',
    ]);
    expect(getPhotometricCalibrationCatalogConfiguration('Gaia').bands).toEqual(['G', 'bp', 'rp']);
    expect(getPhotometricCalibrationCatalogConfiguration('SkyMapper').bands).toEqual([
      'u',
      'v',
      'g',
      'r',
      'i',
      'z',
    ]);
  });

  it('preserves compatible catalogue values and resets incompatible values', () => {
    const inputs = createDefaultPhotometricCalibrationInputs(createAstrometryRun());

    expect(reconcilePhotometricCalibrationCatalog(inputs, 'SkyMapper')).toEqual(
      jasmine.objectContaining({ catalog: 'SkyMapper', cal_band: 'r', color_term: 'g-r' }),
    );
    expect(reconcilePhotometricCalibrationCatalog(inputs, 'Gaia')).toEqual(
      jasmine.objectContaining({ catalog: 'Gaia', cal_band: 'G', color_term: 'bp-rp' }),
    );
    expect(
      reconcilePhotometricCalibrationCatalog(
        { ...inputs, catalog: 'SkyMapper', cal_band: 'u', color_term: 'u-v' },
        'PanSTARRS1',
      ),
    ).toEqual(
      jasmine.objectContaining({ catalog: 'PanSTARRS1', cal_band: 'r', color_term: 'g-r' }),
    );
    expect(isPhotometricCalibrationBandSupported('Gaia', 'G')).toBeTrue();
    expect(isPhotometricCalibrationBandSupported('Gaia', 'g')).toBeFalse();
    expect(isPhotometricCalibrationColorTermSupported('Gaia', 'bp-rp')).toBeTrue();
    expect(isPhotometricCalibrationColorTermSupported('Gaia', 'g-r')).toBeFalse();
  });

  it('returns both nested diagnostic plot URLs', () => {
    const plots = getPhotometricCalibrationPlots(createCalibrationRun().result!);

    expect(plots).toEqual([
      { label: 'Color correction', url: 'https://example.test/color.png' },
      { label: 'Image overlay', url: 'https://example.test/overlay.png' },
    ]);
  });

  it('calculates calibrated magnitude and uncertainty with the prescribed formulas', () => {
    const result = calculateSourceMagnitude({
      sourceColor: 0.4,
      targetPhotometryResult: {
        aperture_flux: 100,
        aperture_fluxerr: 5,
      },
      photometricCalibrationResult: createCalibrationRun().result!,
    });

    expect(result.success).toBeTrue();
    if (!result.success) return;
    expect(result.magnitude).toBeCloseTo(20.04, 12);
    expect(result.magnitudeUncertainty).toBeCloseTo(
      Math.sqrt(0.02 ** 2 + ((1.0857 * 5) / 100) ** 2),
      12,
    );
  });

  it('rejects an empty source color and nonpositive aperture flux', () => {
    const calibrationResult = createCalibrationRun().result!;

    expect(
      calculateSourceMagnitude({
        sourceColor: null,
        targetPhotometryResult: { aperture_flux: 100, aperture_fluxerr: 5 },
        photometricCalibrationResult: calibrationResult,
      }),
    ).toEqual(
      jasmine.objectContaining({ success: false, error: jasmine.stringMatching(/color/i) }),
    );

    expect(
      calculateSourceMagnitude({
        sourceColor: 0.4,
        targetPhotometryResult: { aperture_flux: 0, aperture_fluxerr: 5 },
        photometricCalibrationResult: calibrationResult,
      }),
    ).toEqual(jasmine.objectContaining({ success: false, error: jasmine.stringMatching(/flux/i) }));
  });

  it('uses the photometrically calibrated FITS for target aperture photometry', () => {
    const inputs = createDefaultTargetPhotometryInputs(createCentroidRun());

    expect(inputs.file).toBe('https://example.test/photometry.fits');
  });

  it('rounds target photometry requests without mutating the original draft', () => {
    const request = {
      file: 'photometry.fits',
      target_aperture_params: {
        shape: 'Circular' as const,
        position: [1.4, 2.6] as [number, number],
        size: 4.6,
        inner_r: 0,
        outer_r: 0,
      },
      background_aperture_params: {
        shape: 'Circular_Annulus' as const,
        position: [1.4, 2.6] as [number, number],
        size: 4.6,
        inner_r: 4.6,
        outer_r: 9.2,
      },
    };

    const rounded = roundTargetPhotometryRequestPixels(request);

    expect(rounded.target_aperture_params.position).toEqual([1, 3]);
    expect(rounded.background_aperture_params.outer_r).toBe(9);
    expect(request.target_aperture_params.position).toEqual([1.4, 2.6]);
  });

  it('exports all five workflow stages and calibration lineage', () => {
    const astrometryRun = createAstrometryRun();
    const calibrationRun = createCalibrationRun();
    const centroidRun = createCentroidRun();
    const targetRun = createTargetPhotometryRun();
    const item = createAnalysisItem(astrometryRun, calibrationRun, centroidRun, targetRun);

    const exported = createCatWorkflowExport(item, astrometryRun, '2026-07-30T00:00:00.000Z');
    const json = JSON.stringify(exported);

    expect(exported['export_version']).toBe(2);
    expect(getCatWorkflowExportFilename(item, astrometryRun)).toBe(
      'catch-cat-C-2025-A1-2025-01-01T01-02-03-astrometry-1.json',
    );
    expect(json).toContain('"step_2_photometric_calibration"');
    expect(json).toContain('"step_5_calculated_source_magnitude"');
    expect(json).toContain('"photometric_calibration_run_id":"calibration-1"');
    expect(json).toContain('"magnitude":20.04');
  });
});

function createApiDatum(): TApiDatum {
  return {
    cutout_url: 'https://example.test/cutout.fits?ra=123.45&dec=-54.321',
    date: '2025-01-01T01:02:03.123Z',
    filter: 'r',
    product_id: 'product-1',
    source: 'ps1dr2',
    source_name: 'C/2025 A1',
  } as unknown as TApiDatum;
}

function createAstrometryRun(): IAstrometryRun {
  return {
    id: 'astrometry-1',
    productId: 'product-1',
    sequence: 1,
    status: 'complete',
    createdAt: '2026-07-30T00:00:00.000Z',
    inputs: {
      image_url: 'https://example.test/cutout.fits',
      ra: 123.45,
      dec: -54.321,
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
      center_ra_deg: 123.46,
      center_dec_deg: -54.32,
      pixel_scale: 0.25,
      request_id: 'astrometry-request',
      cache: { enabled: false, hit: false, key: null },
    },
  };
}

function createCalibrationRun(): IPhotometricCalibrationRun {
  return {
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
        color_correction: { url: 'https://example.test/color.png', s3_key: 'color.png' },
        image_overlay: { url: 'https://example.test/overlay.png', s3_key: 'overlay.png' },
      },
      request_id: 'photometry-request',
      cache: { enabled: true, hit: false, key: 'photometry-cache' },
    },
  };
}

function createCentroidRun(): ICentroidRun {
  return {
    id: 'centroid-1',
    productId: 'product-1',
    astrometryRunId: 'astrometry-1',
    photometricCalibrationRunId: 'calibration-1',
    sequence: 1,
    status: 'complete',
    createdAt: '2026-07-30T00:02:00.000Z',
    inputs: {
      file: 'https://example.test/photometry.fits',
      target_x: 10,
      target_y: 20,
      search_radius: 7,
    },
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
}

function createTargetPhotometryRun(): ITargetPhotometryRun {
  return {
    id: 'target-1',
    productId: 'product-1',
    astrometryRunId: 'astrometry-1',
    photometricCalibrationRunId: 'calibration-1',
    centroidRunId: 'centroid-1',
    sequence: 1,
    status: 'complete',
    createdAt: '2026-07-30T00:03:00.000Z',
    inputs: {
      file: 'https://example.test/photometry.fits',
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
    result: { aperture_flux: 100, aperture_fluxerr: 5 },
  };
}

function createAnalysisItem(
  astrometryRun: IAstrometryRun,
  calibrationRun: IPhotometricCalibrationRun,
  centroidRun: ICentroidRun,
  targetRun: ITargetPhotometryRun,
): IAnalysisItem {
  return {
    apiDatum: createApiDatum(),
    productId: 'product-1',
    sourceName: 'C/2025 A1',
    date: '2025-01-01T01:02:03',
    isActive: true,
    astrometryRuns: [astrometryRun],
    astrometryCentralization: {
      productId: 'product-1',
      runId: 'astrometry-1',
      centerRaDeg: 123.46,
      centerDecDeg: -54.32,
    },
    photometricCalibrationRunsState: { 'astrometry-1': [calibrationRun] },
    centroidRunsState: { 'astrometry-1': { 'calibration-1': [centroidRun] } },
    centroidization: {
      productId: 'product-1',
      astrometryRunId: 'astrometry-1',
      photometricCalibrationRunId: 'calibration-1',
      centroidRunId: 'centroid-1',
      initX: 10,
      initY: 20,
      centX: 11,
      centY: 21,
    },
    targetPhotometryRunsState: {
      'astrometry-1': { 'calibration-1': { 'centroid-1': [targetRun] } },
    },
    sourceMagnitudeState: {
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
              magnitudeUncertainty: 0.057851,
              calculatedAt: '2026-07-30T00:04:00.000Z',
            },
          },
        },
      },
    },
  };
}
