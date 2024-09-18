/**
 * Returned by service method that reads the API /stream route
 */
export type TJobStreamResult =
  | { status: 'error'; message: string }
  | { status: 'success'; job_id: string };
