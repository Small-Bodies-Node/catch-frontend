export const defaultAstrometryPixelScale = 2.5;

export interface IAstrometryPixelScaleDatum {
  source?: string | null;
  archive_url?: string | null;
  product_id?: string | null;
  cutout_url?: string | null;
  preview_url?: string | null;
  pixel_scale?: unknown;
}

export function getAstrometryPixelScale(apiDatum: IAstrometryPixelScaleDatum): number {
  switch (apiDatum.source) {
    case 'atlas_haleakela':
    case 'atlas_mauna_loa':
    case 'atlas_rio_hurtado':
    case 'atlas_sutherland':
      return 1.86;
    case 'skymapper_dr4':
      return 0.5;
    case 'spacewatch':
      return 1.0;
    case 'ps1dr2':
      return 0.25;
    case 'neat_palomar_tricam':
      return 1.01;
    case 'neat_maui_geodss':
      return 1.43;
    case 'loneos':
      return 2.53;
    case 'catalina_bigelow':
    case 'catalina_lemmon':
    case 'catalina_bokneosurvey':
      return getCatalinaAstrometryPixelScale(apiDatum) ?? defaultAstrometryPixelScale;
    default:
      return getOptionalPixelScale(apiDatum) ?? defaultAstrometryPixelScale;
  }
}

export function getCatalinaAstrometryPixelScale(
  apiDatum: IAstrometryPixelScaleDatum,
): number | null {
  switch (getCatalinaImageType(apiDatum)) {
    case '703':
      return 2.5;
    case 'V06':
      return 0.6;
    case 'G96':
      return 1.5;
    case 'I51':
    case 'I52':
      return 1.0;
    default:
      return null;
  }
}

export function getCatalinaImageType(apiDatum: IAstrometryPixelScaleDatum): string | null {
  return (
    getCatalinaImageTypeFromValue(apiDatum.archive_url) ??
    getCatalinaImageTypeFromValue(apiDatum.product_id) ??
    getCatalinaImageTypeFromValue(apiDatum.cutout_url) ??
    getCatalinaImageTypeFromValue(apiDatum.preview_url)
  );
}

export function getCatalinaImageTypeFromValue(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  let decodedValue = value;
  try {
    decodedValue = decodeURIComponent(value);
  } catch {
    decodedValue = value;
  }

  const match = decodedValue.match(/data_calibrated[:/]([a-z0-9]+)(?:[_/:?]|$)/i);
  return match?.[1]?.toUpperCase() ?? null;
}

function getOptionalPixelScale(apiDatum: IAstrometryPixelScaleDatum): number | null {
  return typeof apiDatum.pixel_scale === 'number' && Number.isFinite(apiDatum.pixel_scale)
    ? apiDatum.pixel_scale
    : null;
}
