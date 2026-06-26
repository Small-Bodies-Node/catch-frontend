import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { IAppState } from '../../../ngrx/reducers';
import { IApiFixum } from '../../../../models/IApiFixum';
import { IApiMovum } from '../../../../models/IApiMovum';
import { apiDataLabels } from '../../../../utils/apiDataLabels';
import {
  selectApiDataAnalysisSelectionState,
  selectApiData,
  selectApiActiveDatum,
  selectApiDataShownColState,
} from '../../../ngrx/selectors/api-data.selectors';
import {
  ApiDataAction_SetAnalysisSelectionState,
  ApiDataAction_SetActiveDatum,
} from '../../../ngrx/actions/api-data.actions';
import { TAnalysisSelectionState } from '../../../../models/TAnalysisSelectionState';
import { TableDataCheckboxesComponent } from '../table-data-checkboxes/table-data-checkboxes.component';
import { ImageFetchService } from '../../../core/services/fetch-image/fetch-image.service';
import {
  PlotlyGraphComponent,
  PlotlyGraphWrapperComponent,
} from '../plotly-graph/plotly-graph.component';
import { TColStateData } from '../../../../models/TColStateData';
import { MatTableModule } from '@angular/material/table';
import { NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TableThumbnailComponent } from '../table-thumbnail/table-thumbnail.component';
import { SelectTableRowsDirective } from '../../../core/directives/select-table-rows.directive';
import { getDataViewLayoutCssVars } from '../data-view-layout.constants';
import {
  ITableFilterDialogData,
  TableFilterDialogComponent,
} from './table-filters/table-filter-dialog/table-filter-dialog.component';
import {
  ITableRangeFilterDialogData,
  TableRangeFilterDialogComponent,
} from './table-filters/table-range-filter-dialog/table-range-filter-dialog.component';
import {
  ITableDateFilterDialogData,
  TableDateFilterDialogComponent,
} from './table-filters/table-date-filter-dialog/table-date-filter-dialog.component';
import { TableFilterToolbarComponent } from './table-filters/table-filter-toolbar/table-filter-toolbar.component';
import {
  ITableDateRangeFilter,
  ITableFilterState,
  ITableNumberRangeFilter,
  ITableSourceFilterOption,
  TTableRangeFilterColumn,
} from './table-filters/table-filter.types';
import {
  applyTableFilters,
  createEmptyTableFilterState,
  getSourceFilterOptions,
  isDateRangeFilterActive,
  isNumberRangeFilterActive,
  normalizeDateRangeFilter,
  normalizeNumberRangeFilter,
  tableRangeFilterColumns,
  tableRangeFilterConfigs,
} from './table-filters/table-filter.utils';

type TColName = keyof (IApiMovum | IApiFixum);
type TColState = keyof TColStateData;
type TTableDisplayMode = 'expanded' | 'compact';
type TPlotlyHistogramColumn = 'ra' | 'dec' | 'true_anomaly';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    //
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltip,
    MatButtonModule,
    //
    SelectTableRowsDirective,
    TableFilterToolbarComponent,
    TableThumbnailComponent,
    PlotlyGraphComponent,
    //
    NgClass,
    NgStyle,
    TitleCasePipe,
  ],
  standalone: true,
})
export class TableDataComponent implements AfterViewInit, OnDestroy {
  //

  @Input()
  set tableDisplayMode(mode: TTableDisplayMode) {
    this._tableDisplayMode = mode;
    if (mode === 'compact' && this.tableContainerDiv?.nativeElement) {
      this.tableContainerDiv.nativeElement.scrollLeft = 0;
    }
  }

