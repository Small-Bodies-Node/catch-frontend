/**
 * Returned by service method that reads the API /stream route
 */
export type TJobStreamResult =
  | { status: 'error'; message: string; job_id: string }
  | { status: 'success'; job_id: string };
