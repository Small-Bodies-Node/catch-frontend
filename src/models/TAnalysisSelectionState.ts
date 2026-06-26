/**
 * Tracks rows selected for analysis.
 *
 * Each key is an apiDatum product_id; a true value means that row has been
 * staged as an analysis item.
 */
export type TAnalysisSelectionState = { [product_id: string]: boolean };
