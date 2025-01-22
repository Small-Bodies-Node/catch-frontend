import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { IAppState } from '../../ngrx/reducers';
import {
  selectApiData,
  selectApiDataStatus,
} from '../../ngrx/selectors/api-data.selectors';
import {
  ApiDataAction_FetchResult,
  ApiDataAction_SetStatus,
} from '../../ngrx/actions/api-data.actions';
import { IApiDataStatus } from '../../../models/IApiDataStatus';
import { IApiDatum } from '../../../models/IApiDatum';
import { headerHeightPx } from '../../../utils/constants';
import {
  controlKeysForSources,
  TControlKeyForSources,
} from '../../../models/TControlKeyForSources';

@Component({
  selector: 'app-desktop-view-2',
  templateUrl: './desktop-view-2.component.html',
  styleUrls: ['./desktop-view-2.component.scss'],
  standalone: false,
})
export class DesktopView2Component implements OnInit {
  // --->>>

  apiData?: IApiDatum[];
  apiStatus: IApiDataStatus = {
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
        this.store$.select(selectApiDataStatus),
        this.route.queryParams.pipe(
          map((params) => {
            //
            // target=65P&sources=catalina_lemmon
            //           &sources=spacewatch
            //           &uncertainty_ellipse=false
            //           &padding=10
            //           &cached=true
            //

            const target = (this.target = params['target']) || '';
            const isCached = params['cached'] === 'true' || false;
            const isUncertaintyEllipse =
              params['uncertainty_ellipse'] === 'true' || false;
            const padding = +(params['padding'] || 0) || 0;
            let sources: TControlKeyForSources[] = params['sources'] || [];
            if (!Array.isArray(sources)) sources = [sources];
            if (!sources.length) {
              sources = controlKeysForSources;
            }

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
              ApiDataAction_SetStatus({
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
              ApiDataAction_FetchResult({
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
