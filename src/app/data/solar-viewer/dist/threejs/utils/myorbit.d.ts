import * as THREE from 'three';
import { EOrbitalType } from '../models/EOrbitalType';
import { IXYZ } from '../models/IXYZ';
export declare class MyOrbit {
    private name;
    private orbitalType;
    private color;
    private opacity;
    private orbitLine;
    constructor(name: string, orbitalType?: EOrbitalType, color?: string, opacity?: number);
    loadPlanet: () => void;
    getStaticPosition(): void;
    getOrbitLine(): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    getXyzMeters(tCenturiesSinceJ200?: number): IXYZ;
    getPosition(tCenturiesSinceJ200?: number): THREE.Vector3;
    getTail(radius: number, tailLength?: number, tCenturiesSinceJ200?: number): {
        realGeometry: THREE.BufferGeometry;
        loggedGeometry: THREE.BufferGeometry;
    };
}
