import * as THREE from 'three';
/**
 * Function to take a dodecahedron and warp the points to createa jagged
 * asteroid shape
 */
export declare const createAsteroidGeometry: (size: number, warpFactor?: number, position?: THREE.Vector3) => {
    realGeometry: THREE.DodecahedronGeometry;
    loggedGeometry: THREE.BufferGeometry;
};
