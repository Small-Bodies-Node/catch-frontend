/**
 *
 */
export const sourcesToUrlString = (sources?: string[]): string => {
  console.log('????', sources, typeof sources);
  const sourceStr = sources
    ? sources.reduce((acc, source) => {
        acc += '&sources=' + source;
        return acc;
      }, '')
    : '';
  return sourceStr;
};
