import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../ngrx/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { headerHeightPx } from '../../utils/constants';
import { IApiMovum } from '../../models/IApiMovum';
import { IApiFixum } from '../../models/IApiFixum';
import { TApiDataStatus } from '../../models/TApiDataStatus';
import {
  intersectionTypes,
  TIntersectionType,
} from '../../models/TIntersectionType';
import {
  selectApiData,
  selectApiDataStatus,
} from '../ngrx/selectors/api-data.selectors';
import { TControlKeyForSources } from '../../models/TControlKeyForSources';
import { TApiDataSearch } from '../../models/TApiDataSearch';
import { ApiDataAction_SetStatus } from '../ngrx/actions/api-data.actions';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'],
  standalone: false,
})
export class DataDisplayComponent implements OnInit, OnDestroy {
  // --->

  maxHeight = `calc(100vh - ${headerHeightPx}px)`;

  apiData?: IApiMovum[] | IApiFixum[];
  apiDataStatus?: TApiDataStatus;
  subscriptions = new Subscription();

  /**
   * Note: this flag is used to ensure that we only ever load data
   * from query params ONCE per visit to /data. This is important because attempts to reset
   * status/apiData on e.g. navigation events away from this page might retrigger
   * the fetching of data without this flag.
   */
  isDataLoaded = false;

  // Moving Query Params
  target?: string;
  cached?: boolean;
  uncertainty_ellipse?: boolean;
  padding?: number;

  // Fixed Query Params
  ra?: string;
  dec?: string;
  radius?: number;
  intersection_type?: TIntersectionType;

  // Shared
  start_date?: string;
  stop_date?: string;
  sources?: TControlKeyForSources[];

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private store$: Store<IAppState>
  ) {
    //--->>

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
          })
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

          // Moving Query Params
          this.target =
            'target' in queryParams ? queryParams['target'] : undefined;
          this.cached =
            'cached' in queryParams ? queryParams['cached'] === 'true' : true;
          this.uncertainty_ellipse =
            'uncertainty_ellipse' in queryParams
              ? queryParams['uncertainty_ellipse'] === 'true'
              : false;
          this.padding =
            'padding' in queryParams ? queryParams['padding'] : undefined;

          // Fixed Query Params
          this.ra = 'ra' in queryParams ? queryParams['ra'] : undefined;
          this.dec = 'dec' in queryParams ? queryParams['dec'] : undefined;
          this.radius =
            'radius' in queryParams ? queryParams['radius'] : undefined;
          this.intersection_type =
            'intersection_type' in queryParams
              ? queryParams['intersection_type']
              : undefined;

          if (
            this.intersection_type &&
            !intersectionTypes.includes(this.intersection_type)
          ) {
            const errMsg = `The intersection_type value '${
              this.intersection_type
            }' provided in the query params is invalid. The valid values are: ${intersectionTypes.join(
              ', '
            )}
            `;
            console.error(errMsg);
            this.snackBar.open(errMsg, 'Close', {});
          }

          // Shared
          this.start_date =
            'start_date' in queryParams ? queryParams['start_date'] : undefined;
          this.stop_date =
            'stop_date' in queryParams ? queryParams['stop_date'] : undefined;
          const sources =
            'sources' in queryParams ? queryParams['sources'] : [];
          this.sources = Array.isArray(sources) ? sources : [sources];

          if (!this.target && (!this.ra || !this.dec)) {
            this.router.navigate([''], {});
            return;
          }

          const newSearchParams: TApiDataSearch = this.target
            ? {
                searchType: 'moving',
                searchParams: {
                  target: this.target!,
                  cached: this.cached,
                  uncertainty_ellipse: this.uncertainty_ellipse,
                  padding: this.padding,
                  start_date: this.start_date,
                  stop_date: this.stop_date,
                  sources: this.sources,
                },
              }
            : {
                searchType: 'fixed',
                searchParams: {
                  ra: this.ra!,
                  dec: this.dec!,
                  radius: this.radius,
                  intersection_type: this.intersection_type,
                  start_date: this.start_date,
                  stop_date: this.stop_date,
                  sources: this.sources,
                },
              };

          this.store$.dispatch(
            ApiDataAction_SetStatus({
              code: 'initiated',
              message: 'Begin searching....',
              search: newSearchParams,
            })
          );
        })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  _displayData(data: any) {
    return JSON.stringify(data, null, 2);
  }
}
