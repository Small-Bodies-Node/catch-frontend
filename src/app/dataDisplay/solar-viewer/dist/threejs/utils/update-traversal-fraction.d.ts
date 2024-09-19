import * as THREE from 'three';
/**
 * Function at the heart of the smooth-zoom functionality.
 * It only requires two parameters to enable smooth movement between
 * a vast range of distances. By starting off with really small steps
 * (parameterised by alpha), you ensure that the movement starts off slow.
 * By increasing exponentially, you ensure that no matter how far the object,
 * it will soon start gobbling up the traversal vector. Because that traversal
 * vector decreases in size with each step, it also ensures the arrival is not too
 * abrupt.
 */
export declare const updateTraversalFraction: (clock: THREE.Clock) => number;
