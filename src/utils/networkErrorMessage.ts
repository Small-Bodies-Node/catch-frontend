/**
 * Text to show user when anything goes wrong during network stuff
 */
export const networkErrorMessage = (jobId?: string) =>
  `
An error occurred trying to connect to the server.
${jobId ? 'JobId: ' + jobId : ''}
Please check your connection and try again later.
If the problem persists, please contact support.
`.replace(/\s+/g, ' ');

export const dataApiTimeoutMessage = (routeName: string, jobId?: string) =>
  `
Warning: the CATCH data API ${routeName} request timed out after a long wait.
${jobId ? 'JobId: ' + jobId : ''}
The query may still be running server-side. Please bring this timeout to the
developer's attention with the route, target, selected sources, and job id if shown.
`.replace(/\s+/g, ' ');
