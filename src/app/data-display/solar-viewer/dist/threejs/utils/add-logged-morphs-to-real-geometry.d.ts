import * as THREE from 'three';
/**
 * Take a "real" and "logged" geometry, and combine the logged into
 * the real as morphs to allow smooth shifting between the two geometries
 * This requires the real and logged geometries to have been created in such
 * a way that the order of vertices in each correspond exactly
 */
export declare function addLoggedMorphsToRealGeometry(realGeometry: THREE.BufferGeometry, loggedGeometry: THREE.BufferGeometry): void;
