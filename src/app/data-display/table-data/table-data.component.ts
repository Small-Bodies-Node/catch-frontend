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

import { IApiMovum } from '../../../models/IApiMovum';
import { IAppState } from '../../ngrx/reducers';
import { apiDataLabels } from '../../../utils/apiDataLabels';
import { TColStateMoving } from '../../../models/TColStateMoving';
import {
  selectApiDataDownloadRowState,
  selectApiData,
  selectApiSelectedDatum,
  selectApiDataShownColState,
} from '../../ngrx/selectors/api-data.selectors';
import {
  ApiDataAction_SetDownloadRowState,
  ApiDataAction_SetSelectedDatum,
} from '../../ngrx/actions/api-data.actions';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { TableDataCheckboxesComponent } from '../table-data-checkboxes/table-data-checkboxes.component';
import { ImageFetchService } from '../../core/services/fetch-image/fetch-image.service';
import { PlotlyGraphWrapperComponent } from '../plotly-graph/plotly-graph.component';
import { SelectTableRowsDirective } from '../../shared/directives/select-table-rows.directive';
import { IApiFixum } from '../../../models/IApiFixum';
import { TColStateFixed } from '../../../models/TColStateFixed';
import { initColStateFixed } from '../../../utils/initColStateFixed';
import { TColStateData } from '../../../models/TColStateData';

