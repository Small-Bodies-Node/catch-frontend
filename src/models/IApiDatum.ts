/**
 * ps1:frame_id
 */
export interface IApiDatum {
  airmass: number | null;
  archive_url: string | null;
  'css:telescope'?: string;
  cutout_url: string | null;
  date: string;
  ddec: number;
  dec: number;
  delta: number;
  designation?: string;
  dra: number;
  drh: number;
  elong: number;
  exposure: number;
  filter: string | null;
  instrument?: string | null;
  jd?: number;
  maglimit: string | number | null;
  mjd_start: number;
  mjd_stop: number;
  phase: number;
  preview_url: string | null;
  product_id: string;
  'ps1:frame_id'?: number;
  'ps1:projection_id'?: number;
  'ps1:skycell_id'?: number;
  ra: number;
  // raDec?: string;
  rdot?: number;
  retrieved?: string;
  rh: number;
  sangle: number;
  seeing: number | null;
  // selong?: number;
  'skymapper:field_id'?: any;
  'skymapper:image_type'?: any;
  'skymapper:sb_mag'?: any;
  'skymapper:zpapprox'?: any;
  source: string;
  source_name: string;
  thumbnail_url?: string | null;
  tmtp?: number;
  true_anomaly: number;
  unc_a: number;
  unc_b: number;
  unc_theta: number;
  vangle: number;
  vmag: number;
}
