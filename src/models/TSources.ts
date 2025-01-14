/**
 * Strings of sources as needed for inputs to API
 * E.g. https://catch.astro.umd.edu.umd.edu/catch?target=65P&sources=catalina_lemmon&sources=spacewatch&uncertainty_ellipse=false&padding=10&cached=true
 */
export const sources = [
  'neat_palomar_tricam',
  'neat_maui_geodss',
  'skymapper_dr4',
  'ps1dr2',
  'catalina_bigelow',
  'catalina_lemmon',
  'catalina_bokneosurvey',
  'spacewatch',
  'loneos',
  'atlas_haleakela',
  'atlas_mauna_loa',
] as const;

export type TSources = (typeof sources)[number];
