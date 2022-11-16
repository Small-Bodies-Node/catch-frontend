/**
 * The API has a route that streams stringified JSON messages
 * that, when parsed, have the following form
 */
export interface IApiServiceStream {
  job_prefix: string;
  text: string;
  status: 'success' | 'running' | 'queued' | 'error';
}
