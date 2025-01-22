import { TControlKeyForSources } from './TControlKeyForSources';

export interface IApiFixum {
  airmass: number | null;
  archive_url: string | null;
  cutout_url: string | null;
  date: string;
  exposure: number;
  filter: string | null;
  maglimit: string | number | null;
  mjd_start: number;
  mjd_stop: number;
  preview_url: string | null;
  product_id: string;
  seeing: number | null;
  source: TControlKeyForSources;
  source_name: string;
}
