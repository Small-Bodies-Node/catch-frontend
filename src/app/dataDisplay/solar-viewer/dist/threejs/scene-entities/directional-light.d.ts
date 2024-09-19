import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class DirectionalLight extends AbstractSceneEntity implements ISceneEntity {
    readonly NAME = "Directional Light";
    private _light?;
    init(): Promise<THREE.Group>;
    update: () => void;
    setIsOn(isOn: boolean): void;
}
