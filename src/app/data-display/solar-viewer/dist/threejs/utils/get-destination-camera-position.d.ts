import * as THREE from 'three';
import { IZoomable } from '../models/IZoomable';
/**
 * By providing a zoomable target, this function will compute a 'scenic'
 * position that will be used by other functions to move the camera.
 */
export declare const getDestinationCameraPosition: (zoomTarget: IZoomable) => THREE.Vector3;
