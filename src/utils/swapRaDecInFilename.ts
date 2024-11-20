/**
 * Unfortunately, the lambda function saves the images with filenames that
 * have the 'dec' coming before the 'ra', whereas 'ra' comes before 'dec' in
 * the URL string received from the API. So this hacky function swaps them
 */
export const swapRaDecInFilename = (input: string): string => {
  return input.replace(/(_ra_\d+_\d+)(_dec_\d+_\d+)/, '$2$1');
};
