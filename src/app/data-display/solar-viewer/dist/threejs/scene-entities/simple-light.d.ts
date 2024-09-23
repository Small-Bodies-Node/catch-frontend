import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class SimpleLight extends AbstractSceneEntity implements ISceneEntity {
    private _defaultIntensity;
    readonly NAME = "Simple Light";
    private _light?;
    constructor(_defaultIntensity?: number);
    init(): Promise<THREE.Group>;
    setPower: (intensity?: number | undefined) => void;
    setIsOn(isOn: boolean): void;
    update: () => void;
}
