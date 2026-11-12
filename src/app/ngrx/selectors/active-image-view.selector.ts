import { createSelector } from '@ngrx/store';
import { nativePreviewUrl } from '../../../utils/nativePreviewUrl';
import {
  selectApiActiveDatum,
  selectApiDataAstrometryRunsState,
  selectApiDataAstrometryCentralizationState,
} from './api-data.selectors';

/** Pair a preview with its WCS revision. Never put solved markers on old pixels. */
export const selectActiveImageView = createSelector(
  selectApiActiveDatum,
  selectApiDataAstrometryRunsState,
  selectApiDataAstrometryCentralizationState,
  (datum, runs, applied) => {
    if (!datum) return null;
    const runId = applied?.[datum.product_id]?.runId;
    const result = runs?.[datum.product_id]?.find(
      (run) => run.id === runId && run.status === 'complete',
    )?.result;
    // Old saved runs predate paired previews. Keep the native pair until rerun.
    const paired = result?.preview_url && result.wcs_image_url ? result : undefined;
    return {
      datum,
      previewUrl: paired?.preview_url ?? nativePreviewUrl(datum.preview_url, datum.cutout_url),
      fitsUrl: paired?.wcs_image_url ?? datum.cutout_url,
      revision: paired ? runId : 'native',
      hasSolutionPreview: !!paired,
    };
  },
);
