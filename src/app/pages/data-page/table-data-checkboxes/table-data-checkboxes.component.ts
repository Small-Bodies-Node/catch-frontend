import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Subscription } from 'rxjs';

import { IAppState } from '../../../ngrx/reducers';
import { apiDataLabels } from '../../../../utils/apiDataLabels';
import { TApiDataLabels } from '../../../../models/TApiDataLabels';
import { TApiDataColName } from '../../../../models/TApiDataColName';
import { getOrderedColNames } from '../../../../utils/getOrderedColNames';
import { MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { selectScreenDeviceEffectiveDevice } from '../../../ngrx/selectors/screen-device.selectors';
import {
  selectApiDataShownColState,
  selectApiDataStatus,
} from '../../../ngrx/selectors/api-data.selectors';
import { ApiDataAction_SetShownColState } from '../../../ngrx/actions/api-data.actions';
import { TColStateData } from '../../../../models/TColStateData';
import { TMovingVsFixed } from '../../../../models/TMovingVsFixed';
import { initColStateMoving } from '../../../../utils/initColStateMoving';
import { initColStateFixed } from '../../../../utils/initColStateFixed';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-table-data-checkboxes',
  templateUrl: './table-data-checkboxes.component.html',
  styleUrls: ['./table-data-checkboxes.component.scss'],
  imports: [
    MatProgressSpinner,
    MatDialogTitle,
    MatDialogContent,
    MatIcon,
    MatCheckbox,
    MatTooltip,
    NgClass,
  ],
  standalone: true,
})
export class TableDataCheckboxesComponent implements AfterViewInit, OnDestroy {
  // --->>>

  readonly nonConfigurableCols: readonly TApiDataColName[] = ['date', 'preview_url', 'source_name'];

  @ViewChild('dialogContainer')
  dialogContainer?: ElementRef<HTMLDivElement>;

  subscriptions = new Subscription();
  colState?: TColStateData;
  labels: Readonly<TApiDataLabels> = apiDataLabels;
  containerWidth: number = -1;
  isSpinner = true;
  isMobile = false;
  searchType?: TMovingVsFixed;
  private resizeObserver?: ResizeObserver;
  private timeoutIds = new Set<ReturnType<typeof setTimeout>>();

  // allColNames?: (keyof IApiMovum)[] | (keyof IApiFixum)[];
  // allColNames?: (keyof IApiMovum | keyof IApiFixum)[];
  allColNames?: (keyof TColStateData)[];

  constructor(
    private $store: Store<IAppState>,
    private dialogRef: MatDialogRef<TableDataCheckboxesComponent>,
  ) {
    // --->>

    this.subscriptions.add(
      combineLatest([
        this.$store.select(selectApiDataShownColState),
        this.$store.select(selectApiDataStatus),
      ])
        .pipe(distinctUntilChanged())
        .subscribe(([colState, apiDataStatus]) => {
          const { search } = apiDataStatus;
          if (!search || !colState) return;
          const { searchType } = search;
          this.searchType = searchType;
          const isMoving = searchType === 'moving';
          this.allColNames = getOrderedColNames(isMoving).filter(
            (colName) => !this.nonConfigurableCols.includes(colName),
          );
          this.colState = { ...colState };
          this.scheduleTimeout(() => {
            this.isSpinner = false;
          }, 1000);
        }),
    );

    this.subscriptions.add(
      this.$store.select(selectScreenDeviceEffectiveDevice).subscribe((device) => {
        this.isMobile = device === 'mobile';
      }),
    );
  }

  ngAfterViewInit(): void {
    const container = this.dialogContainer?.nativeElement;
    if (!container) return;

    this.updateContainerWidth(container.offsetWidth);

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.updateContainerWidth(entry.contentRect.width);
    });
    this.resizeObserver.observe(container);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.resizeObserver?.disconnect();
    this.timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeoutIds.clear();
  }

  updateColState(e: MatCheckboxChange, colName: TApiDataColName) {
    if (!this.colState || !this.searchType) return;
    this.colState = { ...this.colState, [colName]: e.checked };
    this.$store.dispatch(
      ApiDataAction_SetShownColState({
        apiDataShownColState: this.colState,
      }),
    );
  }

  selectAll() {
    if (!this.colState) return;
    const newColState = { ...this.colState };
    Object.keys(newColState).forEach((key: any) => {
      newColState[key as keyof TColStateData] = true;
    });
    this.isSpinner = true;

    this.scheduleTimeout(() => {
      this.$store.dispatch(
        ApiDataAction_SetShownColState({
          apiDataShownColState: newColState,
        }),
      );
    }, 1000);
  }

  resetAll() {
    if (!this.searchType) return;
    this.isSpinner = true;
    this.scheduleTimeout(() => {
      this.$store.dispatch(
        ApiDataAction_SetShownColState({
          apiDataShownColState:
            this.searchType === 'moving' ? initColStateMoving : initColStateFixed,
        }),
      );
    }, 500);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isChecked(colName: keyof TColStateData) {
    if (!this.colState) return false;
    return this.colState[colName];
  }

  getTooltip(colName: keyof TColStateData) {
    //

    if (!this.labels) return null;
    return this.labels[colName]?.description || null;

    // <!-- // (labels && labels[colName] && labels[colName]?.description) || '' -->
  }

  private scheduleTimeout(callback: () => void, delayMs: number): void {
    const timeoutId = setTimeout(() => {
      this.timeoutIds.delete(timeoutId);
      callback();
    }, delayMs);
    this.timeoutIds.add(timeoutId);
  }

  private updateContainerWidth(width: number): void {
    this.containerWidth = Math.floor(width);
  }
}
