import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { FitsJpgTogglerComponent } from '../fits-jpg-toggler/fits-jpg-toggler.component';
import { SolarViewerComponent } from '../solar-viewer/solar-viewer.component';
import { TableDataComponent } from '../table-data/table-data.component';
import { TitleDataComponent } from '../title-data/title-data.component';
import { IApiFixum } from '../../../../models/IApiFixum';
import { IApiMovum } from '../../../../models/IApiMovum';
import { TApiDataStatus } from '../../../../models/TApiDataStatus';
import { IAppState } from '../../../ngrx/reducers';
import { selectApiData, selectApiDataStatus } from '../../../ngrx/selectors/api-data.selectors';

@Component({
  selector: 'app-mobile-layout',
  templateUrl: './mobile-layout.component.html',
  styleUrls: ['./mobile-layout.component.scss'],
  imports: [
    TableDataComponent,
    TitleDataComponent,
    FitsJpgTogglerComponent,
    SolarViewerComponent,
    NgClass,
  ],
  standalone: true,
})
export class MobileLayoutComponent implements OnInit, OnDestroy {
  apiData?: IApiMovum[] | IApiFixum[];
  apiDataStatus?: TApiDataStatus;
  movingOrFixed?: 'moving' | 'fixed';

  private subscriptions = new Subscription();

  constructor(private store$: Store<IAppState>) {
    this.subscriptions.add(
      combineLatest([this.store$.select(selectApiData), this.store$.select(selectApiDataStatus)])
        .pipe(distinctUntilChanged())
        .subscribe(([apiData, apiDataStatus]) => {
          this.apiDataStatus = apiDataStatus;
          this.apiData = apiData;
          if (!apiDataStatus) return;
          const { search } = apiDataStatus;
          const { searchType } = search!;
          this.movingOrFixed = searchType;
        })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
