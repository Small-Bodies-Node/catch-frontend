import { FormControl } from '@angular/forms';
import { nonNullable } from '../utils/nonNullable';

/**
 * SSOT for source labels. These MUST match the labels used in the API.
 * E.g. https://catch.astro.umd.edu.umd.edu/catch?target=65P&sources=catalina_lemmon&sources=spacewatch&cached=true
 */
export const sourceFormControlDict = {
  neat_palomar_tricam: new FormControl<boolean>(true, nonNullable),
  neat_maui_geodss: new FormControl<boolean>(true, nonNullable),
  skymapper_dr4: new FormControl<boolean>(true, nonNullable),
  ps1dr2: new FormControl<boolean>(true, nonNullable),
  catalina_bigelow: new FormControl<boolean>(true, nonNullable),
  catalina_lemmon: new FormControl<boolean>(true, nonNullable),
  catalina_bokneosurvey: new FormControl<boolean>(true, nonNullable),
  spacewatch: new FormControl<boolean>(true, nonNullable),
  loneos: new FormControl<boolean>(true, nonNullable),
  atlas_haleakela: new FormControl<boolean>(true, nonNullable),
  atlas_mauna_loa: new FormControl<boolean>(true, nonNullable),
} as const;

export const controlKeysForSources = Object.keys(
  sourceFormControlDict
) as Array<keyof typeof sourceFormControlDict>;

export type TControlKeyForSources = (typeof controlKeysForSources)[number];

export const controlLabelsDictForSources: {
  [K in TControlKeyForSources]: string;
} = {
  neat_palomar_tricam: 'NEAT Palomar Tricam',
  neat_maui_geodss: 'NEAT Maui GEODSS',
  skymapper_dr4: 'SkyMapper DR4',
  ps1dr2: 'PS1 DR2',
  catalina_bigelow: 'Catalina Bigelow',
  catalina_lemmon: 'Catalina Lemmon',
  catalina_bokneosurvey: 'Catalina Bok Neo Survey',
  spacewatch: 'Spacewatch',
  loneos: 'LONEOS',
  atlas_haleakela: 'ATLAS Haleakela',
  atlas_mauna_loa: 'ATLAS Mauna Loa',
} as const;
