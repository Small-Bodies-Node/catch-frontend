import * as THREE from 'three';
import { TPlanets } from '../models/TPlanets';
import { AbstractToyModel } from '../abstract-scene/abstract-toy-model';
import { IZoomableOrbital } from '../models/IZoomableOrbital';
import { MyOrbit } from '../utils/myorbit';
export declare class Planet extends AbstractToyModel implements IZoomableOrbital {
    readonly NAME: TPlanets;
    private helper;
    private model;
    private clouds?;
    private myOrbit;
    private radius;
    constructor(NAME: TPlanets);
    init(): Promise<THREE.Group>;
    loadPlanetAsObject: () => Promise<void>;
    loadPlanetAsTexturedSphere: () => Promise<void>;
    getPosition: () => THREE.Vector3;
    getRadius: () => number;
    getOrbit: () => MyOrbit;
    setIsOrbitVisible: (val: boolean) => void;
    getDestinationPosition(_tCenturiesSinceJ200?: number): THREE.Vector3;
    updateOrbitLine(): void;
    update(): void;
}
