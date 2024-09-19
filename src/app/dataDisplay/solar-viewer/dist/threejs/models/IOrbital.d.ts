import { ISceneEntity } from './ISceneEntity';
/**
 * This interface is implemented by every object in solar system
 * Only the sun returns null
 */
export interface IOrbital extends ISceneEntity {
    getPosition: () => THREE.Vector3;
}
