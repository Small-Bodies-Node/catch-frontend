import { TControlKeyForSources } from './TControlKeyForSources';

export interface IApiFixum {
  airmass: number | null;
  archive_url: string | null;
  'css:telescope'?: string;
  cutout_url: string | null;
  date: string;
  diff_url?: string | null; // Not in IMovum!
  exposure: number;
  filter: string | null;
  fov?: string; // Not in IMovum!
  maglimit: string | number | null;
  mjd_start: number;
  mjd_stop: number;
  preview_url: string | null;
  product_id: string;
  'ps1:frame_id'?: number;
  'ps1:projection_id'?: number;
  'ps1:skycell_id'?: number;
  seeing: number | null;
  source: TControlKeyForSources;
  source_name: string;
}
