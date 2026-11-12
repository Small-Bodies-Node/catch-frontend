/** Use one cutout geometry for each native preview/FITS pair. */
export function nativePreviewUrl(
  preview: string | null | undefined,
  fits: string | null | undefined,
): string {
  if (!fits) return preview ?? '';
  try {
    const url = new URL(fits);
    if (url.hostname !== 'ps1images.stsci.edu' || url.pathname !== '/cgi-bin/fitscut.cgi')
      return preview ?? '';
    // PS1 size determines sky coverage; output_size only changes raster size.
    // Older CATCH responses use size=1199 for previews but size=720 for FITS.
    url.searchParams.set('format', 'png');
    url.searchParams.delete('output_size');
    return url.href;
  } catch {
    return preview ?? '';
  }
}
