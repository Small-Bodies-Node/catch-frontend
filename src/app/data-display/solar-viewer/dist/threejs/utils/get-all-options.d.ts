import { IOptions, IOptionsBooleans, IOptionsNumbers } from '../../options';
/**
 * Get all options from local storage; if a value from optionKeys is not
 * represented then return the default value
 */
export declare const getAllOptions: () => IOptions;
/**
 * Wrapper that just returns the booleans from stored options
 */
export declare const getAllOptionsBooleans: () => IOptionsBooleans;
/**
 * Wrapper that just returns the booleans from stored options
 */
export declare const getAllOptionsNumbers: () => IOptionsNumbers;
