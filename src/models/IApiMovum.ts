import { IApiFixum } from './IApiFixum';
import { TControlKeyForSources } from './TControlKeyForSources';

/**
 * NOTE: It is not strictly true that the data returned for moving object
 * search has all of the fields of the fixed object search.  However, there
 * are only 2 fields that are in the fixed object search that are not in the
 * moving object search, and so it is just easier to treat them as possibly absent
 */
export interface IApiMovum extends IApiFixum {
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
  source: TControlKeyForSources;
  source_name: string;
  thumbnail_url?: string | null;
  // tmtp?: number;
  // tmtp?: number;
  true_anomaly: number;
  unc_a: number;
  unc_b: number;
  unc_theta: number;
  vangle: number;
  vmag: number;
}
