import { IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ICentroidRun } from '../../../../../models/ICentroid';
import { ITargetPhotometryRun } from '../../../../../models/ITargetPhotometry';
import { createDefaultAstrometryInputs, getAstrometryResultGroups } from './cat-astrometry';
import { roundTargetPhotometryRequestPixels } from './cat-target-photometry';
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

  it('creates default astrometry inputs from datum fields and URL fallbacks', () => {
    const apiDatum = {
      cutout_url: 'https://example.test/cutout.fits?ra=123.45&dec=-54.321',
      date: '2025-01-01T01:02:03.123Z',
      filter: ' R ',
      product_id: 'product-1',
      source: 'ps1dr2',
      source_name: 'C/2025 A1',
    } as unknown as TApiDatum;

    expect(createDefaultAstrometryInputs(apiDatum)).toEqual(
      jasmine.objectContaining({
        image_url: apiDatum.cutout_url,
        ra: 123.45,
        dec: -54.321,
        pixel_scale: 0.25,
        obs_band: 'r',
        cal_band: 'r',
        catalog: 'PanSTARRS1',
      }),
    );
  });

  it('builds astrometry result groups with partial photometry warnings and cache rows', () => {
    const groups = getAstrometryResultGroups({
      status: 'partial_success',
      astrometry: {
        center_dec_deg: -2,
        center_ra_deg: 1,
        pixel_scale: 0.25,
      },
      photometry: {
        status: 'failed',
        error_type: 'calibration',
        message: 'No matches',
        stage: 'catalog',
      },
      request_id: 'request-1',
      sources: {
        detected: 10,
        matched: 0,
      },
      cache: {
        enabled: true,
        hit: false,
      },
    });

    expect(groups.map((group) => group.title)).toEqual([
      'Astrometric Calibration Output',
      'Photometric Calibration Output',
      'Sources',
      'Request',
    ]);
    expect(groups[3].rows).toContain(jasmine.objectContaining({ label: 'Cache status' }));
  });

  it('rounds target photometry requests without mutating the original draft', () => {
    const request = {
      file: 'cutout.fits',
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

  it('exports the CAT workflow from analysis item state', () => {
    const astrometryRun = createAstrometryRun();
    const centroidRun = createCentroidRun(astrometryRun);
    const photometryRun = createPhotometryRun(centroidRun);
    const item = createAnalysisItem(astrometryRun, centroidRun, photometryRun);

    const exported = createCatWorkflowExport(item, astrometryRun, '2026-06-24T00:00:00.000Z');

    expect(exported['exported_at']).toBe('2026-06-24T00:00:00.000Z');
    expect(getCatWorkflowExportFilename(item, astrometryRun)).toBe(
      'catch-cat-C-2025-A1-2025-01-01T01-02-03-astrometry-1.json',
    );
    expect(JSON.stringify(exported)).toContain('"applied_centralization"');
    expect(JSON.stringify(exported)).toContain('"centroid_run_id":"centroid-1"');
  });
});

function createAstrometryRun(): IAstrometryRun {
  return {
    id: 'astrometry-1',
    productId: 'product-1',
    sequence: 1,
    status: 'complete',
    createdAt: '2026-06-24T00:00:00.000Z',
    inputs: {
      image_url: 'cutout.fits',
      ra: 1,
      dec: 2,
      use_ra_dec: true,
      pixel_scale: 0.25,
      scale_low: null,
      scale_high: null,
      search_radius: 2,
      snr_threshold: 3,
      aperture_radius: 7,
      catalog: 'PanSTARRS1',
      obs_band: 'r',
      cal_band: 'r',
      return_plot: false,
      plot_type: 'color_correction',
    },
    result: {
      astrometry: {
        center_dec_deg: 2.1,
        center_ra_deg: 1.1,
        pixel_scale: 0.25,
      },
      sources: {
        detected: 10,
        matched: 8,
      },
    },
  };
}

function createCentroidRun(astrometryRun: IAstrometryRun): ICentroidRun {
  return {
    id: 'centroid-1',
    productId: astrometryRun.productId,
    astrometryRunId: astrometryRun.id,
    sequence: 1,
    status: 'complete',
    createdAt: '2026-06-24T00:01:00.000Z',
    inputs: {
      file: 'cutout.fits',
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

function createPhotometryRun(centroidRun: ICentroidRun): ITargetPhotometryRun {
  return {
    id: 'photometry-1',
    productId: centroidRun.productId,
    astrometryRunId: centroidRun.astrometryRunId,
    centroidRunId: centroidRun.id,
    sequence: 1,
    status: 'complete',
    createdAt: '2026-06-24T00:02:00.000Z',
    inputs: {
      file: 'cutout.fits',
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
    result: {
      aperture_flux: 123,
      aperture_fluxerr: 4,
    },
  };
}

function createAnalysisItem(
  astrometryRun: IAstrometryRun,
  centroidRun: ICentroidRun,
  photometryRun: ITargetPhotometryRun,
): IAnalysisItem {
  return {
    apiDatum: {
      cutout_url: 'cutout.fits',
      date: '2025-01-01T01:02:03.123Z',
      filter: 'r',
      product_id: astrometryRun.productId,
      source: 'ps1dr2',
      source_name: 'C/2025 A1',
    } as unknown as TApiDatum,
    productId: astrometryRun.productId,
    sourceName: 'C/2025 A1',
    date: '2025-01-01T01:02:03',
    isActive: true,
    astrometryRuns: [astrometryRun],
    astrometryCentralization: {
      productId: astrometryRun.productId,
      runId: astrometryRun.id,
      centerRaDeg: 1.1,
      centerDecDeg: 2.1,
    },
    centroidRunsState: {
      [astrometryRun.id]: [centroidRun],
    },
    centroidization: {
      productId: astrometryRun.productId,
      astrometryRunId: astrometryRun.id,
      centroidRunId: centroidRun.id,
      initX: 10,
      initY: 20,
      centX: 11,
      centY: 21,
    },
    targetPhotometryRunsState: {
      [astrometryRun.id]: {
        [centroidRun.id]: [photometryRun],
      },
    },
  };
}
