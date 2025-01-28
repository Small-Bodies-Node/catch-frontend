/**
 * Permitted values for the code filed to take when updating the API
 * status
 */
export type TApiStatusCode =
  | 'initiated' // Run this ONCE to kick things off
  | 'searching' // while searching
  | 'found' // data returned
  | 'notfound' // empty array returned
  | 'error'; // error occurred while fetching data
