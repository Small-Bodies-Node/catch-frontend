import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  distinctUntilChanged,
  interval,
  map,
  Subscription,
} from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import { apiDataLabels } from '../../../utils/apiDataLabels';
import { TApiDataLabels } from '../../../models/TApiDataLabels';
import { TApiDataColName } from '../../../models/TApiDataColName';
import { getOrderedColNames } from '../../../utils/getOrderedColNames';
import { MatDialogRef } from '@angular/material/dialog';
import { selectScreenDeviceEffectiveDevice } from '../../ngrx/selectors/screen-device.selectors';
import {
  selectApiDataShownColState,
  selectApiDataStatus,
} from '../../ngrx/selectors/api-data.selectors';
import { ApiDataAction_SetShownColState } from '../../ngrx/actions/api-data.actions';
import { IApiMovum } from '../../../models/IApiMovum';
import { IApiFixum } from '../../../models/IApiFixum';
import { TColStateData } from '../../../models/TColStateData';
import { TMovingVsFixed } from '../../../models/TMovingVsFixed';
import { initColStateMoving } from '../../../utils/initColStateMoving';
import { initColStateFixed } from '../../../utils/initColStateFixed';

@Component({
  selector: 'app-table-data-checkboxes',
  templateUrl: './table-data-checkboxes.component.html',
  styleUrls: ['./table-data-checkboxes.component.scss'],
  standalone: false,
})
export class TableDataCheckboxesComponent implements OnInit {
  // --->>>

  @ViewChild('checkboxesContainer')
  checkboxesContainer?: ElementRef<HTMLDivElement>;

  subscriptions = new Subscription();
  colState?: TColStateData;
  labels: Readonly<TApiDataLabels> = apiDataLabels;
  containerWidth: number = -1;
  isSpinner = true;
  isMobile = false;
  searchType?: TMovingVsFixed;

  // allColNames?: (keyof IApiMovum)[] | (keyof IApiFixum)[];
  // allColNames?: (keyof IApiMovum | keyof IApiFixum)[];
  allColNames?: (keyof TColStateData)[];

  constructor(
    private $store: Store<IAppState>,
    private dialogRef: MatDialogRef<TableDataCheckboxesComponent>
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
          this.allColNames = getOrderedColNames(isMoving);
          this.colState = { ...colState };
          setTimeout(() => {
            this.isSpinner = false;
          }, 1000);
        })
    );

    this.subscriptions.add(
      this.$store
        .select(selectScreenDeviceEffectiveDevice)
        .subscribe((device) => {
          this.isMobile = device === 'mobile';
        })
    );

    this.subscriptions.add(
      interval(50)
        .pipe(
          map((_) => {
            const w = this.checkboxesContainer
              ? this.checkboxesContainer.nativeElement.offsetWidth
              : 100;
            return w;
          }),
          distinctUntilChanged()
        )
        .subscribe((w) => (this.containerWidth = w))
    );
  }

  ngOnInit() {}

  ngOnDestroy() {}

  updateColState(e: MatCheckboxChange, colName: TApiDataColName) {
    if (!this.colState || !this.searchType) return;
    this.colState = { ...this.colState, [colName]: e.checked };
    this.$store.dispatch(
      ApiDataAction_SetShownColState({
        apiDataShownColState: this.colState,
      })
    );
  }

  selectAll() {
    if (!this.colState) return;
    const newColState = { ...this.colState };
    Object.keys(newColState).forEach((key: any) => {
      newColState[key as keyof TColStateData] = true;
    });
    this.isSpinner = true;

    console.log('>>> ', newColState);

    setTimeout(() => {
      this.$store.dispatch(
        // TableDataCheckboxAction_SetState({
        //   newTableDataCheckboxState: { ...newColState },
        // })
        ApiDataAction_SetShownColState({
          apiDataShownColState: newColState,
        })
      );
    }, 1000);
  }

  resetAll() {
    if (!this.searchType) return;
    this.isSpinner = true;
    setTimeout(() => {
      this.$store.dispatch(
        ApiDataAction_SetShownColState({
          apiDataShownColState:
            this.searchType === 'moving'
              ? initColStateMoving
              : initColStateFixed,
        })
      );
    }, 500);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  temp(labels: any, colName: any) {
    //
    false &&
      console.log(
        '>>> labels',
        labels,
        colName,
        labels && labels[colName] && labels[colName]?.label
      );

    return (labels && labels[colName] && labels[colName]?.label) || '';
  }

  isChecked(colName: keyof TColStateData) {
    if (!this.colState) return false;
    const x = this.colState;
    return this.colState[colName];
  }

  getTooltip(colName: keyof TColStateData) {
    //

    if (!this.labels) return null;
    return this.labels[colName]?.description || null;

    // <!-- // (labels && labels[colName] && labels[colName]?.description) || '' -->
  }
}
