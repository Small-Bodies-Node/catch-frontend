import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class MiscHelpers extends AbstractSceneEntity implements ISceneEntity {
    readonly NAME = "Misc Helpers";
    init(): Promise<THREE.Group>;
    update: () => void;
}
