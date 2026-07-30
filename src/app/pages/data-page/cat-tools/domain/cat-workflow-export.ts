import { IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ITargetPhotometryRun } from '../../../../../models/ITargetPhotometry';
import { isAstrometryCentralizationApplied } from './cat-astrometry';
import { getCentroidRuns, isCentroidizationApplied } from './cat-centroid';
import { getPhotometricCalibrationRuns } from './cat-photometric-calibration';
import { getTargetPhotometryRuns } from './cat-target-photometry';
import { IAnalysisItem, ICatWorkflowRunExportMetadata } from './cat-tools.types';

export function createCatWorkflowExport(
  item: IAnalysisItem,
  run: IAstrometryRun,
  exportedAt = new Date().toISOString(),
): Record<string, unknown> {
  const photometricCalibrationRuns = getPhotometricCalibrationRuns(item, run);
  const centroidRuns = photometricCalibrationRuns.flatMap((calibrationRun) =>
    getCentroidRuns(item, run, calibrationRun),
  );
  const targetPhotometryRuns = centroidRuns.flatMap((centroidRun) =>
    getTargetPhotometryRuns(item, centroidRun),
  );

  return {
    export_type: 'catch-cat-workflow',
    export_version: 2,
    exported_at: exportedAt,
    product: {
      product_id: item.productId,
      source_name: item.sourceName,
      date: item.date,
    },
    source_datum: item.apiDatum,
    workflow: {
      step_1_astrometric_calibration: {
        inputs_label: 'STEP 1: Inputs for Astrometric Calibration',
        outputs_label: 'STEP 1: Outputs for Astrometric Calibration',
        run: getRunExportMetadata(run),
        inputs: run.inputs,
        outputs: run.result ?? null,
        error: run.error ?? null,
        applied_centralization: isAstrometryCentralizationApplied(item, run)
          ? item.astrometryCentralization
          : null,
      },
      step_2_photometric_calibration: {
        inputs_label: 'STEP 2: Inputs for Photometric Calibration',
        outputs_label: 'STEP 2: Outputs for Photometric Calibration',
        runs: photometricCalibrationRuns.map((calibrationRun) => ({
          run: getRunExportMetadata(calibrationRun),
          astrometry_run_id: calibrationRun.astrometryRunId,
          inputs: calibrationRun.inputs,
          outputs: calibrationRun.result ?? null,
          error: calibrationRun.error ?? null,
        })),
      },
      step_3_object_centroidization: {
        inputs_label: 'STEP 3: Inputs for Object Centroidization',
        outputs_label: 'STEP 3: Outputs for Object Centroidization',
        runs: centroidRuns.map((centroidRun) => ({
          run: getRunExportMetadata(centroidRun),
          astrometry_run_id: centroidRun.astrometryRunId,
          photometric_calibration_run_id: centroidRun.photometricCalibrationRunId,
          inputs: centroidRun.inputs,
          outputs: centroidRun.result ?? null,
          error: centroidRun.error ?? null,
          applied_centroidization: isCentroidizationApplied(item, centroidRun)
            ? item.centroidization
            : null,
        })),
      },
      step_4_target_photometry: {
        inputs_label: 'STEP 4: Inputs for Target Photometry',
        outputs_label: 'STEP 4: Outputs for Target Photometry',
        runs: targetPhotometryRuns.map(getTargetPhotometryRunExport),
      },
      step_5_calculated_source_magnitude: {
        calculations: targetPhotometryRuns.flatMap((targetRun) => {
          const calculation =
            item.sourceMagnitudeState?.[targetRun.astrometryRunId]?.[
              targetRun.photometricCalibrationRunId
            ]?.[targetRun.centroidRunId]?.[targetRun.id];
          return calculation ? [calculation] : [];
        }),
      },
    },
  };
}

export function getRunExportMetadata(run: {
  id: string;
  sequence: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}): ICatWorkflowRunExportMetadata {
  return {
    id: run.id,
    sequence: run.sequence,
    status: run.status,
    created_at: run.createdAt,
    completed_at: run.completedAt,
  };
}

export function getCatWorkflowExportFilename(item: IAnalysisItem, run: IAstrometryRun): string {
  const sourceName = getDownloadFilenameToken(item.sourceName, item.productId);
  const date = getDownloadFilenameToken(item.date, 'date');
  return `catch-cat-${sourceName}-${date}-astrometry-${run.sequence}.json`;
}

export function getDownloadFilenameToken(
  value: string | null | undefined,
  fallback: string,
): string {
  const token = (value || fallback)
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return token || fallback;
}

function getTargetPhotometryRunExport(photometryRun: ITargetPhotometryRun): {
  run: ICatWorkflowRunExportMetadata;
  astrometry_run_id: string;
  photometric_calibration_run_id: string;
  centroid_run_id: string;
  inputs: ITargetPhotometryRun['inputs'];
  outputs: ITargetPhotometryRun['result'] | null;
  error: string | null;
} {
  return {
    run: getRunExportMetadata(photometryRun),
    astrometry_run_id: photometryRun.astrometryRunId,
    photometric_calibration_run_id: photometryRun.photometricCalibrationRunId,
    centroid_run_id: photometryRun.centroidRunId,
    inputs: photometryRun.inputs,
    outputs: photometryRun.result ?? null,
    error: photometryRun.error ?? null,
  };
}
