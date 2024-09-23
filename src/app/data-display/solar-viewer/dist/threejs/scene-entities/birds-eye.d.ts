import * as THREE from 'three';
import { AbstractToyModel } from '../abstract-scene/abstract-toy-model';
import { IZoomable } from '../models/IZoomable';
/**
 * This entity doesn't draw anything, it's just an empty object
 * positioned so as to be zoomable from above the sun
 */
export declare class BirdsEye extends AbstractToyModel implements IZoomable {
    readonly NAME: string;
    private token;
    private position;
    constructor(NAME?: string, zInAus?: number);
    init(): Promise<THREE.Group>;
    getPosition: () => THREE.Vector3;
    getRadius: () => number;
    update(): void;
}
