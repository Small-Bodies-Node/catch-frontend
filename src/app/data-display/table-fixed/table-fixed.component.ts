import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { IAppState } from '../../ngrx/reducers';
import { selectTableFixedCheckboxState } from '../../ngrx/selectors/table-checkbox.selectors';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { TableDataCheckboxesComponent } from '../table-data-checkboxes/table-data-checkboxes.component';
import { ImageFetchService } from '../../core/services/fetch-image/fetch-image.service';
import { PlotlyGraphWrapperComponent } from '../plotly-graph/plotly-graph.component';
import { SelectTableRowsDirective } from '../../shared/directives/select-table-rows.directive';
import { TApiFixedColState } from '../../../models/TApiFixedColState';
import { apiFixedInitColState } from '../../../utils/apiFixedInitColState';
import {
  selectApiFixed,
  selectApiFixedDownloadRowState,
  selectApiSelectedFixum,
  selectApiFixedStatus,
} from '../../ngrx/selectors/api-fixed.selectors';
import { IApiFixum } from '../../../models/IApiFixum';
import {
  ApiFixedAction_SetDownloadRowState,
  ApiFixedAction_SetSelectedFixum,
} from '../../ngrx/actions/api-fixed.actions';
import { apiFixedLabels } from '../../../utils/apiFixedLabels';
import { ITableThumbnailInput } from '../table-thumbnail/table-thumbnail.component';

type TColName = keyof IApiFixum;

