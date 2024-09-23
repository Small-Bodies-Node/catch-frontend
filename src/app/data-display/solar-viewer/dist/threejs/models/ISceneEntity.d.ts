import { AbstractSceneEntity } from '../abstract-scene/abstract-scene-entity';
/**
 * The interface that any scene entity must implement in order that it can get added
 * to the scene
 *
 * NOTES:
 * - init: method to declare three geometries, add them to entity's group, and
 * - update: function of time tracked by the SceneManager that determines the state
 * of the threeJs meshes, lights, etc. within the scene entity's THREE.Group
 */
export interface ISceneEntity extends AbstractSceneEntity {
    NAME: string;
    init: () => Promise<THREE.Group>;
    update: (camera?: THREE.Camera, time?: number) => void;
}
