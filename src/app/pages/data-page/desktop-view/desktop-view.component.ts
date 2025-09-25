import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '../../../ngrx/reducers';
import { selectApiData, selectApiDataStatus } from '../../../ngrx/selectors/api-data.selectors';
import { IApiMovum } from '../../../../models/IApiMovum';
import { headerHeightPx } from '../../../../utils/constants';
import { IApiFixum } from '../../../../models/IApiFixum';
import { TApiDataStatus } from '../../../../models/TApiDataStatus';
import { TableDataComponent } from '../table-data/table-data.component';
import { FitsJpgTogglerComponent } from '../fits-jpg-toggler/fits-jpg-toggler.component';
import { SolarViewerComponent } from '../solar-viewer/solar-viewer.component';
import { NgClass, NgStyle } from '@angular/common';
import { TitleDataComponent } from '../title-data/title-data.component';
import { TempTableComponent } from '../../../components/temp-table/temp-table.component';

@Component({
  selector: 'app-desktop-view',
  templateUrl: './desktop-view.component.html',
  styleUrls: ['./desktop-view.component.scss'],
  imports: [
    TableDataComponent,
    // TempTableComponent,
    TitleDataComponent,
    FitsJpgTogglerComponent,
    SolarViewerComponent,
    NgClass,
    NgStyle,
  ],
  standalone: true,
})
export class DesktopViewComponent implements OnInit {
  // --->>>

  maxHeight = `calc(100vh - ${headerHeightPx}px)`;
  apiData?: IApiMovum[] | IApiFixum[];
  apiDataStatus?: TApiDataStatus;
  movingOrFixed?: 'moving' | 'fixed';

  subscriptions = new Subscription();

  constructor(private store$: Store<IAppState>) {
    //--->>

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
        }),
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
