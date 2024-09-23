import * as THREE from 'three';
import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
import { ISceneEntity } from '../models/ISceneEntity';
export declare class PointLight extends AbstractSceneEntity implements ISceneEntity {
    private _defaultIntensity;
    private _radius;
    readonly NAME = "Point Light";
    private _light?;
    constructor(_defaultIntensity?: number, _radius?: number);
    init(): Promise<THREE.Group>;
    setPower: (intensity?: number | undefined) => void;
    setIsOn(isOn: boolean): void;
    update: () => void;
}
