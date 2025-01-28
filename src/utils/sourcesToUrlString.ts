/**
 *
 */
export const sourcesToUrlString = (sources?: string[]): string => {
  const sourceStr = sources
    ? sources.reduce((acc, source) => {
        acc += '&sources=' + source;
        return acc;
      }, '')
    : '';
  return sourceStr;
};
