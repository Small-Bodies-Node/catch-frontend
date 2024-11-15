import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { IApiDatum } from '../../../models/IApiDatum';
import { IAppState } from '../../ngrx/reducers';
import { TApiDataLabels } from '../../../models/TApiDataLabels';
import { apiDataLabels } from '../../../utils/apiDataLabels';
import { apiDataInitColState } from '../../../utils/apiDataInitColState';
import { TApiDataColState } from '../../../models/TApiDataColState';
import { selectTableCheckboxState } from '../../ngrx/selectors/table-checkbox.selectors';
import {
  selectApiDataDownloadRowState,
  selectApiData,
  selectApiSelectedDatum,
} from '../../ngrx/selectors/api-data.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  ApiDataAction_SetDownloadRowState,
  ApiDataAction_SetSelectedDatum,
} from '../../ngrx/actions/api-data.actions';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { MatCheckboxChange } from '@angular/material/checkbox';

type TColName = keyof IApiDatum;

@Component({
  selector: 'app-table-1',
  templateUrl: './table-1.component.html',
  styleUrls: ['./table-1.component.scss'],
})
export class Table1Component
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  dataSource?: MatTableDataSource<IApiDatum>;
  apiSelectedDatum?: IApiDatum;
  apiData?: IApiDatum[];
  colState: Partial<TApiDataColState> = { ...apiDataInitColState };
  shownCols: Partial<TColName>[] = Object.keys(apiDataInitColState).filter(
    (key) => apiDataInitColState[key as keyof TApiDataColState]
  ) as Partial<TColName>[];
  apiDataLabels: TApiDataLabels = apiDataLabels;
  subscriptions = new Subscription();
  isDownloadAllCheckboxChecked = false;
  isDownloadAllCheckboxIndeterminate = false;
  downloadRowState: TDownloadRowsState = {};

  pageSizeOptions = [25, 50, 100, 200];
  pageSize = 25;

  constructor(
    private store$: Store<IAppState>,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData?.filter((_, ind) => ind < 70000000000);
        if (this.apiData) {
          this.dataSource = new MatTableDataSource(this.apiData);
          this.setPaginatorAndSort();
        }
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedDatum)
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;
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
    this.setPaginatorAndSort();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  setPaginatorAndSort() {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (!this.dataSource) return;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    if (!this.shownCols) return [];
    return [
      'download_checkboxes', // download_checkboxes
      // 'preview_url',
      'source_name',
      ...this.shownCols,
    ];
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

  getSortedApiData(): IApiDatum[] | undefined {
    if (!this.dataSource || !this.dataSource.sort) return undefined;
    const data = [...this.dataSource.data];
    const sort = this.dataSource.sort;
    return this.dataSource.sortData(data, sort);
  }

  /////////////////////////////////////////////
  // Logic related to checkboxes
  /////////////////////////////////////////////
  clickDownloadAllCheckbox() {
    if (!this.apiData) return;
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

  updateDownloadRowCheckbox(apiDatum: IApiDatum, e: MatCheckboxChange) {
    const productId = apiDatum.product_id;
    const newDownloadRowState = { ...this.downloadRowState };
    newDownloadRowState[productId] = !newDownloadRowState[productId];
    this.store$.dispatch(
      ApiDataAction_SetDownloadRowState({ newDownloadRowState })
    );
    this.isDownloadAllCheckboxIndeterminate = true;
  }

  isRowChecked(apiDatum: IApiDatum) {
    return this.downloadRowState[apiDatum.product_id];
  }

  isRowSelected(element: IApiDatum) {
    const isRowSelected =
      element.product_id === this.apiSelectedDatum?.product_id;
    return isRowSelected;
  }
}
