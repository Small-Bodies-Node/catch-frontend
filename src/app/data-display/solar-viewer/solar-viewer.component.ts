import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription, take } from 'rxjs';

import { SbnSolarViewer, dateToJulianDay } from 'sbn-solar-viewer';
import { IApiMovum } from '../../../models/IApiMovum';
import { IAppState } from '../../ngrx/reducers';
import {
  selectApiData,
  selectApiSelectedDatum,
  selectApiDataStatus,
  selectPaginatedApiData,
} from '../../ngrx/selectors/api-data.selectors';
import { IApiFixum } from '../../../models/IApiFixum';

@Component({
  selector: 'app-solar-viewer',
  templateUrl: './solar-viewer.component.html',
  styleUrls: ['./solar-viewer.component.scss'],
  standalone: false,
})
export class SolarViewerComponent implements OnInit {
  // --->>>

  sbnSolarViewerId = 'sbn-solar-viewer-id';
  solarViewer?: SbnSolarViewer;
  apiData?: IApiMovum[] | IApiFixum[];
  apiSelectedDatum?: IApiMovum | IApiFixum;
  subscriptions = new Subscription();

  target?: string;

  constructor(private store$: Store<IAppState>) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiDataStatus).pipe(take(1)),
        this.store$.select(selectApiData).pipe(take(1)),
      ]).subscribe(([status, apiData]) => {
        if (!status || !status.search) return;
        if (status.search.searchType === 'fixed') return;

        this.target = status.search.searchParams.target;

        this.apiData = apiData;
        if (apiData && this.target) {
          const timeStamps = apiData.map((data) => {
            return data.date;
          });
          const timeStampsJds = timeStamps.map((date) =>
            dateToJulianDay(new Date(date))
          );
          // console.log('timeStamps', timeStamps);
          if (!this.solarViewer) {
            setTimeout(() => {
              this.solarViewer = new SbnSolarViewer({
                containerId: this.sbnSolarViewerId,
                // asteroid: { target: '65P*', data: timeStampsJds },
                asteroid: { target: this.target!, data: timeStampsJds },
                isControlsShown: !true,
                logScaleZoomingPositionAus: { x: 3, y: 0, z: 1 },
                nonLogScaleZoomingPositionAus: { x: 0, y: 0, z: 10 },
                // planetOpacity: 0.9,
                isStarField: true,
              });
              this.solarViewer.setTargetTime(timeStamps[0]);
              this.solarViewer.begin();
            }, 1000);
          } else {
            // Update the solar viewer with the new data
            // this.solarViewer.setAsteroidObservationTimes(timeStampsJds);
          }
        }
      })
    );

    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedDatum)
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;
          if (!this.apiSelectedDatum) return;
          const timeStamp = this.apiSelectedDatum.date;
          if (this.solarViewer) {
            this.solarViewer.setTargetTime(timeStamp);
          }
        })
    );
  }
}
