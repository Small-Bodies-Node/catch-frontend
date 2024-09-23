import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class Square extends AbstractSceneEntity implements ISceneEntity {
    private sideLength;
    NAME: string;
    constructor(sideLength: number);
    init(): Promise<THREE.Group>;
    update: (_camera?: THREE.Camera | undefined, _time?: number | undefined) => void;
}
