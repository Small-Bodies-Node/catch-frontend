import { TApiDataColState } from '../models/TApiDataColState';

/**
 * Determines whether a column is displayed and/or displayable in the table
 * Note: use Partial<> here because we don't want to display e.g. preview_url
 * in the checkbox dialog
 */

// export const apiDataInitColState: Readonly<Partial<TApiDataColState>> = {
export const apiDataInitColState: Readonly<TApiDataColState> = {
  // ================
  // Not shown at all
  // ================
  // ra: false,
  // dec: false,
  // source_name: true,
  // thumbnail_url: true,
  // ================
  // Shown by default
  // ================
  // raDec: true,
  ra: true,
  dec: true,
  date: true,
  delta: true,
  drh: true,
  dra: true,
  elong: true,
  rh: true,
  vmag: true,
  mjd_start: !true,
  mjd_stop: !true,
  // ================
  // Not shown by default
  // ================
  airmass: false,
  archive_url: false,
  cutout_url: false,
  ddec: false,
  designation: false,
  exposure: false,
  filter: false,
  instrument: false,
  // jd: false,
  maglimit: false,
  phase: false,
  preview_url: false, // permanent col
  product_id: false,
  rdot: false,
  sangle: false,
  seeing: false,
  // selong: false,
  source: false,
  source_name: false, // permanent col
  tmtp: false,
  true_anomaly: false,
  unc_a: false,
  unc_b: false,
  unc_theta: false,
  vangle: false,
};
