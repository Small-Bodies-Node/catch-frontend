import { createSelector } from '@ngrx/store';
import {
  selectApiDataAstrometryRunsState,
  selectApiDataAstrometryCentralizationState,
} from './api-data.selectors';

/** Table previews follow the same applied WCS revision as the full viewer. */
export const selectPreviewUrls = createSelector(
  selectApiDataAstrometryRunsState,
  selectApiDataAstrometryCentralizationState,
  (runs, applied): Record<string, string> =>
    Object.fromEntries(
      Object.entries(applied ?? {}).flatMap(([product, selection]) => {
        const result = runs?.[product]?.find(
          (run) => run.id === selection.runId && run.status === 'complete',
        )?.result;
        const url = result?.wcs_image_url ? result.preview_url : undefined;
        return url ? [[product, url]] : [];
      }),
    ),
);
