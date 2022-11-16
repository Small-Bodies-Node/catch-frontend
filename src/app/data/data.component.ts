import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { IAppState } from '../ngrx/reducers';
import {
  selectApiData,
  selectApiStatus,
} from '../ngrx/selectors/api.selectors';
import { ApiFetchResult, ApiSetStatus } from '../ngrx/actions/api.actions';
import { IApiStatus } from '../models/IApiStatus';
import { IApiDatum } from '../models/IApiDatum';
import { headerHeightPx } from '../utils/layout-constants';
import { sourcesNamesDict } from '../utils/sourcesNamesDict';
import { sources, TSources } from '../models/TSources';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  // --->>>

  apiData?: IApiDatum[];
  apiStatus: IApiStatus = {
    code: 'unknown',
    message: '',
    query: undefined,
  };
  isDataReady = false;
  maxHeight = `calc(100vh - ${headerHeightPx}px)`;
  target?: string;
  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<IAppState>
  ) {
    //--->>

    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiData),
        this.store$.select(selectApiStatus),
        this.route.queryParams.pipe(
          map((params) => {
            // target=65P&sources=catalina_lemmon&sources=spacewatch&uncertainty_ellipse=false&padding=10&cached=true

            const target = (this.target = params['target']) || '';
            const isCached = params['cached'] === 'true' || false;
            const isUncertaintyEllipse =
              params['uncertainty_ellipse'] === 'true' || false;
            const padding = +(params['padding'] || 0) || 0;
            let sources: TSources[] = params['sources'] || [];
            if (!Array.isArray(sources)) sources = [sources];
            if (!sources.length) {
              sources = [...Object.keys(sourcesNamesDict)] as any;
            }

            console.log(
              '>>> ',
              sources,
              isCached,
              isUncertaintyEllipse,
              padding,
              target
            );

            return {
              sources,
              isCached,
              isUncertaintyEllipse,
              padding,
              target,
            };
          })
        ),
      ])
        .pipe(
          distinctUntilChanged(),
          map(([apiData, apiStatus, params]) => {
            // console.log('>>>>> ', apiStatus, target);
            return { apiData, apiStatus, params };
          })
        )
        .subscribe(({ apiStatus, params }) => {
          // --->>

          const { target, isCached, isUncertaintyEllipse, padding, sources } =
            params;

          if (!target) {
            this.router.navigate([''], {});
            return;
          }

          this.apiStatus = apiStatus;
          this.isDataReady = apiStatus.code === 'found';

          if (apiStatus.code === 'unknown') {
            this.store$.dispatch(
              new ApiSetStatus({
                code: 'searching',
                message: 'Begin searching....',
                query: {
                  target,
                  isCached,
                  isUncertaintyEllipse,
                  padding,
                  sources,
                },
              })
            );
            this.store$.dispatch(
              new ApiFetchResult({
                target,
                isCached,
                isUncertaintyEllipse,
                padding,
                sources,
              })
            );
          }
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
