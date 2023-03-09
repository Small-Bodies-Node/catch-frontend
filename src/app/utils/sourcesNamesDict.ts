import { TSources } from '../models/TSources';

export const sourcesNamesDict: { [K in TSources]: string } = {
  neat_palomar_tricam: 'NEAT (Palomar)',
  neat_maui_geodss: 'NEAT (Haleakala)',
  skymapper: 'SkyMapper',
  ps1dr2: 'PanSTARRS1',
  catalina_bigelow: 'Catalina Sky Survey (Bigelow)',
  catalina_lemmon: 'Catalina Sky Survey (Lemmon)',
  spacewatch: 'Spacewatch MCS',
};
