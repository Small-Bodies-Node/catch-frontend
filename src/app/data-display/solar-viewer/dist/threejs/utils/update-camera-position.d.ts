import * as THREE from 'three';
import { IZoomable } from '../models/IZoomable';
/**
 * Function to compute the next position for a camera given a zoomable target
 * (e.g. a planet), the camera, and a 'traversal' fraction that parameterizes
 * how fast to move toward that target
 */
export declare const updateCameraPosition: (camera: THREE.Camera, zoomTarget: IZoomable, zoomTraversalFraction: number) => boolean;
