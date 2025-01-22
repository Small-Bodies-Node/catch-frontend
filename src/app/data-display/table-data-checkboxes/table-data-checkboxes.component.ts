import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  interval,
  map,
  Observable,
  Subscription,
} from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import { apiDataLabels } from '../../../utils/apiDataLabels';
import { TApiDataLabels } from '../../../models/TApiDataLabels';
import { TApiDataColName } from '../../../models/TApiDataColName';
import { TApiDataColState } from '../../../models/TApiDataColState';
import { getOrderedColNames } from '../../../utils/getOrderedColNames';
import { apiDataInitColState } from '../../../utils/apiDataInitColState';
import { TableDataCheckboxAction_SetState } from '../../ngrx/actions/table-checkbox.actions';
import { selectTableDataCheckboxState } from '../../ngrx/selectors/table-checkbox.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { selectScreenDeviceEffectiveDevice } from '../../ngrx/selectors/screen-device.selectors';

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
  colState: Partial<TApiDataColState> = { ...apiDataInitColState };
  labels: Readonly<TApiDataLabels> = apiDataLabels;
  containerWidth$: Observable<number>;
  isSpinner = true;
  isMobile = false;

  allColNames: TApiDataColName[] = getOrderedColNames().filter(
    (colName) =>
      ![
        //
        'preview_url',
        'source_name',
      ].includes(colName)
  );

  constructor(
    private $store: Store<IAppState>,
    private dialogRef: MatDialogRef<TableDataCheckboxesComponent>
  ) {
    // --->>

    this.subscriptions.add(
      this.$store.select(selectTableDataCheckboxState).subscribe((colState) => {
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

    this.containerWidth$ = interval(50).pipe(
      map((_) => {
        const w = this.checkboxesContainer
          ? this.checkboxesContainer.nativeElement.offsetWidth
          : 100;
        return w;
      }),
      distinctUntilChanged()
      /*       map((width): number => {
        console.log('width', width);
        return width;
      }) */
    );
  }

  ngOnInit() {}

  ngOnDestroy() {}

  updateColState(e: MatCheckboxChange, colName: TApiDataColName) {
    this.colState = { ...this.colState, [colName]: e.checked };
    console.log('>>> ColName', colName, this.colState);
    this.$store.dispatch(
      TableDataCheckboxAction_SetState({
        newTableDataCheckboxState: { ...this.colState },
      })
    );
  }

  selectAll() {
    const newColState = { ...this.colState };
    Object.keys(newColState).forEach((key: any) => {
      newColState[key as keyof TApiDataColState] = true;
    });
    this.isSpinner = true;

    console.log('>>> ', newColState);

    setTimeout(() => {
      this.$store.dispatch(
        TableDataCheckboxAction_SetState({
          newTableDataCheckboxState: { ...newColState },
        })
      );
    }, 1000);
  }

  resetAll() {
    this.isSpinner = true;
    setTimeout(() => {
      this.$store.dispatch(
        TableDataCheckboxAction_SetState({
          newTableDataCheckboxState: apiDataInitColState,
        })
      );
    }, 1000);
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
}