@Component({
  selector: 'app-table-fixed',
  templateUrl: './table-fixed.component.html',
  styleUrls: ['./table-fixed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableFixedComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  @ViewChild('tableContainerDiv')
  tableContainerDiv?: ElementRef<HTMLDivElement>;

  @ViewChildren(SelectTableRowsDirective)
  tableRows?: QueryList<SelectTableRowsDirective>;

  nonHideableCols = ['download_checkboxes', 'preview_url', 'source_name'];

  fixedSource?: MatTableDataSource<IApiFixum>;
  apiSelectedFixum?: IApiFixum;
  allApiFixed?: IApiFixum[];
  paginatedApiFixed?: IApiFixum[];
  colState: Partial<TApiFixedColState> = { ...apiFixedInitColState };
  shownHideableCols: Partial<TColName>[] = Object.keys(
    apiFixedInitColState
  ).filter(
    (key) =>
      apiFixedInitColState[key as keyof TApiFixedColState] &&
      ![...this.nonHideableCols].includes(key)
  ) as Partial<TColName>[];
  subscriptions = new Subscription();
  isDownloadAllCheckboxChecked = false;
  isDownloadAllCheckboxIndeterminate = false;
  isScrolling = true;
  downloadRowState: TDownloadRowsState = {};

  pageSizeOptions = [25, 50, 100, 200];
  pageSize = 25;
  pageIndex = 0;

  ra?: string;
  dec?: string;

  constructor(
    private store$: Store<IAppState>,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private fetchImageService: ImageFetchService
  ) {
    this.subscriptions.add(
      this.store$.select(selectApiFixed).subscribe((apiFixed) => {
        this.allApiFixed = apiFixed?.filter((_, ind) => ind < 70000000000);
        if (this.allApiFixed) {
          this.setPaginatorAndSort();
        }
      })
    );
    this.subscriptions.add(
      this.store$.select(selectApiFixedStatus).subscribe((apiFixedStatus) => {
        const { code, message, query } = apiFixedStatus;
        if (code === 'found') {
          const { ra, dec } = query!;
          this.ra = ra;
          this.dec = dec;
        }
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedFixum)
        .subscribe((apiSelectedFixum) => {
          this.apiSelectedFixum = apiSelectedFixum;
          this.rerenderTable();

          // Determine position Scroll to selected row in table
          const sortedApiFixed = this.getSortedApiFixed();
          if (!sortedApiFixed || !apiSelectedFixum) return;
          const rowOfApiSelectedFixum: number =
            sortedApiFixed
              .map((apiFixum) => apiFixum.product_id)
              .indexOf(apiSelectedFixum.product_id) -
            this.pageIndex * this.pageSize;

          if (this.isScrolling && this.tableRows && this.tableContainerDiv) {
            const rowHeight = this.tableRows.get(1)?.nativeElement.offsetHeight;
            const offset = this.tableContainerDiv.nativeElement.clientHeight;
            if (rowHeight && offset) {
              const top = rowOfApiSelectedFixum * rowHeight - offset * 0.4;
              this.tableContainerDiv.nativeElement.scroll({
                top,
                behavior: 'smooth',
              });
            }
          }
        })
    );
    this.subscriptions.add(
      this.store$
        .select(selectTableFixedCheckboxState)
        .subscribe((colState) => {
          this.colState = colState;
          this.shownHideableCols = Object.keys(this.colState).filter(
            (key) =>
              this.colState[key as keyof TApiFixedColState] &&
              ![...this.nonHideableCols].includes(key)
          ) as TColName[];
          this.rerenderTable();
        })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiFixedDownloadRowState)
        .subscribe((downloadRowState) => {
          this.downloadRowState = downloadRowState;
          this.rerenderTable();
        })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setPaginatorAndSort();
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        // Your code here, e.g., fetching new data or updating the UI
        // console.log('Sort changed:', this.sort.active, this.sort.direction);
        console.log('sort event');
        this.rerenderTable();
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ///////////////////////////////////
  // Pagination logic
  ///////////////////////////////////

  setPaginatorAndSort() {
    if (!this.allApiFixed) return;
    this.fixedSource = new MatTableDataSource(this.allApiFixed);

    if (!this.paginator) return;
    this.fixedSource.paginator = this.paginator;

    if (!this.sort) return;
    this.fixedSource.sort = this.sort;

    this.rerenderTable();
  }

  onPaginateChange(event: PageEvent) {
    console.log('Page event: ', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchImageService.resetQueue();
    this.selectRowFixum(0);
    this.rerenderTable();
  }

  isRowDisplayed(row: IApiFixum) {
    const sortedFixed = this.getSortedApiFixed();
    if (!sortedFixed) return false;
    const rowIndex = sortedFixed.indexOf(row);
    if (typeof rowIndex === 'undefined') return false;
    if (
      rowIndex >= this.pageIndex * this.pageSize &&
      rowIndex < (this.pageIndex + 1) * this.pageSize
    ) {
      return true;
    }
    return false;
  }

  ///////////////////////////////////

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (!this.fixedSource) return;

    this.fixedSource.filter = filterValue.trim().toLowerCase();

    if (this.fixedSource.paginator) {
      this.fixedSource.paginator.firstPage();
    }
    // this.onPaginateChange();
  }

  getSourceName(fullName: string) {
    const abbr = {
      'NEAT Palomar Tricam': 'NEAT (PT)',
      'NEAT Maui GEODSS': 'NEAT (MG)',
      'PanSTARRS 1 DR2': 'PanSTARRS',
      'Catalina Sky Survey, Mt. Lemmon': 'Catalina (ML)',
      'Catalina Sky Survey, Mt. Bigelow': 'Catalina (MB)',
    };
    return abbr.hasOwnProperty(fullName)
      ? abbr[fullName as keyof typeof abbr]
      : fullName;
  }

  getAllCols() {
    if (!this.shownHideableCols) return [];
    return [...this.nonHideableCols, ...this.shownHideableCols];
  }

  keyPress(event: KeyboardEvent) {
    // --->

    // Extract pertinent info from event
    event.preventDefault();
    const arrowDirn = event.key;
    const isArrowDown = arrowDirn === 'ArrowDown';
    const isArrowUp = arrowDirn === 'ArrowUp';

    // Determine index of presently selected fixum:
    const sortedApiFixed = this.getSortedApiFixed();
    const selectedFixum = this.apiSelectedFixum;

    // Logic to select row above/below
    if (selectedFixum && sortedApiFixed && (isArrowUp || isArrowDown)) {
      const oldIndex = sortedApiFixed
        .map((el) => el.product_id)
        .indexOf(selectedFixum.product_id);
      let newIndex = isArrowUp ? oldIndex - 1 : oldIndex + 1;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= sortedApiFixed.length)
        newIndex = sortedApiFixed.length - 1;
      const apiFixum = sortedApiFixed[newIndex];
      this.store$.dispatch(ApiFixedAction_SetSelectedFixum({ apiFixum }));
    }
  }

  getSortedApiFixed(): IApiFixum[] | undefined {
    if (!this.fixedSource || !this.fixedSource.sort) return undefined;
    let fixed = [...this.fixedSource.data];

    // Apply filtering first
    if (this.fixedSource && this.fixedSource.filter) {
      fixed = fixed.filter((item) =>
        this.fixedSource!.filterPredicate(item, this.fixedSource!.filter)
      );
    }

    const sort = this.fixedSource.sort;
    return this.fixedSource.sortData(fixed, sort);
  }

  /////////////////////////////////////////////
  // Logic related to checkboxes
  /////////////////////////////////////////////
  clickDownloadAllCheckbox() {
    if (!this.allApiFixed) return;
    this.isDownloadAllCheckboxChecked = !this.isDownloadAllCheckboxChecked;
    const newDownloadRowState = { ...this.downloadRowState };
    Object.keys(newDownloadRowState).forEach((key, ind) => {
      newDownloadRowState[key] = this.isDownloadAllCheckboxChecked;
    });
    this.store$.dispatch(
      ApiFixedAction_SetDownloadRowState({ newDownloadRowState })
    );
    this.isDownloadAllCheckboxIndeterminate = false;
  }

  updateDownloadRowCheckbox(apiFixum: IApiFixum, e: MatCheckboxChange) {
    const productId = apiFixum.product_id;
    const newDownloadRowState = { ...this.downloadRowState };
    newDownloadRowState[productId] = !newDownloadRowState[productId];
    this.store$.dispatch(
      ApiFixedAction_SetDownloadRowState({ newDownloadRowState })
    );
    this.isDownloadAllCheckboxIndeterminate = true;
  }

  isRowChecked(apiFixum: IApiFixum) {
    return this.downloadRowState[apiFixum.product_id];
  }

  isRowSelected(element: IApiFixum) {
    const isRowSelected =
      element.product_id === this.apiSelectedFixum?.product_id;
    return isRowSelected;
  }

  //////////////////////////

  formatCellEntry(colName: keyof IApiFixum, colEntry: string | number | null) {
    if (!colEntry) return 'N/A';
    if (typeof colEntry === 'number') {
      const label = apiFixedLabels[colName];
      if (!!label) {
        return colEntry.toFixed(label.fractionSize);
      } else {
        return 'Err';
      }
    } else if (typeof colEntry === 'string') {
      if (colEntry.length > 23) {
        return colEntry.substring(0, 3) + '...' + colEntry.slice(-3);
      }
    }
    return colEntry;
  }

  rerenderTable() {
    // this.changeDetector.detectChanges();
  }

  getColLabel(key: string) {
    const apiFixumLabels = (apiFixedLabels as any)[key as any];
    return apiFixumLabels.label;
  }

  getTooltip(key: string) {
    console.log('apiFixedLabels', apiFixedLabels, key);
    const apiFixumLabels = (apiFixedLabels as any)[key as any];
    return apiFixumLabels.description;
  }

  selectRowFixum(i: number) {
    // Flip flag to prevent scrolling on table clicks
    this.isScrolling = false;
    setTimeout(() => (this.isScrolling = true), 300);
    // Determine location of selectedFixum within sorted table data
    const sortedApiFixed = this.getSortedApiFixed();
    if (!sortedApiFixed) return;

    const paginatedRowIndex = i + this.pageIndex * this.pageSize;
    const apiFixum = sortedApiFixed[paginatedRowIndex];
    // If found then update
    this.store$.dispatch(ApiFixedAction_SetSelectedFixum({ apiFixum }));
  }

  openSettingsDialog(e: MouseEvent) {
    e.stopPropagation();
    this.dialog.open<TableDataCheckboxesComponent>(
      TableDataCheckboxesComponent,
      {}
    );
  }

  onClickPlotly(e: MouseEvent, xDataKey: Partial<TColName>) {
    e.stopPropagation();

    this.dialog.open<PlotlyGraphWrapperComponent, any>(
      PlotlyGraphWrapperComponent,
      { data: { xDataKey } }
    );
  }

  getTableThumbnailInput(
    apiFixum: IApiFixum
  ): ITableThumbnailInput | undefined {
    const { preview_url, source, product_id } = apiFixum;
    if (!this.ra || !this.dec || !apiFixum) return;

    return {
      ra: this.ra,
      dec: this.dec,
      preview_url: preview_url || 'placeholderUrl',
      source,
      product_id,
    };
  }
}
