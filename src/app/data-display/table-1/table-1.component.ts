import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
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

type TColName = keyof IApiDatum;

@Component({
  selector: 'app-table-1',
  templateUrl: './table-1.component.html',
  styleUrls: ['./table-1.component.scss'],
})
export class Table1Component implements OnInit, AfterViewInit, OnChanges {
  // --->>>

  apiSelectedDatum?: IApiDatum;
  apiData?: IApiDatum[];
  subscriptions = new Subscription();
  colState: Partial<TApiDataColState> = { ...apiDataInitColState };
  shownCols: Partial<TColName>[] = Object.keys(apiDataInitColState).filter(
    (key) => apiDataInitColState[key as keyof TApiDataColState]
  ) as Partial<TColName>[];
  apiDataLabels: TApiDataLabels = apiDataLabels;

  constructor(private store$: Store<IAppState>) {
    // --->>

    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData;
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
          //
        })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }
}
