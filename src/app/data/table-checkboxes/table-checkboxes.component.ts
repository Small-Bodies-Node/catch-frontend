import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  delay,
  distinctUntilChanged,
  interval,
  map,
  Observable,
  Subscription,
} from 'rxjs';

import { IAppState } from 'src/app/ngrx/reducers';
import { apiDataLabels } from 'src/app/utils/apiDataLabels';
import { TApiDataLabels } from 'src/app/models/TApiDataLabels';
import { TApiDataColName } from 'src/app/models/TApiDataColName';
import { TApiDataColState } from 'src/app/models/TApiDataColState';
import { getOrderedColNames } from 'src/app/utils/getOrderedColNames';
import { apiDataInitColState } from 'src/app/utils/apiDataInitColState';
import { TableCheckboxSetState } from 'src/app/ngrx/actions/table-checkbox.actions';
import { selectTableCheckboxState } from 'src/app/ngrx/selectors/table-checkbox.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { selectScreenDeviceEffectiveDevice } from 'src/app/ngrx/selectors/screen-device.selectors';

@Component({
  selector: 'app-table-checkboxes',
  templateUrl: './table-checkboxes.component.html',
  styleUrls: ['./table-checkboxes.component.scss'],
})
export class TableCheckboxesComponent implements OnInit {
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
      ].includes(colName)
  );

  constructor(
    private $store: Store<IAppState>,
    private dialogRef: MatDialogRef<TableCheckboxesComponent>
  ) {
    // --->>

    this.subscriptions.add(
      this.$store.select(selectTableCheckboxState).subscribe((colState) => {
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
    this.$store.dispatch(
      new TableCheckboxSetState({ newTableCheckboxState: { ...this.colState } })
    );
  }

  selectAll() {
    const newColState = { ...this.colState };
    Object.keys(newColState).forEach((key: any) => {
      newColState[key as keyof TApiDataColState] = true;
    });
    this.isSpinner = true;
    setTimeout(() => {
      this.$store.dispatch(
        new TableCheckboxSetState({
          newTableCheckboxState: { ...newColState },
        })
      );
    }, 1000);
  }

  resetAll() {
    this.isSpinner = true;
    setTimeout(() => {
      this.$store.dispatch(
        new TableCheckboxSetState({
          newTableCheckboxState: apiDataInitColState,
        })
      );
    }, 1000);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
