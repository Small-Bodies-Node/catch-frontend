/**
 * This module is the SSOT for global "static" settings for the app
 * that get set before the threejs scene begins. These govern e.g.
 * the default values of the "dynamic" settings that the user can set
 * and that will then persist within localStorage
 */
export interface IOptionsBooleans {
    __sbnViewer__isPlanetsLoadedBeforeAnimationBegins: boolean;
    __sbnViewer__isBeltLoadedBeforeAnimationBegins: boolean;
    __sbnViewer__isBeltAbundanceToyModel: boolean;
}
export interface IOptionsNumbers {
    __sbnViewer__beltAbundanceMaxObjects: number;
    __sbnViewer__beltAbundanceHThreshold: number;
}
export interface IOptions extends IOptionsBooleans, IOptionsNumbers {
}
export declare const defaultOptions: IOptions;
