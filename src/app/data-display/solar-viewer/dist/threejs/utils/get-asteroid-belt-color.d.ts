import { TAsteroidBeltType } from '../models/TAsteroidBeltType';
import { TCometBeltType } from '../models/TCometBeltType';
/**
 * Maps asteroid belt to a color
 */
export declare function getAsteroidBeltColor(belt: TAsteroidBeltType | TCometBeltType): "grey" | "orange" | "pink" | "red" | "cyan" | "green";
