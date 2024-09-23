import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class DemoLoadedObject extends AbstractSceneEntity implements ISceneEntity {
    NAME: string;
    _loadedObject?: THREE.Object3D;
    _isInternalLightsOn: boolean;
    init(): Promise<THREE.Group>;
    update: (_camera?: THREE.Camera | undefined, _time?: number | undefined) => void;
    toggleInternalLights: () => void;
}
