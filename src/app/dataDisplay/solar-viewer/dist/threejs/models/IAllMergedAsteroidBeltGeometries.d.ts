import { TAsteroidBeltType } from './TAsteroidBeltType';
import { TCometBeltType } from './TCometBeltType';
/**
 * Contract for object to pass around the merged geometries
 * for both parts of the asteroid belt
 */
export interface IAllMergedAsteroidBeltGeometries {
    mergedAsteroidGeometry: THREE.BufferGeometry;
    mergedTailsGeometry: THREE.BufferGeometry;
    belt: TAsteroidBeltType | TCometBeltType;
}
