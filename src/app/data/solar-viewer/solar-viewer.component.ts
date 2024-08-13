import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

// import * as SolarViewer from 'sbn-solar-system-viewer';
// import * as SolarViewer from 'sbn-solar-system-viewer';
import { SbnSolarViewer, dateToJulianDay } from 'sbn-solar-viewer';
import { IApiDatum } from 'src/app/models/IApiDatum';
import { IAppState } from 'src/app/ngrx/reducers';
import {
  selectApiData,
  selectApiSelectedDatum,
} from 'src/app/ngrx/selectors/api.selectors';

@Component({
  selector: 'app-solar-viewer',
  templateUrl: './solar-viewer.component.html',
  styleUrls: ['./solar-viewer.component.scss'],
})
export class SolarViewerComponent implements OnInit {
  // --->>>

  sbnSolarViewerId = 'sbn-solar-viewer-id';
  solarViewer?: SbnSolarViewer;
  apiData?: IApiDatum[];
  apiSelectedDatum?: IApiDatum;
  subscriptions = new Subscription();

  constructor(private store$: Store<IAppState>) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData;
        if (this.apiData) {
          const timeStamps = this.apiData.map((data) => {
            return data.date;
          });
          const timeStampsJds = timeStamps.map((date) =>
            dateToJulianDay(new Date(date))
          );
          console.log('timeStamps', timeStamps);
          if (!this.solarViewer) {
            setTimeout(() => {
              this.solarViewer = new SbnSolarViewer({
                containerId: this.sbnSolarViewerId,
                // asteroid: { target: '65P*', data: timeStampsJds },
                asteroid: { target: '65P*', data: timeStampsJds },
              });
              this.solarViewer.setTargetTime(timeStamps[0]);
              this.solarViewer.begin();
            }, 1000);
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
