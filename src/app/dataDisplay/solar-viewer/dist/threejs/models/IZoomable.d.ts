import { ISceneEntity } from './ISceneEntity';
/**
 * This interface is implemented by every object in solar system
 * Only the sun returns null
 */
export interface IZoomable extends ISceneEntity {
    getPosition: () => THREE.Vector3;
    getScale: () => number;
    getRadius: () => number;
}
