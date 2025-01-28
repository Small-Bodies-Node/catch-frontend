import { TControlKeyForSources } from './TControlKeyForSources';

export interface ISearchParamsShared {
  start_date?: string | null;
  stop_date?: string | null;
  sources?: TControlKeyForSources[];
}
