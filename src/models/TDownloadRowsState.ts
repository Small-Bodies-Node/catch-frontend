/**
 * Type for object of the form:
 *
 * {
 *  "[product_id1]": true,
 *  "[product_id2]": true,
 *  ...
 *
 * }
 *
 * ... used to track whether the row of an apiDatum
 * has had its checkbox selected or not. For any apiDatum
 * we use its unique product_id as the key to the dict
 */
export type TDownloadRowsState = { [product_id: string]: boolean };
