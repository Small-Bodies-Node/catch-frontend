import * as THREE from 'three';
import { EOrbitalType } from '../models/EOrbitalType';
import { IXYZ } from '../models/IXYZ';
import { SKEphem } from './sk-ephem';
export declare class Orbit {
    private name;
    private orbitalType;
    private skephem?;
    private color;
    private opacity;
    private SKprojectedOrbitLine;
    private orbitLine;
    private SKEph?;
    private SKOrbit?;
    constructor(name: string, orbitalType?: EOrbitalType, skephem?: SKEphem | undefined, color?: string, opacity?: number);
    loadPlanet: () => void;
    loadAsteroid: () => void;
    getMorphedOrbitLine(): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    getProjectedOrbitLine: () => THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    getXyzMeters(tCenturiesSinceJ200?: number): IXYZ;
    getPosition(tCenturiesSinceJ200?: number): THREE.Vector3;
    getTail(radius: number, tailLength?: number, tCenturiesSinceJ200?: number): {
        realGeometry: THREE.BufferGeometry;
        loggedGeometry: THREE.BufferGeometry;
    };
}
