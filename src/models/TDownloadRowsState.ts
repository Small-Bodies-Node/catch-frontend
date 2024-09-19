/**
 * Type for object of the form:
 *
 * {
 *  "PRODUCTID1": true,
 *  "PRODUCTID2": false,
 *  ...
 *
 * }
 *
 * ... used to track whether the row of an apiDatum has had its checkbox selected or not
 */
export type TDownloadRowsState = { [productId: string]: boolean };
