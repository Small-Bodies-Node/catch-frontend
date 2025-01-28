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
