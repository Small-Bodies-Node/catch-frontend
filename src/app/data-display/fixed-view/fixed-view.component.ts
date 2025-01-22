import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, map, Subscription } from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import {
  selectApiFixed,
  selectApiFixedStatus,
} from '../../ngrx/selectors/api-fixed.selectors';
import {
  controlKeysForSources,
  TControlKeyForSources,
} from '../../../models/TControlKeyForSources';
import { IApiFixedStatus } from '../../../models/IApiFixedStatus';
import {
  ApiFixedAction_FetchResult,
  ApiFixedAction_SetStatus,
} from '../../ngrx/actions/api-fixed.actions';
import { headerHeightPx } from '../../../utils/constants';

@Component({
  selector: 'app-fixed-view',
  templateUrl: './fixed-view.component.html',
  styleUrls: ['./fixed-view.component.scss'],
  standalone: false,
})
export class FixedViewComponent implements OnInit {
  // --->>>

  ra?: string;
  dec?: string;
  subscriptions = new Subscription();
  apiFixedStatus: IApiFixedStatus = { code: 'unknown', message: '' };
  isDataReady = false;

  maxHeight = `calc(100vh - ${headerHeightPx}px)`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<IAppState>
  ) {
    //--->>
    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiFixed),
        this.store$.select(selectApiFixedStatus),
        this.route.queryParams.pipe(
          map((params) => {
            //
            //

            const ra = (this.ra = params['ra']);
            const dec = (this.dec = params['dec']);
            const radius = +(params['radius'] || 0) || 0;
            const intersectionType = params['intersection_type'];
            const startTime = params['start_time'];
            const stopTime = params['stop_time'];
            let sources: TControlKeyForSources[] = params['sources'] || [];
            if (!Array.isArray(sources)) sources = [sources];
            if (!sources.length) {
              sources = controlKeysForSources;
            }

            return {
              ra,
              dec,
              radius,
              startTime,
              stopTime,
              sources,
              intersectionType,
            };
          })
        ),
      ])
        .pipe(
          distinctUntilChanged(),
          map(([apiFixed, apiFixedStatus, params]) => {
            // console.log('>>>>> ', apiStatus, target);
            return { apiFixed, apiFixedStatus, params };
          })
        )
        .subscribe(({ apiFixedStatus, params }) => {
          // --->>

          const {
            ra,
            dec,
            radius,
            intersectionType,
            sources,
            startTime,
            stopTime,
          } = params;

          if (!ra || !dec) {
            this.router.navigate([''], {});
            return;
          }

          this.apiFixedStatus = apiFixedStatus;
          this.isDataReady = apiFixedStatus.code === 'found';

          if (apiFixedStatus.code === 'unknown') {
            this.store$.dispatch(
              ApiFixedAction_SetStatus({
                code: 'searching',
                message: 'Begin searching....',
                query: {
                  ra,
                  dec,
                  radius,
                  intersectionType,
                  sources,
                  startTime,
                  stopTime,
                },
              })
            );
            this.store$.dispatch(
              ApiFixedAction_FetchResult({
                ra,
                dec,
                radius,
                intersectionType,
                sources,
                startTime,
                stopTime,
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
}
