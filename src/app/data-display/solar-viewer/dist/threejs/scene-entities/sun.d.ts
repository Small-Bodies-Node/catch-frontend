import * as THREE from 'three';
import { AbstractToyModel } from '../abstract-scene/abstract-toy-model';
import { IZoomable } from '../models/IZoomable';
export declare class Sun extends AbstractToyModel implements IZoomable {
    readonly NAME = "SUN";
    private readonly position;
    private readonly sunRadiusMeters;
    private model;
    private helper;
    private sprite;
    constructor();
    getRadius: () => number;
    getPosition: () => THREE.Vector3;
    init(): Promise<THREE.Group>;
    update(): void;
}
