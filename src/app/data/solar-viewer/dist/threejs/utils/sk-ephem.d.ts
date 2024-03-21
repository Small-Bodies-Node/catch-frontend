declare const EPHEM_VALID_ATTRS_ARR: readonly ["a", "e", "i", "q", "epoch", "period", "tp", "ma", "n", "L", "om", "w", "wBar", "GM"];
declare type TEphemValidAttrs = typeof EPHEM_VALID_ATTRS_ARR[number];
declare type TInitialValues = {
    [k in TEphemValidAttrs]: number;
};
/**
 * A class representing Kepler ephemerides.
 * @example
 * const NEPTUNE = new Ephem({
 *   epoch: 2458426.500000000,
 *   a: 3.009622263428050E+01,
 *   e: 7.362571187193770E-03,
 *   i: 1.774569249829094E+00,
 *   om: 1.318695882492132E+02,
 *   w: 2.586226409499831E+02,
 *   ma: 3.152804988924479E+02,
 * }, 'deg'),
 */
export declare class SKEphem {
    /**
     * Defaults to GM.SUN.  @see {GM}
     * @param {'deg'|'rad'} units The unit of angles in the list of initial values.
     */
    _attrs: Partial<TInitialValues>;
    _locked: boolean;
    actualUnits?: string;
    constructor(initialValues: Partial<TInitialValues>, units?: string, locked?: boolean);
    /**
     * Sets an ephemerides attribute.
     * @param {String} attr The name of the attribute (e.g. 'a')
     * @param {Number} val The value of the attribute (e.g. 0.5)
     * @param {'deg'|'rad'} units The unit of angle provided, if applicable.
     */
    set(attr: TEphemValidAttrs, val: number, units?: string): boolean;
    /**
     * Gets an ephemerides attribute.
     * @param {String} attr The name of the attribute (e.g. 'a')
     * @param {'deg'|'rad'} units The unit of angle desired, if applicable. This
     * input is ignored for values that are not angle measurements.
     */
    get(attr: TEphemValidAttrs, units?: string): number;
    /**
     * DWD Added
     */
    getAttrs(): Partial<TInitialValues>;
    /**
     * @private
     * Infers values of some ephemerides attributes if the required information
     * is available.
     */
    fill(): void;
    /**
     * Make this ephem object immutable.
     */
    lock(): void;
    copy(): SKEphem;
}
/**
 * Standard gravitational parameter for objects orbiting these bodies.
 * Units in m^3/s^2
 */
export declare const GM: {
    SUN: number;
    MERCURY: number;
    VENUS: number;
    EARTH_MOON: number;
    MARS: number;
    JUPITER: number;
    SATURN: number;
    URANUS: number;
    NEPTUNE: number;
    PLUTO_CHARON: number;
};
export {};
