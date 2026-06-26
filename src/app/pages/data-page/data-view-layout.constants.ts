export const dataViewLayoutMetrics = {
  layoutPaddingPx: 10,
  workspaceGapPx: 5,
  tabsColumnMinWidthPx: 360,
  tabsColumnIdealWidthVw: 30,
  tabsColumnMaxWidthPx: 620,
  tableModeToggleMinWidthPx: 106,
  compactCheckboxColWidthPx: 72,
  compactThumbnailColWidthPx: 60,
  compactSourceColWidthPx: 140,
  compactDateColWidthPx: 112,
  compactRowHeightPx: 60,
  compactStandardCellInlinePaddingPx: 12,
  compactThumbnailCellInlinePaddingPx: 0,
  tableModeTransitionMs: 400,
  catDrawerFadeMs: 400,
  catDrawerSlideMs: 400,
  catDrawerSlideOffsetPx: 12,
} as const;

export const compactTableWidthPx =
  dataViewLayoutMetrics.compactCheckboxColWidthPx +
  dataViewLayoutMetrics.compactThumbnailColWidthPx +
  dataViewLayoutMetrics.compactDateColWidthPx +
  dataViewLayoutMetrics.compactSourceColWidthPx;

export function getDataViewLayoutCssVars(): Record<string, string> {
  return {
    '--layout-padding': `${dataViewLayoutMetrics.layoutPaddingPx}px`,
    '--workspace-gap': `${dataViewLayoutMetrics.workspaceGapPx}px`,
    '--tabs-column-min-width': `${dataViewLayoutMetrics.tabsColumnMinWidthPx}px`,
    '--tabs-column-ideal-width': `${dataViewLayoutMetrics.tabsColumnIdealWidthVw}vw`,
    '--tabs-column-max-width': `${dataViewLayoutMetrics.tabsColumnMaxWidthPx}px`,
    '--table-mode-toggle-min-width': `${dataViewLayoutMetrics.tableModeToggleMinWidthPx}px`,
    '--compact-checkbox-col-width': `${dataViewLayoutMetrics.compactCheckboxColWidthPx}px`,
    '--compact-thumbnail-col-width': `${dataViewLayoutMetrics.compactThumbnailColWidthPx}px`,
    '--compact-source-col-width': `${dataViewLayoutMetrics.compactSourceColWidthPx}px`,
    '--compact-date-col-width': `${dataViewLayoutMetrics.compactDateColWidthPx}px`,
    '--compact-table-width': `${compactTableWidthPx}px`,
    '--compact-row-height': `${dataViewLayoutMetrics.compactRowHeightPx}px`,
    '--compact-standard-cell-inline-padding': `${dataViewLayoutMetrics.compactStandardCellInlinePaddingPx}px`,
    '--compact-thumbnail-cell-inline-padding': `${dataViewLayoutMetrics.compactThumbnailCellInlinePaddingPx}px`,
    '--table-mode-transition-duration': `${dataViewLayoutMetrics.tableModeTransitionMs}ms`,
    '--cat-drawer-fade-duration': `${dataViewLayoutMetrics.catDrawerFadeMs}ms`,
    '--cat-drawer-slide-duration': `${dataViewLayoutMetrics.catDrawerSlideMs}ms`,
    '--cat-drawer-slide-offset': `${dataViewLayoutMetrics.catDrawerSlideOffsetPx}px`,
  };
}
