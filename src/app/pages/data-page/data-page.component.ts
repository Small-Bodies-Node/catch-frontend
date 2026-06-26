import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../ngrx/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { headerHeightPx } from '../../../utils/constants';
import { IApiMovum } from '../../../models/IApiMovum';
import { IApiFixum } from '../../../models/IApiFixum';
import { TApiDataStatus } from '../../../models/TApiDataStatus';
import { selectApiData, selectApiDataStatus } from '../../ngrx/selectors/api-data.selectors';
import { ApiDataAction_SetStatus } from '../../ngrx/actions/api-data.actions';
import { DesktopLayoutComponent } from './desktop-layout/desktop-layout.component';
import { MobileLayoutComponent } from './mobile-layout/mobile-layout.component';
import { parseDataRouteQueryParams } from './data-route-query-params';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  imports: [DesktopLayoutComponent, MobileLayoutComponent],
  standalone: true,
})
export class DataPageComponent implements OnInit, OnDestroy {
  // --->

  maxHeight = `calc(100vh - ${headerHeightPx}px)`;

  apiData?: IApiMovum[] | IApiFixum[];
  apiDataStatus?: TApiDataStatus;
  subscriptions = new Subscription();
  isMobile = false;

  private resizeListener = () => this.updateIsMobile();

  /**
   * Note: this flag is used to ensure that we only ever load data
   * from query params ONCE per visit to /data. This is important because attempts to reset
   * status/apiData on e.g. navigation events away from this page might retrigger
   * the fetching of data without this flag.
   */
  isDataLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private store$: Store<IAppState>,
  ) {
    //--->>

    this.updateIsMobile();

    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiData),
        this.store$.select(selectApiDataStatus),
        this.route.queryParams,
      ])
        .pipe(
          distinctUntilChanged(),
          map(([apiData, apiDataStatus, queryParams]) => {
            // console.log('>>>>> ', apiData, apiDataStatus, queryParams);
            return { apiData, apiDataStatus, queryParams };
          }),
        )
        .subscribe(({ apiData, apiDataStatus, queryParams }) => {
          // --->>

          this.apiData = apiData;
          this.apiDataStatus = apiDataStatus;

          /* Don't attempt to do anything until we have a status */
          if (!this.apiDataStatus) return;

          /* If we have data, we don't need to fetch data */
          if (this.apiData) this.isDataLoaded = true;

          /* We'll need params from the URL to fetch data */
          if (!queryParams) return;

          /* Only ever load data from query params ONCE per visit to /data */
          if (this.isDataLoaded) return;
          this.isDataLoaded = true;

          /**
           * OK, if you've made it this far, then the goal MUST be to fetch data
           * from query params! So let's do it
           */

          const parsedSearch = parseDataRouteQueryParams(queryParams);
          if (!parsedSearch.ok) {
            console.error(parsedSearch.message);
            this.snackBar.open(parsedSearch.message, 'Close', {});
            this.router.navigate([''], {});
            return;
          }

          this.store$.dispatch(
            ApiDataAction_SetStatus({
              code: 'initiated',
              message: 'Begin searching....',
              search: parsedSearch.search,
            }),
          );
        }),
    );
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  _displayData(data: any) {
    return JSON.stringify(data, null, 2);
  }

  private updateIsMobile(): void {
    if (typeof window === 'undefined') {
      this.isMobile = false;
      return;
    }
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }
}
