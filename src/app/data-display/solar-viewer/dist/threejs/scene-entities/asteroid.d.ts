import * as THREE from 'three';
import { AbstractToyModel } from '../abstract-scene/abstract-toy-model';
import { IZoomableOrbital } from '../models/IZoomableOrbital';
import { MyOrbit } from '../utils/myorbit';
export declare class Asteroid extends AbstractToyModel implements IZoomableOrbital {
    readonly NAME: string;
    private radius;
    private model;
    private myOrbit;
    constructor(NAME: string, radius?: number);
    init(): Promise<THREE.Group>;
    getPosition: () => THREE.Vector3;
    getRadius: () => number;
    getOrbit: () => MyOrbit;
    setIsOrbitVisible: (val: boolean) => void;
    getDestinationPosition(_tCenturiesSinceJ200?: number): THREE.Vector3;
    updateOrbitLine(): void;
    update(): void;
}
