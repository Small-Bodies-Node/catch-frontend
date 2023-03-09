/**
 * Strings of sources as needed for inputs to API
 * E.g. https://catch-v2.astro-prod-it.aws.umd.edu/catch?target=65P&sources=catalina_lemmon&sources=spacewatch&uncertainty_ellipse=false&padding=10&cached=true
 */
export const sources = [
  `neat_palomar_tricam`,
  `neat_maui_geodss`,
  `skymapper`,
  `ps1dr2`,
  `catalina_bigelow`,
  `catalina_lemmon`,
  `spacewatch`,
] as const;

export type TSources = typeof sources[number];
