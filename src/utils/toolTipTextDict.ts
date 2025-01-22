import { TControlKeyForLowerForm } from '../models/TControlKeyForLowerForm';

type IToolTipDict = {
  [K in TControlKeyForLowerForm]: string;
};

export const toolTipTextDict: IToolTipDict = {
  neat_maui_geodss:
    'Near-Earth Asteroid Tracking (NEAT) was a program run by NASA and the Jet Propulsion Laboratory, surveying the sky for near-Earth objects from December 1995 until April 2007. These are the images taken at GEODSS on Maui in Hawaii',
  neat_palomar_tricam:
    'Near-Earth Asteroid Tracking (NEAT) was a program run by NASA and the Jet Propulsion Laboratory, surveying the sky for near-Earth objects from December 1995 until April 2007. These are the images taken at the Palomar Observatory in California',
  skymapper_dr4:
    'SkyMapper is a fully automated 1.35 m (4.4 ft) wide-angle optical telescope at Siding Spring Observatory in northern New South Wales, Australia',

  ps1dr2:
    'Pan-STARRS1 Data Release 2. The Panoramic Survey Telescope and Rapid Response System (Pan-STARRS1) are located at Haleakala Observatory, Hawaii',

  catalina_bigelow:
    'Catalina Sky Survey images taken from Mount Bigelow Observatory near Tucson, Arizona',

  catalina_lemmon:
    'Catalina Sky Survey images taken from Mount Lemmon Observatory near Tucson, Arizona',

  catalina_bokneosurvey:
    'Catalina Sky Survey images taken from Mount Kitt Peak near Tuscon Arizona',

  spacewatch:
    'The Spacewatch Project is an astronomical survey that specializes in the study of minor planets, including various types of asteroids and comets at University of Arizona telescopes on Kitt Peak near Tucson, Arizona',

  atlas_haleakela:
    'ATLAS is an asteroid impact early warning system being developed by the University of Hawaii and funded by NASA. The system consists of two telescopes, 100 miles apart, which automatically scan the whole sky several times every night looking for moving objects. One telescope is located at Haleakala Observatory on the island of Maui, and the other is on Mauna Loa on the Big Island of Hawaii.',

  atlas_mauna_loa:
    'ATLAS is an asteroid impact early warning system being developed by the University of Hawaii and funded by NASA. The system consists of two telescopes, 100 miles apart, which automatically scan the whole sky several times every night looking for moving objects. One telescope is located at Haleakala Observatory on the island of Maui, and the other is on Mauna Loa on the Big Island of Hawaii.',

  loneos:
    'Lowell Observatory Near-Earth-Object Search (LONEOS) was an astronomical survey for near-Earth objects. The project began in 1993 and ended in 2008. The project was funded by the United States Air Force and was run by the Lowell Observatory in Flagstaff, Arizona.',

  select_all_sources_control: 'Select/deselect all sources',

  padding_input_control:
    'Increase the search area by padding the ephemeris by this amount, in units of arcmin (0 to 120)',

  uncertainty_ellipse_control:
    'Enable searches to account for an uncertainty ellipse using a polygonal approximation',

  use_cached_results_control:
    'If this query has been performed in the past then return the most recently computed results',

  start_time_input_control: 'Start time for the search',

  stop_time_input_control: 'Stop time for the search',

  intersection_type_input_control:
    'The type of intersection to use for the search',
};
