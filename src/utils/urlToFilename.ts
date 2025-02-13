/**
 * Converts url to filename
 *
 * !IMPORTANT
 * ! This function MUST MATCH the function used in the sbn-solar-view project
 * ! I tried importing this file directly from the sbn-solar-view, but
 * ! that is built for the browser, and I need this in the server. It is
 * ! easier to just copy the function here.
 */
export const urlToFilename = (url: string) => {
  const filename = url
    .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric characters with underscores
    .toLowerCase(); // Convert to lowercase for uniformity

  // Implement alpha-numeric hash
  // const hash = crypto.createHash('sha256').update(url).digest('hex');
  // const filename = `${hash}.html`;

  // Limit the length of the filename to 255 characters
  return filename.slice(0, 500); // Ensure the filename ends with .html
};
