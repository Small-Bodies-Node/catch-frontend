import { MyOrbit } from '../utils/myorbit';
import { IZoomable } from './IZoomable';
/**
 *
 */
export interface IZoomableOrbital extends IZoomable {
    getOrbit: () => MyOrbit;
    setIsOrbitVisible: (val: boolean) => void;
}
