import { IAstrometryRun } from '../../../../../models/IAstrometryRun';
import { ITargetPhotometryRun } from '../../../../../models/ITargetPhotometry';
import { isAstrometryCentralizationApplied } from './cat-astrometry';
import { getCentroidRuns, isCentroidizationApplied } from './cat-centroid';
import { getTargetPhotometryRuns } from './cat-target-photometry';
import { IAnalysisItem, ICatWorkflowRunExportMetadata } from './cat-tools.types';

export function createCatWorkflowExport(
  item: IAnalysisItem,
  run: IAstrometryRun,
  exportedAt = new Date().toISOString(),
): Record<string, unknown> {
  const centroidRuns = getCentroidRuns(item, run);

  return {
    export_type: 'catch-cat-workflow',
    export_version: 1,
    exported_at: exportedAt,
    product: {
      product_id: item.productId,
      source_name: item.sourceName,
      date: item.date,
    },
    source_datum: item.apiDatum,
    workflow: {
      step_1_astrometric_corrections: {
        inputs_label: 'STEP 1: Inputs for Astrometric Corrections',
        outputs_label: 'STEP 1: Outputs for Astrometric Corrections',
        run: getRunExportMetadata(run),
        inputs: run.inputs,
        outputs: run.result ?? null,
        error: run.error ?? null,
        applied_centralization: isAstrometryCentralizationApplied(item, run)
          ? item.astrometryCentralization
          : null,
      },
      step_2_object_centroidization: {
        inputs_label: 'STEP 2: Inputs for Object Centroidization',
        outputs_label: 'STEP 2: Outputs for Object Centroidization',
        runs: centroidRuns.map((centroidRun) => ({
          run: getRunExportMetadata(centroidRun),
          astrometry_run_id: centroidRun.astrometryRunId,
          inputs: centroidRun.inputs,
          outputs: centroidRun.result ?? null,
          error: centroidRun.error ?? null,
          applied_centroidization: isCentroidizationApplied(item, centroidRun)
            ? item.centroidization
            : null,
        })),
      },
      step_3_target_photometry: {
        inputs_label: 'STEP 3: Inputs for Target Photometry',
        outputs_label: 'STEP 3: Outputs for Target Photometry',
        runs: centroidRuns.flatMap((centroidRun) =>
          getTargetPhotometryRuns(item, centroidRun).map((photometryRun) =>
            getTargetPhotometryRunExport(photometryRun),
          ),
        ),
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
  centroid_run_id: string;
  inputs: ITargetPhotometryRun['inputs'];
  outputs: ITargetPhotometryRun['result'] | null;
  error: string | null;
} {
  return {
    run: getRunExportMetadata(photometryRun),
    astrometry_run_id: photometryRun.astrometryRunId,
    centroid_run_id: photometryRun.centroidRunId,
    inputs: photometryRun.inputs,
    outputs: photometryRun.result ?? null,
    error: photometryRun.error ?? null,
  };
}
