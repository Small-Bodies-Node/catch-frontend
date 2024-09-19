interface IEphemerisData {
    data: number[][];
    ephemerisType: string;
    distanceUnits: 'au';
    timeUnits: 'day';
    interpolationType: string;
    interpolationOrder: number;
}
/**
 * This class encapsulates the data and necessary methods for operating with look up ephemeris data.
 * Users of the class pass in their ephemeris data as a data structure with the data and the settings for the ephemeris.
 * The settings include things like the units, and the ephemeris representation. The ephemeris data itself is an array
 * of arrays where each line constitute the necessary components of the line.
 *
 * For 'cartesianposvel' style ephemeris each line of data looks like: [Julian Date, X, Y, Z, Vx, Vy, Vz]
 */
export declare class SKEphemerisTable {
    private _units;
    private _ephemType;
    private _interpolationType;
    private _interpolationOrder;
    private _data;
    /**
     * @param {Object} ephemerisData Look up ephemeris data to initialize the table with and the properties of it
     * @param {Array.<Array.<Number>>} ephemerisData.data the ephemeris data appropriate for the specified ephemeris type
     * @param {String} ephemerisData.ephemerisType the type of ephemeres data here (defaults to 'cartesianposvel')
     * @param {String} ephemerisData.distanceUnits the distance units for this data (defaults to AU
     * @param {String} ephemerisData.timeUnits the distance units for this data (defaults to day)
     * @param {String} ephemerisData.interpolationType the type of interpolater to use (defaults to 'lagrange')
     * @param {Number} ephemerisData.interpolationOrder the order of the interpolator to use (defaults to 5)
     */
    constructor(ephemerisData: IEphemerisData);
    /**
     * Calculates the interpolated position for the given requested date. If the requested date is before the first
     * point it returns the first point. If the requested date is after the last point it returns the last point.
     * @param {Number} jd of the requested time
     * @returns {Number[]|*[]} x, y, z position in the ephemeris table's reference frame
     */
    getPositionAtTime(jd: number): number[];
    /**
     * Given the start and stop time returns a uniform ephemeris history.
     * @param {Number} startJd the requested start date
     * @param {Number} stopJd the requested stop date
     * @param {Number} stepDays the step size of the data requested in days (can be fractional days)
     * @returns {number[][]}
     */
    getPositions(startJd: number, stopJd: number, stepDays: number): number[][];
    /**
     * @private
     */
    calcDistanceMultiplier(unitType: 'au' | 'km'): number;
    /**
     * @private
     */
    calcTimeMultiplier(unitType: 'day' | 'sec'): number;
    /**
     * @private
     */
    calcBoundingIndices(jd: number): {
        startIndex: number;
        stopIndex: number;
    };
}
export {};