  get tableDisplayMode(): TTableDisplayMode {
    return this._tableDisplayMode;
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  @ViewChild('tableContainerDiv')
  tableContainerDiv?: ElementRef<HTMLDivElement>;

  @ViewChildren(SelectTableRowsDirective, { read: ElementRef })
  tableRows?: QueryList<ElementRef<HTMLTableRowElement>>;

  readonly templateDefinedCols: readonly string[] = [
    'analysis_checkboxes',
    'preview_url',
    'source_name',
  ];
  readonly compactStickyCols: readonly string[] = [
    'analysis_checkboxes',
    'preview_url',
    'date',
    'source_name',
  ];
  readonly plotlyHistogramColumns: readonly TPlotlyHistogramColumn[] = [
    'ra',
    'dec',
    'true_anomaly',
  ];
  readonly tableLayoutVars = getDataViewLayoutCssVars();
  allShownCols: string[] = [];

  dataSource?: MatTableDataSource<IApiMovum | IApiFixum>;
  apiActiveDatum?: IApiMovum | IApiFixum;
  allApiData?: Array<IApiMovum | IApiFixum>;
  colState?: TColStateData;
  shownHideableCols?: Partial<keyof TColStateData>[] = [];

  subscriptions = new Subscription();
  isAnalysisSelectionAllCheckboxChecked = false;
  isAnalysisSelectionAllCheckboxIndeterminate = false;
  analysisSelectionState: TAnalysisSelectionState = {};
  private pendingScroll = false;
  private isRevealingActiveDatumPage = false;
  private _tableDisplayMode: TTableDisplayMode = 'expanded';

  pageSizeOptions = [25, 50, 100, 200];
  pageSize = 100;
  pageIndex = 0;
  sourceFilterOptions: ITableSourceFilterOption[] = [];
  tableFilters: ITableFilterState = createEmptyTableFilterState();
  filteredResultCount = 0;

  constructor(
    private store$: Store<IAppState>,
    private dialog: MatDialog,
    private fetchImageService: ImageFetchService,
  ) {
    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.allApiData = apiData?.filter((_, ind) => ind < 70000000000);
        this.sourceFilterOptions = getSourceFilterOptions(this.allApiData ?? [], (sourceName) =>
          this.getSourceName(sourceName),
        );
        this.reconcileSourceFilterSelection();
        if (this.allApiData) {
          this.setPaginatorAndSort();
          this.syncActiveDatumWithFilteredData();
        }
        this.syncAnalysisSelectionAllCheckboxState();
      }),
    );
    this.subscriptions.add(
      this.store$.select(selectApiActiveDatum).subscribe((apiActiveDatum) => {
        this.apiActiveDatum = apiActiveDatum;
        if (!this.getActiveRenderedRowElement()) {
          this.showActiveRowPageIfNeeded();
        }
        this.queueScrollToActiveRow();
      }),
    );
    this.subscriptions.add(
      this.store$.select(selectApiDataShownColState).subscribe((colState) => {
        //
        this.colState = colState;
        if (!this.colState) return;
        this.updateDisplayedColumns(this.colState);
      }),
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiDataAnalysisSelectionState)
        .subscribe((analysisSelectionState) => {
          this.analysisSelectionState = analysisSelectionState;
          this.syncAnalysisSelectionAllCheckboxState();
        }),
    );
  }

  ngAfterViewInit() {
    this.setPaginatorAndSort();
    this.syncActiveDatumWithFilteredData();
    const rowChangesSub = this.tableRows?.changes.subscribe(() => this.queueScrollToActiveRow());
    if (rowChangesSub) {
      this.subscriptions.add(rowChangesSub);
    }
    if (this.sort) {
      const sortChangesSub = this.sort.sortChange.subscribe(() => {
        this.syncActiveDatumWithFilteredData();
        this.queueScrollToActiveRow();
      });
      this.subscriptions.add(sortChangesSub);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ///////////////////////////////////
  // Pagination logic
  ///////////////////////////////////

  setPaginatorAndSort() {
    if (!this.allApiData) return;
    const filteredApiData = this.getFilteredApiData();
    this.filteredResultCount = filteredApiData.length;
    this.dataSource = new MatTableDataSource(filteredApiData);

    if (!this.paginator) return;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageIndex = this.pageIndex;

    if (!this.sort) return;
    this.dataSource.sort = this.sort;
  }

  onPaginateChange(event: PageEvent) {
    // console.log('Page event: ', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchImageService.resetQueue();
    if (this.isRevealingActiveDatumPage) {
      this.queueScrollToActiveRow();
      return;
    }

    const apiActiveDatum = this.apiActiveDatum;
    const sortedApiData = this.getSortedApiData();
    if (!sortedApiData?.length) return;

    // Logic to rescroll to active row after new pagination
    let indexOfActiveDatum = sortedApiData
      .map((_) => _.product_id)
      .indexOf(apiActiveDatum?.product_id ?? '');
    // Make sure the active datum is within the bounds of the current page
    if (indexOfActiveDatum < this.pageIndex * this.pageSize)
      indexOfActiveDatum = this.pageIndex * this.pageSize;
    if (indexOfActiveDatum >= (this.pageIndex + 1) * this.pageSize)
      indexOfActiveDatum = (this.pageIndex + 1) * this.pageSize - 1;
    this.store$.dispatch(
      ApiDataAction_SetActiveDatum({
        apiDatum: sortedApiData[indexOfActiveDatum],
      }),
    );
  }

  isRowDisplayed(row: IApiMovum | IApiFixum) {
    const sortedData = this.getSortedApiData();
    if (!sortedData) return false;
    const rowIndex = sortedData.findIndex((apiDatum) => apiDatum.product_id === row.product_id);
    if (rowIndex === -1) return false;
    if (
      rowIndex >= this.pageIndex * this.pageSize &&
      rowIndex < (this.pageIndex + 1) * this.pageSize
    ) {
      return true;
    }
    return false;
  }

  ///////////////////////////////////

  getSourceName(fullName: string) {
    const abbr = {
      'NEAT Palomar Tricam': 'NEAT (PT)',
      'NEAT Maui GEODSS': 'NEAT (MG)',
      'PanSTARRS 1 DR2': 'PanSTARRS',
      SkyMapperDR4: 'SkyMapper DR4',
      'Catalina Sky Survey, Mt. Lemmon': 'Catalina (ML)',
      'Catalina Sky Survey, Mt. Bigelow': 'Catalina (MB)',
    };
    return abbr.hasOwnProperty(fullName) ? abbr[fullName as keyof typeof abbr] : fullName;
  }

  get isSourceFilterActive(): boolean {
    return this.tableFilters.selectedSourceNames.length > 0;
  }

  get activeTableFilterCount(): number {
    const rangeFilterCount = tableRangeFilterColumns.filter((column) =>
      this.isRangeFilterActive(column),
    ).length;
    return (
      (this.isSourceFilterActive ? 1 : 0) + rangeFilterCount + (this.isDateFilterActive ? 1 : 0)
    );
  }

  updateSelectedSourceNames(selectedSourceNames: string[]): void {
    this.setTableFilters({
      ...this.tableFilters,
      selectedSourceNames,
    });
  }

  updateNumberRangeFilter(column: TTableRangeFilterColumn, range: ITableNumberRangeFilter): void {
    const normalizedRange = normalizeNumberRangeFilter(range);
    const numberRanges = { ...this.tableFilters.numberRanges };

    if (isNumberRangeFilterActive(normalizedRange)) {
      numberRanges[column] = normalizedRange;
    } else {
      delete numberRanges[column];
    }

    this.setTableFilters({
      ...this.tableFilters,
      numberRanges,
    });
  }

  updateDateRangeFilter(dateRange: ITableDateRangeFilter): void {
    this.setTableFilters({
      ...this.tableFilters,
      dateRange: normalizeDateRangeFilter(dateRange),
    });
  }

  clearTableFilters(): void {
    this.setTableFilters(createEmptyTableFilterState());
  }

  openTableFilterDialog(event?: MouseEvent): void {
    event?.stopPropagation();
    const dialogRef = this.dialog.open<
      TableFilterDialogComponent,
      ITableFilterDialogData,
      string[]
    >(TableFilterDialogComponent, {
      data: {
        sourceOptions: this.sourceFilterOptions,
        selectedSourceNames: this.tableFilters.selectedSourceNames,
      },
      width: '460px',
    });

    const dialogSub = dialogRef.afterClosed().subscribe((selectedSourceNames) => {
      if (!selectedSourceNames) return;
      this.updateSelectedSourceNames(selectedSourceNames);
    });
    this.subscriptions.add(dialogSub);
  }

  openRangeFilterDialog(event: MouseEvent, key: string): void {
    event.stopPropagation();
    if (!this.isRangeFilterColumn(key)) return;

    const dialogRef = this.dialog.open<
      TableRangeFilterDialogComponent,
      ITableRangeFilterDialogData,
      ITableNumberRangeFilter
    >(TableRangeFilterDialogComponent, {
      data: {
        config: tableRangeFilterConfigs[key],
        range: this.tableFilters.numberRanges[key] ?? { min: null, max: null },
        data: this.allApiData ?? [],
        filters: this.tableFilters,
      },
      width: '420px',
    });

    const dialogSub = dialogRef.afterClosed().subscribe((range) => {
      if (!range) return;
      this.updateNumberRangeFilter(key, range);
    });
    this.subscriptions.add(dialogSub);
  }

  openDateFilterDialog(event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open<
      TableDateFilterDialogComponent,
      ITableDateFilterDialogData,
      ITableDateRangeFilter
    >(TableDateFilterDialogComponent, {
      data: {
        range: this.tableFilters.dateRange,
        data: this.allApiData ?? [],
        filters: this.tableFilters,
      },
      width: '720px',
      maxWidth: 'calc(100vw - 48px)',
    });

    const dialogSub = dialogRef.afterClosed().subscribe((dateRange) => {
      if (!dateRange) return;
      this.updateDateRangeFilter(dateRange);
    });
    this.subscriptions.add(dialogSub);
  }

  isDateFilterColumn(key: string): key is 'date' {
    return key === 'date';
  }

  get isDateFilterActive(): boolean {
    return isDateRangeFilterActive(this.tableFilters.dateRange);
  }

  getDateFilterTooltip(): string {
    return 'Filter date range';
  }

  isRangeFilterColumn(key: string): key is TTableRangeFilterColumn {
    return key in tableRangeFilterConfigs;
  }

  isRangeFilterActive(key: string): boolean {
    if (!this.isRangeFilterColumn(key)) return false;
    return isNumberRangeFilterActive(this.tableFilters.numberRanges[key]);
  }

  getRangeFilterTooltip(key: string): string {
    if (!this.isRangeFilterColumn(key)) return 'Filter range';
    return `Filter ${tableRangeFilterConfigs[key].label} range`;
  }

  isPlotlyHistogramColumn(key: string): key is TPlotlyHistogramColumn {
    return this.plotlyHistogramColumns.includes(key as TPlotlyHistogramColumn);
  }

  getPlotlyHistogramTooltip(key: string): string {
    return `Show ${this.getColLabel(key)} distribution`;
  }

  private updateDisplayedColumns(colState: TColStateData): void {
    const shownHideableCols = this.getShownHideableCols(colState);
    this.shownHideableCols = shownHideableCols;
    this.allShownCols = this.getDisplayedColumnsForMode(shownHideableCols);
  }

  private getShownHideableCols(colState: TColStateData): TColState[] {
    const enabledHideableCols = (Object.keys(colState) as TColState[]).filter(
      (key) => colState[key] && !this.templateDefinedCols.includes(key),
    );

    const alwaysRenderedCompactCols = this.compactStickyCols.filter(
      (key): key is TColState => !this.templateDefinedCols.includes(key),
    );

    return Array.from(new Set([...alwaysRenderedCompactCols, ...enabledHideableCols]));
  }

  private getDisplayedColumnsForMode(shownHideableCols: TColState[]): string[] {
    return Array.from(new Set([...this.compactStickyCols, ...shownHideableCols]));
  }

  keyPress(event: KeyboardEvent) {
    // --->

    // Extract pertinent info from event
    event.preventDefault();
    const arrowDirn = event.key;
    const isArrowDown = arrowDirn === 'ArrowDown';
    const isArrowUp = arrowDirn === 'ArrowUp';

    if (!isArrowUp && !isArrowDown) return;

    // Determine index of presently active datum:
    const sortedApiData = this.getSortedApiData();
    const activeDatum = this.apiActiveDatum;

    if (!sortedApiData || !activeDatum) return;

    const oldSortedIndex = sortedApiData
      .map((apiDatum) => apiDatum.product_id)
      .indexOf(activeDatum.product_id);
    if (oldSortedIndex === -1) return;

    const rawNewSortedIndex = oldSortedIndex + (isArrowUp ? -1 : 1);
    const newSortedIndex = Math.min(Math.max(rawNewSortedIndex, 0), sortedApiData.length - 1);
    const apiDatum = sortedApiData[newSortedIndex];
    this.store$.dispatch(ApiDataAction_SetActiveDatum({ apiDatum }));

    // console.log('New index: ', newSortedIndex, sortedApiData.length);
  }

  getSortedApiData(): Array<IApiMovum | IApiFixum> | undefined {
    if (!this.dataSource) return undefined;
    let data = [...this.dataSource.data];

    const sort = this.dataSource.sort;
    if (!sort) return data;
    return this.dataSource.sortData(data, sort);
  }

  /////////////////////////////////////////////
  // Logic related to checkboxes
  /////////////////////////////////////////////
  clickAnalysisSelectionAllCheckbox() {
    if (!this.allApiData?.length) return;
    const shouldSelectAll = !this.isAnalysisSelectionAllCheckboxChecked;
    const newAnalysisSelectionState = { ...this.analysisSelectionState };
    const productIds =
      Object.keys(newAnalysisSelectionState).length > 0
        ? Object.keys(newAnalysisSelectionState)
        : this.allApiData.map((apiDatum) => apiDatum.product_id);

    productIds.forEach((productId) => {
      newAnalysisSelectionState[productId] = shouldSelectAll;
    });

    this.store$.dispatch(ApiDataAction_SetAnalysisSelectionState({ newAnalysisSelectionState }));
  }

  updateAnalysisSelectionCheckbox(apiDatum: IApiMovum | IApiFixum) {
    const productId = apiDatum.product_id;
    const newAnalysisSelectionState = { ...this.analysisSelectionState };
    newAnalysisSelectionState[productId] = !newAnalysisSelectionState[productId];
    this.store$.dispatch(ApiDataAction_SetAnalysisSelectionState({ newAnalysisSelectionState }));
  }

  isRowSelectedForAnalysis(apiDatum: IApiMovum | IApiFixum) {
    return this.analysisSelectionState[apiDatum.product_id];
  }

  isRowActive(element: IApiMovum | IApiFixum) {
    const isRowActive = element.product_id === this.apiActiveDatum?.product_id;
    return isRowActive;
  }

  //////////////////////////

  formatCellEntry(colName: keyof IApiMovum, colEntry: string | number | null) {
    if (colEntry === null || colEntry === undefined || colEntry === '') return 'N/A';
    if (typeof colEntry === 'number') {
      const label = apiDataLabels[colName];
      if (!!label) {
        return colEntry.toFixed(label.fractionSize);
      } else {
        return 'Err';
      }
    } else if (typeof colEntry === 'string') {
      if (colName === 'date') {
        return colEntry.split('.')[0];
      }
      if (colEntry.length > 23) {
        return colEntry.substring(0, 3) + '...' + colEntry.slice(-3);
      }
    }
    return colEntry;
  }

  getColLabel(key: string) {
    const apiDatumLabels = (apiDataLabels as any)[key as any];
    return apiDatumLabels.label;
  }

  getTooltip(key: string) {
    const apiDatumLabels = (apiDataLabels as any)[key as any];
    return apiDatumLabels.description;
  }

  activateRowDatum(apiDatum: IApiMovum | IApiFixum) {
    this.store$.dispatch(ApiDataAction_SetActiveDatum({ apiDatum }));
  }

  openSettingsDialog(e: MouseEvent) {
    e.stopPropagation();
    this.dialog.open<TableDataCheckboxesComponent>(TableDataCheckboxesComponent, {});
  }

  onClickPlotly(e: MouseEvent, xDataKey: string) {
    e.stopPropagation();

    this.dialog.open<PlotlyGraphWrapperComponent, any>(PlotlyGraphWrapperComponent, {
      data: { xDataKey },
      width: '560px',
      maxWidth: 'calc(100vw - 48px)',
      autoFocus: false,
    });
  }

  isHttp(entry: any) {
    if (typeof entry === 'string' && entry.includes('http')) {
      return true;
    }
    return false;
  }

  getTooltipForCell(entry: any, key: string) {
    if (key === 'product_id') return entry;
    return null;
  }

  getThumbnailLabel(entry: IApiMovum | IApiFixum) {
    const isRowActive = this.isRowActive(entry);
    return (isRowActive ? '*' : '') + entry.product_id;
  }

  private syncAnalysisSelectionAllCheckboxState(): void {
    if (!this.allApiData?.length) {
      this.isAnalysisSelectionAllCheckboxChecked = false;
      this.isAnalysisSelectionAllCheckboxIndeterminate = false;
      return;
    }

    const selectedCount = this.allApiData.reduce((count, apiDatum) => {
      return count + (this.analysisSelectionState[apiDatum.product_id] ? 1 : 0);
    }, 0);

    this.isAnalysisSelectionAllCheckboxChecked = selectedCount === this.allApiData.length;
    this.isAnalysisSelectionAllCheckboxIndeterminate =
      selectedCount > 0 && selectedCount < this.allApiData.length;
  }

  private getFilteredApiData(): Array<IApiMovum | IApiFixum> {
    return applyTableFilters(this.allApiData ?? [], this.tableFilters);
  }

  private setTableFilters(tableFilters: ITableFilterState): void {
    this.tableFilters = tableFilters;
    this.pageIndex = 0;
    this.fetchImageService.resetQueue();
    this.setPaginatorAndSort();
    this.syncActiveDatumWithFilteredData();
    this.queueScrollToActiveRow();
  }

  private reconcileSourceFilterSelection(): void {
    const availableSourceNames = new Set(this.sourceFilterOptions.map((option) => option.value));
    const selectedSourceNames = this.tableFilters.selectedSourceNames.filter((sourceName) =>
      availableSourceNames.has(sourceName),
    );

    if (selectedSourceNames.length === this.tableFilters.selectedSourceNames.length) return;

    this.tableFilters = {
      ...this.tableFilters,
      selectedSourceNames,
    };
  }

  private syncActiveDatumWithFilteredData(): void {
    const sortedApiData = this.getSortedApiData();
    if (!sortedApiData?.length) return;

    const activeProductId = this.apiActiveDatum?.product_id;
    const activeDatumIsVisible = sortedApiData.some(
      (apiDatum) => apiDatum.product_id === activeProductId,
    );
    if (activeDatumIsVisible) {
      this.showActiveRowPageIfNeeded();
      return;
    }

    this.store$.dispatch(ApiDataAction_SetActiveDatum({ apiDatum: sortedApiData[0] }));
  }

  private queueScrollToActiveRow(): void {
    this.pendingScroll = true;
    const raf =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : null;
    if (raf) {
      raf(() => {
        raf(() => {
          if (!this.pendingScroll) return;
          this.pendingScroll = false;
          this.scrollActiveRowIntoView();
        });
      });
    } else {
      this.pendingScroll = false;
      this.scrollActiveRowIntoView();
    }
  }

  private showActiveRowPageIfNeeded(): void {
    const sortedApiData = this.getSortedApiData();
    if (!sortedApiData || !this.apiActiveDatum || !this.paginator) return;

    const activeIndex = sortedApiData
      .map((apiDatum) => apiDatum.product_id)
      .indexOf(this.apiActiveDatum.product_id);

    if (activeIndex === -1) return;

    const activePageIndex = Math.floor(activeIndex / this.pageSize);
    if (activePageIndex === this.pageIndex) return;

    const previousPageIndex = this.pageIndex;
    this.pageIndex = activePageIndex;
    this.isRevealingActiveDatumPage = true;
    try {
      this.paginator.pageIndex = activePageIndex;
      this.paginator.page.emit({
        length: sortedApiData.length,
        pageIndex: activePageIndex,
        pageSize: this.pageSize,
        previousPageIndex,
      });
    } finally {
      this.isRevealingActiveDatumPage = false;
    }
  }

  private scrollActiveRowIntoView(): void {
    if (!this.tableContainerDiv) return;
    if (!this.apiActiveDatum) return;

    let rowEl = this.getActiveRenderedRowElement();
    if (!rowEl) {
      this.showActiveRowPageIfNeeded();
      rowEl = this.getActiveRenderedRowElement();
    }
    if (!rowEl) return;

    const container = this.tableContainerDiv.nativeElement;
    const headerEl = container.querySelector<HTMLTableRowElement>('tr.mat-mdc-header-row');
    const headerHeight = headerEl?.offsetHeight ?? 0;
    const containerRect = container.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();
    const rowHeight = rowRect.height || rowEl.offsetHeight;
    const offsetWithinContainer = rowRect.top - containerRect.top + container.scrollTop;
    const visibleBodyHeight = container.clientHeight - headerHeight;
    const centeredBodyOffset = headerHeight + visibleBodyHeight / 2 - rowHeight / 2;
    const targetTop = this.clampScrollTop(offsetWithinContainer - centeredBodyOffset, container);

    container.scroll({
      top: targetTop,
      behavior: 'smooth',
    });
  }

  private clampScrollTop(targetTop: number, container: HTMLDivElement): number {
    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
    return Math.min(Math.max(targetTop, 0), maxScrollTop);
  }

  private getActiveRenderedRowElement(): HTMLTableRowElement | undefined {
    const activeProductId = this.apiActiveDatum?.product_id;
    if (!activeProductId) return undefined;

    return this.tableRows
      ?.toArray()
      .map((row) => row.nativeElement)
      .find((rowEl) => rowEl.dataset['productId'] === activeProductId);
  }
}
