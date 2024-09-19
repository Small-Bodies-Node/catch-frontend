import * as THREE from 'three';
import { AbstractSceneEntity } from './abstract-scene-entity';
/**
 * Base class for space object that can be toggled between
 * 'real' and 'toy' scales
 */
export declare abstract class AbstractToyModel extends AbstractSceneEntity {
    protected _toyScale: number;
    protected _toyGroup: THREE.Object3D[];
    protected _realScale: number;
    protected _isZoomToToyScale: boolean;
    protected isLogScale: boolean;
    protected logTransitionClock: THREE.Clock;
    constructor(_toyScale: number);
    setIsZoomToToyScale(value: boolean): void;
    setToyScale(val: number): void;
    getScale(): number;
    protected _setToToyScale(): void;
    setIsLogScale(val: boolean): void;
    toggleIsLogScale(): void;
    getLogInterpolationParam(): number;
    protected _updateModelScale(): void;
}
