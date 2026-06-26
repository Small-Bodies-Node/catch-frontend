/**
 *
 */
export const sourcesToUrlString = (sources?: string[]): string => {
  if (!sources?.length) return '';

  const params = new URLSearchParams();
  sources.forEach((source) => params.append('sources', source));
  return `&${params.toString()}`;
};
