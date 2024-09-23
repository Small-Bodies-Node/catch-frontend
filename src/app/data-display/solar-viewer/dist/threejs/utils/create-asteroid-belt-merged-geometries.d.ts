import { TAsteroidBeltType } from '../models/TAsteroidBeltType';
import { IAllMergedAsteroidBeltGeometries } from '../models/IAllMergedAsteroidBeltGeometries';
import { TCometBeltType } from '../models/TCometBeltType';
declare type TCometOrAsteroidBeltType = TAsteroidBeltType | TCometBeltType;
export declare type TBeltHVal = {
    [K in TCometOrAsteroidBeltType]: string;
};
/**
 * Function to do the heavy lifting in loading data,
 * computing orbits and creating merged geometries for the asteroid
 * bodies and their tails
 */
export declare function createAsteroidBeltMergedGeometries(belt: TCometOrAsteroidBeltType): Promise<IAllMergedAsteroidBeltGeometries>;
export {};
