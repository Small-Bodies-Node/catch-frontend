import * as THREE from 'three';
/**
 * Base class that any entity must extend in order that its threeJs group
 * might get added to the threeJs scene owned by the manager
 */
export declare abstract class AbstractSceneEntity {
    private static _isAsyncLoad;
    protected _isAsyncLoad: () => boolean;
    protected _sceneEntityGroup: THREE.Group;
    getSceneEntityGroup: () => THREE.Group;
}
