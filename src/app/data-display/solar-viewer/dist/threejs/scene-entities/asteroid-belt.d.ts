import * as THREE from 'three';
import { AbstractToyModel } from '../abstract-scene/abstract-toy-model';
import { ISceneEntity } from '../models/ISceneEntity';
import { TAsteroidBeltType } from '../models/TAsteroidBeltType';
import { SceneManager } from '../scene-manager';
import { TCometBeltType } from '../models/TCometBeltType';
declare type TMeshes = {
    [key in TAsteroidBeltType | TCometBeltType]: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial>;
};
export declare class AsteroidBelt extends AbstractToyModel implements ISceneEntity {
    private belts;
    private parentSceneManager;
    readonly NAME: string;
    private isMeshesLoaded;
    private isBeltVisible;
    mergedAsteroidsMeshes: TMeshes;
    mergedTailsMeshes: TMeshes;
    constructor(belts: (TAsteroidBeltType | TCometBeltType)[], parentSceneManager: SceneManager);
    init(): Promise<THREE.Group>;
    getPosition: () => THREE.Vector3;
    getRadius: () => number;
    updateMeshes(): void;
    setIsBeltVisible(val: boolean): void;
    toggleIsBeltVisible(): void;
    update(_camera?: THREE.Camera): void;
}
export {};
