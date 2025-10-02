/**
 * Dashboard observations/sources data structure
 */
// export interface IDashboardObservations {
//   sources: IDashboardSource[];
//   total_count?: number;
//   last_updated?: string;
// }

export interface IDashboardSource {
  source: string;
  source_name: string;
  count: number;
  nights: number;
  start_date: string;
  stop_date: string;
  updated: string;
  is_active?: boolean;
  last_observation?: string;
  error_rate?: number;
}
