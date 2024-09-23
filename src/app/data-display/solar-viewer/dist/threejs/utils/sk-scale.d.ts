/**
 * Set the number of units per AU.
 */
export declare function setScaleFactor(val: number): void;
/**
 * Get the number of units per AU.
 */
export declare function getScaleFactor(): number;
export declare function rescalePos(pos: {
    x: number;
    y: number;
    z: number;
}): {
    x: number;
    y: number;
    z: number;
};
export declare function rescaleArray(XYZ: number[]): number[];
export declare function rescaleXYZ(X: number, Y: number, Z: number): number[];
export declare function rescaleVector(vec: THREE.Vector3): import("three").Vector3;
export declare function rescaleNumber(x: number): number;
export declare function rescale(...args: any[]): number | number[] | {
    x: number;
    y: number;
    z: number;
};
