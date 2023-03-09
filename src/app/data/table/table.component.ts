import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';

import { IApiDatum } from 'src/app/models/IApiDatum';
import { IAppState } from 'src/app/ngrx/reducers';
import { TApiDataLabels } from 'src/app/models/TApiDataLabels';
import { apiDataLabels } from 'src/app/utils/apiDataLabels';
import { IApiDataLabel } from 'src/app/models/IApiDataLabel';
import { SelectTableRowsDirective } from 'src/app/shared/directives/select-table-rows.directive';
import { apiDataInitColState } from 'src/app/utils/apiDataInitColState';
import { TApiDataColState } from 'src/app/models/TApiDataColState';
import { TableCheckboxesComponent } from '../table-checkboxes/table-checkboxes.component';
import { selectTableCheckboxState } from 'src/app/ngrx/selectors/table-checkbox.selectors';
import {
  selectApiDataDownloadRowState,
  selectApiData,
  selectApiSelectedDatum,
} from 'src/app/ngrx/selectors/api.selectors';
import {
  ApiSetDownloadRowState,
  ApiSetSelectedDatum,
} from 'src/app/ngrx/actions/api.actions';
import { PlotlyGraphWrapperComponent } from '../plotly-graph/plotly-graph.component';
import { TDownloadRowsState } from 'src/app/models/TDownloadRowsState';
import { MatCheckboxChange } from '@angular/material/checkbox';

type TColName = keyof IApiDatum;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  // --->>>

  @ViewChild(MatSort)
  sort?: MatSort;

  @ViewChild('tableContainerDiv')
  tableContainerDiv?: ElementRef<HTMLDivElement>;

  @ViewChildren(SelectTableRowsDirective)
  tableRows?: QueryList<SelectTableRowsDirective>;

  isScrolling = true;
  apiSelectedDatum?: IApiDatum;
  apiData?: IApiDatum[];
  subscriptions = new Subscription();
  colState: Partial<TApiDataColState> = { ...apiDataInitColState };
  shownCols: Partial<TColName>[] = Object.keys(apiDataInitColState).filter(
    (key) => apiDataInitColState[key as keyof TApiDataColState]
  ) as Partial<TColName>[];
  isSelectAllDownloadRowCheckboxChecked = false;
  apiDataLabels: TApiDataLabels = apiDataLabels;
  tableData?: MatTableDataSource<IApiDatum>;
  downloadRowState: TDownloadRowsState = {};

  constructor(private store$: Store<IAppState>, private dialog: MatDialog) {
    // --->>

    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData;
        this.tableData = new MatTableDataSource(this.apiData);
        if (this.sort) {
          this.tableData.sort = this.sort;
        }
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedDatum)
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;

          // Determine position Scroll to selected row in table
          const sortedApiData = this.getSortedApiData();
          if (!sortedApiData || !apiSelectedDatum) return;
          const rowOfApiSelectedDatum: number = sortedApiData
            .map((apiDatum) => apiDatum.product_id)
            .indexOf(apiSelectedDatum.product_id);

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
      this.store$.select(selectTableCheckboxState).subscribe((colState) => {
        this.colState = colState;
        this.shownCols = Object.keys(this.colState).filter(
          (key) => this.colState[key as keyof TApiDataColState]
        ) as TColName[];
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiDataDownloadRowState)
        .subscribe((downloadRowState) => {
          this.downloadRowState = downloadRowState;
        })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.sort && this.tableData) {
      this.tableData.sort = this.sort;
    } else {
      console.error('Sorting is not working!');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onTableClick() {
    if (!this.tableData) return;
  }

  getSortedApiData(): IApiDatum[] | undefined {
    if (!this.tableData || !this.tableData.sort) return undefined;
    const data = [...this.tableData.data];
    const sort = this.tableData.sort;
    return this.tableData.sortData(data, sort);
  }

  getAllCols() {
    if (!this.shownCols) return [];
    return [
      'download_checkboxes',
      'preview_url',
      'source_name',
      ...this.shownCols,
    ];
  }

  selectAllDownloadRowCheckbox() {
    if (!this.apiData) return;
    this.isSelectAllDownloadRowCheckboxChecked =
      !this.isSelectAllDownloadRowCheckboxChecked;
    const newDownloadRowState = { ...this.downloadRowState };
    Object.keys(newDownloadRowState).forEach((key, ind) => {
      newDownloadRowState[key] = this.isSelectAllDownloadRowCheckboxChecked;
    });
    this.store$.dispatch(new ApiSetDownloadRowState({ newDownloadRowState }));
  }

  updateDownloadRowCheckbox(apiDatum: IApiDatum, e: MatCheckboxChange) {
    const productId = apiDatum.product_id;
    const newDownloadRowState = { ...this.downloadRowState };
    newDownloadRowState[productId] = !newDownloadRowState[productId];
    this.store$.dispatch(new ApiSetDownloadRowState({ newDownloadRowState }));
  }

  getThumbnailUrl(url: string) {
    return url || 'assets/images/pngs/sbn_logo_v0.png';
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

  formatCellEntry(entry: string | number, labels?: IApiDataLabel) {
    // If null (e.g. skymapper instrument), then print 'N/A'
    if (!entry) return 'N/A';
    if (typeof entry === 'number') return entry.toFixed(labels!.fractionSize);
    if (entry.length > 23) {
      entry = entry.substring(0, 3) + '...' + entry.slice(-3);
    }
    return entry;
  }

  selectRowDatum(i: number) {
    // Flip flag to prevent scrolling on table clicks
    this.isScrolling = false;
    setTimeout(() => (this.isScrolling = true), 300);
    // Determine location of selectedDatum within sorted table data
    const sortedApiData = this.getSortedApiData();
    if (!sortedApiData) return;
    const apiDatum = sortedApiData[i];
    // If found then update
    this.store$.dispatch(new ApiSetSelectedDatum({ apiDatum }));
  }

  isRowSelected(element: IApiDatum) {
    return element.product_id === this.apiSelectedDatum?.product_id;
  }

  openSettingsDialog(e: MouseEvent) {
    e.stopPropagation();
    this.dialog.open<TableCheckboxesComponent>(TableCheckboxesComponent);
  }

  onClickPlotly(e: MouseEvent, xDataKey: Partial<TColName>) {
    e.stopPropagation();

    this.dialog.open<PlotlyGraphWrapperComponent, any>(
      PlotlyGraphWrapperComponent,
      { data: { xDataKey } }
    );
  }

  isRowChecked(apiDatum: IApiDatum) {
    return this.downloadRowState[apiDatum.product_id];
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
      this.store$.dispatch(new ApiSetSelectedDatum({ apiDatum }));
    }
  }
}
