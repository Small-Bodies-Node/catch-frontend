import * as THREE from 'three';
/**
 * Mutates a BufferGeometry by adding morph-target apparatus to geometry
 * allowing you to lerp  between log and normal positioning of vertices
 * Adapted from: https://threejs.org/examples/webgl_morphtargets.html
 */
export declare function addLogMorphsToGeometry(geometry: THREE.BufferGeometry): void;
