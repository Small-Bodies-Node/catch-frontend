/**
 * Dashboard queue data structure
 */
export interface IDashboardQueue {
  full: boolean;
  depth: number;
  jobs: IDashboardJob[];
}

export interface IDashboardJob {
  prefix: string;
  status: string;
  enqueued_at: string;
  job_id?: string;
  priority?: number;
}