type TColName = keyof (IApiMovum | IApiFixum);
type TColState = keyof TColStateData;

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableDataComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  @ViewChild('tableContainerDiv')
  tableContainerDiv?: ElementRef<HTMLDivElement>;

  @ViewChildren(SelectTableRowsDirective)
  tableRows?: QueryList<SelectTableRowsDirective>;

  nonHideableCols = ['download_checkboxes', 'preview_url', 'source_name'];
  allShownCols: string[] = [];

  dataSource?: MatTableDataSource<IApiMovum | IApiFixum>;
  apiSelectedDatum?: IApiMovum | IApiFixum;
  allApiData?: IApiMovum[] | IApiFixum[];
  paginatedApiData?: IApiMovum[] | IApiFixum[];
  colState?: TColStateData;
  shownHideableCols?: Partial<keyof TColStateData>[] = [];

  subscriptions = new Subscription();
  isDownloadAllCheckboxChecked = false;
  isDownloadAllCheckboxIndeterminate = false;
  isScrolling = true;
  downloadRowState: TDownloadRowsState = {};

  pageSizeOptions = [25, 50, 100, 200];
  pageSize = 25;
  pageIndex = 0;

  constructor(
    private store$: Store<IAppState>,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private fetchImageService: ImageFetchService
  ) {
    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.allApiData = apiData?.filter((_, ind) => ind < 70000000000);
        if (this.allApiData) {
          this.setPaginatorAndSort();
        }
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedDatum)
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;
          this.rerenderTable();

          // Determine position Scroll to selected row in table
          const sortedApiData = this.getSortedApiData();
          if (!sortedApiData || !apiSelectedDatum) return;
          const rowOfApiSelectedDatum: number =
            sortedApiData
              .map((apiDatum) => apiDatum.product_id)
              .indexOf(apiSelectedDatum.product_id) -
            this.pageIndex * this.pageSize;

          if (this.isScrolling && this.tableRows && this.tableContainerDiv) {
            const rowHeight = this.tableRows.get(1)?.nativeElement.offsetHeight;
            const offset = this.tableContainerDiv.nativeElement.clientHeight;
            if (rowHeight && offset) {
              const top = rowOfApiSelectedDatum * rowHeight - offset * 0.4;
              this.tableContainerDiv.nativeElement.scroll({
                top,
                behavior: 'smooth',
              });
            }
          }
        })
    );
    this.subscriptions.add(
      this.store$.select(selectApiDataShownColState).subscribe((colState) => {
        //
        this.colState = colState;
        if (!this.colState) return;

        const x = Object.keys(this.colState) as (keyof TColStateData)[];
        const y = x.filter(
          (key) =>
            this.colState![key as keyof TColStateData] &&
            !this.nonHideableCols.includes(key)
        );

        this.shownHideableCols = y;
        this.allShownCols = [
          ...this.nonHideableCols,
          ...this.shownHideableCols,
        ];
        this.rerenderTable();
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiDataDownloadRowState)
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
    if (!this.allApiData) return;
    this.dataSource = new MatTableDataSource(this.allApiData);

    if (!this.paginator) return;
    this.dataSource.paginator = this.paginator;

    if (!this.sort) return;
    this.dataSource.sort = this.sort;

    this.rerenderTable();
  }

  onPaginateChange(event: PageEvent) {
    console.log('Page event: ', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchImageService.resetQueue();
    this.selectRowDatum(0);
    this.rerenderTable();
  }

  isRowDisplayed(row: IApiMovum) {
    const sortedData = this.getSortedApiData();
    if (!sortedData) return false;
    const rowIndex = sortedData.indexOf(row);
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
    if (!this.dataSource) return;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

    // Determine index of presently selected datum:
    const sortedApiData = this.getSortedApiData();
    const selectedDatum = this.apiSelectedDatum;

    // Logic to select row above/below
    if (selectedDatum && sortedApiData && (isArrowUp || isArrowDown)) {
      const oldIndex = sortedApiData
        .map((el) => el.product_id)
        .indexOf(selectedDatum.product_id);
      let newIndex = isArrowUp ? oldIndex - 1 : oldIndex + 1;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= sortedApiData.length) newIndex = sortedApiData.length - 1;
      const apiDatum = sortedApiData[newIndex];
      this.store$.dispatch(ApiDataAction_SetSelectedDatum({ apiDatum }));
    }
  }

  getSortedApiData(): IApiMovum[] | IApiFixum[] | undefined {
    if (!this.dataSource || !this.dataSource.sort) return undefined;
    let data = [...this.dataSource.data];

    // Apply filtering first
    if (this.dataSource && this.dataSource.filter) {
      data = data.filter((item) =>
        this.dataSource!.filterPredicate(item, this.dataSource!.filter)
      );
    }

    const sort = this.dataSource.sort;
    return this.dataSource.sortData(data, sort);
  }

  /////////////////////////////////////////////
  // Logic related to checkboxes
  /////////////////////////////////////////////
  clickDownloadAllCheckbox() {
    if (!this.allApiData) return;
    this.isDownloadAllCheckboxChecked = !this.isDownloadAllCheckboxChecked;
    const newDownloadRowState = { ...this.downloadRowState };
    Object.keys(newDownloadRowState).forEach((key, ind) => {
      newDownloadRowState[key] = this.isDownloadAllCheckboxChecked;
    });
    this.store$.dispatch(
      ApiDataAction_SetDownloadRowState({ newDownloadRowState })
    );
    this.isDownloadAllCheckboxIndeterminate = false;
  }

  updateDownloadRowCheckbox(apiDatum: IApiMovum, e: MatCheckboxChange) {
    const productId = apiDatum.product_id;
    const newDownloadRowState = { ...this.downloadRowState };
    newDownloadRowState[productId] = !newDownloadRowState[productId];
    this.store$.dispatch(
      ApiDataAction_SetDownloadRowState({ newDownloadRowState })
    );
    this.isDownloadAllCheckboxIndeterminate = true;
  }

  isRowChecked(apiDatum: IApiMovum) {
    return this.downloadRowState[apiDatum.product_id];
  }

  isRowSelected(element: IApiMovum) {
    const isRowSelected =
      element.product_id === this.apiSelectedDatum?.product_id;
    return isRowSelected;
  }

  //////////////////////////

  formatCellEntry(colName: keyof IApiMovum, colEntry: string | number | null) {
    if (!colEntry) return 'N/A';
    if (typeof colEntry === 'number') {
      const label = apiDataLabels[colName];
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
    const apiDatumLabels = (apiDataLabels as any)[key as any];
    return apiDatumLabels.label;
  }

  getTooltip(key: string) {
    const apiDatumLabels = (apiDataLabels as any)[key as any];
    return apiDatumLabels.description;
  }

  selectRowDatum(i: number) {
    // Flip flag to prevent scrolling on table clicks
    this.isScrolling = false;
    setTimeout(() => (this.isScrolling = true), 300);
    // Determine location of selectedDatum within sorted table data
    const sortedApiData = this.getSortedApiData();
    if (!sortedApiData) return;

    const paginatedRowIndex = i + this.pageIndex * this.pageSize;
    const apiDatum = sortedApiData[paginatedRowIndex];
    // If found then update
    this.store$.dispatch(ApiDataAction_SetSelectedDatum({ apiDatum }));
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
}
