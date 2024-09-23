import { AbstractSceneManager } from './abstract-scene/abstract-scene-manager';
/**
 * Implement a scene for this app with 'real' scene entities
 */
export declare class SceneManager extends AbstractSceneManager {
    private sun;
    private planets;
    private asteroids;
    private birdsEyes;
    private starField?;
    private isToyScale;
    private isOrbitsVisible;
    private isLogScale;
    private toyScalables;
    private logScalables;
    private zoomables;
    private zoomableOrbitals;
    private zoomTarget;
    private isZoomingPosition;
    private isZoomingAngle;
    private zoomTraversalFraction;
    private zoomClock;
    private isScenePaused;
    updateDisplayedMessage: (msg: string) => void;
    constructor(containerId: string);
    setIsToyScale: (isToyScale: boolean) => void;
    toggleIsToyScale: () => void;
    setIsOrbitsVisible: (isOrbitsVisible: boolean) => void;
    toggleIsOrbitsVisible: () => void;
    toggleAsteroids: () => void;
    setIsLogScale: (isLogScale: boolean) => void;
    toggleIsLogScale: () => void;
    tryToStartZooming: (text: string) => void;
    tryToStopZooming: () => void;
    setIsScenePaused(val: boolean): void;
    updateCamera: () => void;
}
