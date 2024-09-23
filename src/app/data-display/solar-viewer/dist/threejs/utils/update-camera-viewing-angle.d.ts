import * as THREE from 'three';
import { IZoomable } from '../models/IZoomable';
/**
 * By providing a zoomable target, your camera, and a 'traversal fraction',
 * this function will compute the next modification in viewing direction for
 * the camera in order to pan towards the target
 */
export declare const updateCameraViewingAngle: (camera: THREE.Camera, zoomTarget: IZoomable, zoomTraversalFraction: number) => boolean;
