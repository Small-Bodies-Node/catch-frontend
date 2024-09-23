import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class StarField extends AbstractSceneEntity implements ISceneEntity {
    readonly NAME = "STARFIELD";
    private mesh;
    private material;
    private texture;
    constructor(radius: number);
    init(): Promise<THREE.Group>;
    invertColor: () => void;
    update(): void;
}
