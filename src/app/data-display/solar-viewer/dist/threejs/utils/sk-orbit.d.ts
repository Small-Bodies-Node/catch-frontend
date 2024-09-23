import * as THREE from 'three';
import { SKEphemerisTable } from './sk-ephemeris-table';
import { SKEphem } from './sk-ephem';
/**
 * Enum of orbital types.
 */
declare enum OrbitType {
    UNKNOWN = 0,
    PARABOLIC = 1,
    HYPERBOLIC = 2,
    ELLIPTICAL = 3,
    TABLE = 4
}
/**
 * Get the type of orbit. Returns one of OrbitType.PARABOLIC, HYPERBOLIC,
 * ELLIPTICAL, or UNKNOWN.
 * @return {OrbitType} Name of orbit type
 */
export declare function getOrbitType(ephem: SKEphem | SKEphemerisTable): OrbitType.PARABOLIC | OrbitType.HYPERBOLIC | OrbitType.ELLIPTICAL | OrbitType.TABLE;
interface IOptions {
    color: string;
    eclipticLineColor: string;
    orbitPathSettings: {
        leadDurationYears: number;
        trailDurationYears: number;
        numberSamplePoints: number;
    };
}
/**
 * A class that builds a visual representation of a Kepler orbit.
 * @example
 * const orbit = new Spacekit.Orbit({
 *   ephem: new Spacekit.Ephem({...}),
 *   options: {
 *     color: 0xFFFFFF,
 *     eclipticLineColor: 0xCCCCCC,
 *   },
 * });
 */
export declare class SKOrbit {
    private _ephem;
    private _options;
    private _orbitPoints?;
    private _eclipticDropLines?;
    private _orbitShape?;
    private _orbitStart;
    private _orbitStop;
    private _orbitType;
    /**
     * @param {(SKEphem | SKEphemerisTable)} ephem The ephemerides that define this orbit.
     * @param {Object} options
     * @param {Object} options.color The color of the orbital ellipse.
     * @param {Object} options.orbitPathSettings settings for the path
     * @param {Object} options.orbitPathSettings.leadDurationYears orbit path lead time in years
     * @param {Object} options.orbitPathSettings.trailDurationYears orbit path trail time in years
     * @param {Object} options.orbitPathSettings.numberSamplePoints number of
     * points to use when drawing the orbit line. Only applicable for
     * non-elliptical and ephemeris table orbits.
     * @param {Object} options.eclipticLineColor The color of lines drawn
     * perpendicular to the ecliptic in order to illustrate depth (defaults to
     * 0x333333).
     */
    constructor(_ephem: SKEphem | SKEphemerisTable, options: Partial<IOptions>);
    /**
     * Get heliocentric position of object at a given JD.
     * @param {Number} jd Date value in JD.
     * @param {boolean} debug Set true for debug output.
     * @return {Array.<Number>} [X, Y, Z] coordinates
     */
    getPositionAtTime(jd: number, debug?: boolean): number[];
    getPositionAtTimeParabolic(jd: number, _debug?: boolean): number[];
    getPositionAtTimeNearParabolic(jd: number, _debug?: boolean): number[];
    getPositionAtTimeHyperbolic(jd: number, _debug?: boolean): number[];
    getPositionAtTimeElliptical(jd: number, _debug?: boolean): number[];
    getPositionAtTimeTable(jd: number, _debug?: boolean): number[];
    /**
     * Given true anomaly and heliocentric distance, returns the scaled heliocentric coordinates (X, Y, Z)
     * @param {Number} v True anomaly
     * @param {Number} r Heliocentric distance
     * @return {Array.<Number>} Heliocentric coordinates
     */
    vectorToHeliocentric(v: number, r: number): number[];
    /**
     * Returns whether the requested epoch is within the current orbit's
     * definition. Used only for ephemeris tables.
     * @param {Number} jd
     * @return {boolean} true if it is within the orbit span, false if not
     */
    needsUpdateForTime(jd: number): boolean;
    /**
     * Calculates, caches, and returns the orbit state for this orbit around this time
     * @param {Number} jd center time of the orbit (only used for ephemeris table ephemeris)
     * @param {boolean} forceCompute forces the recomputing of the orbit on this call
     * @return {THREE.Line}
     */
    getOrbitShape(jd?: number, forceCompute?: boolean): THREE.BufferGeometry;
    /**
     * Compute a line between a given date range.
     * @private
     */
    getLine(orbitFn: (_: number) => number[], startJd: number, endJd: number, step: number): THREE.BufferGeometry;
    /**
     * Returns the orbit for a table lookup orbit definition
     * @private
     * @param {Number} startJd start of orbit in JDate format
     * @param {Number} stopJd end of orbit in JDate format
     * @param {Number} step step size in days
     * @return {THREE.Line}
     */
    getTableOrbit(startJd: number, stopJd: number, step: number): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    /**
     * @private
     * @return {THREE.Line} The ellipse object that represents this orbit.
     */
    getEllipse(): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    /**
     * @private
     * @return {THREE.Geometry} A THREE.js geometry
     */
    getEllipseGeometry(): THREE.BufferGeometry;
    /**
     * @private
     */
    generateAndCacheOrbitShape(pointGeometry: THREE.BufferGeometry): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    /**
     * A geometry containing line segments that run between the orbit ellipse and
     * the ecliptic plane of the solar system. This is a useful visual effect
     * that makes it easy to tell when an orbit goes below or above the ecliptic
     * plane.
     * @return {THREE.Geometry} A geometry with many line segments.
     */
    getLinesToEcliptic(): THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    /**
     * Get the color of this orbit.
     * @return {Number} The hexadecimal color of the orbital ellipse.
     */
    getHexColor(): number | undefined;
    /**
     * @param {Number} hexVal The hexadecimal color of the orbital ellipse.
     */
    setHexColor(hexVal: string): void;
    /**
     * Get the visibility of this orbit.
     * @return {boolean} Whether the orbital ellipse is visible. Note that
     * although the ellipse may not be visible, it is still present in the
     * underlying Scene and Simultation.
     */
    getVisibility(): boolean | undefined;
    /**
     * Change the visibility of this orbit.
     * @param {boolean} val Whether to show the orbital ellipse.
     */
    setVisibility(val: boolean): void;
}
export {};
