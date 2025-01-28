import { TApiFixedColState } from '../models/TApiFixedColState';

/**
 * Determines whether a column is displayed and/or displayable in the table
 * Note: use Partial<> here because we don't want to display e.g. preview_url
 * in the checkbox dialog
 */

// export const apiDataInitColState: Readonly<Partial<TApiDataColState>> = {
export const apiFixedInitColState: Readonly<TApiFixedColState> = {
  date: true,
  mjd_start: true,
  mjd_stop: true,
  // ================
  // Not shown by default
  // ================
  airmass: true,
  archive_url: true,
  cutout_url: true,
  exposure: true,
  filter: true,
  maglimit: true,
  preview_url: true, // permanent col
  product_id: true,
  seeing: true,
  source: true,
  source_name: true, // permanent col
  //
  diff_url: false,
  fov: false,
  'css:telescope': false,
  'ps1:frame_id': false,
  'ps1:projection_id': false,
  'ps1:skycell_id': false,
};
