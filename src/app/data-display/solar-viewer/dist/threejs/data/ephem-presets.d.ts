import { SKEphem } from '../utils/sk-ephem';
/**
 * A dictionary containing ephemerides of planets and other well-known objects.
 * @example
 * const planet1 = viz.createObject('planet1', {
 *   ephem: EphemPresets.MERCURY,
 * });
 */
export declare const EphemPresets: {
    MERCURY: SKEphem;
    VENUS: SKEphem;
    EARTH: SKEphem;
    MOON: SKEphem;
    MARS: SKEphem;
    CERES: SKEphem;
    JUPITER: SKEphem;
    SATURN: SKEphem;
    URANUS: SKEphem;
    NEPTUNE: SKEphem;
    PLUTO: SKEphem;
    HAUMEA: SKEphem;
    MAKEMAKE: SKEphem;
    ERIS: SKEphem;
};
