import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

// import * as SolarViewer from 'sbn-solar-system-viewer';
import * as SolarViewer from 'sbn-solar-system-viewer';
import { SceneManager } from 'sbn-solar-system-viewer/threejs/scene-manager';
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
  SBNSSV?: SceneManager;
  apiData?: IApiDatum[];
  apiSelectedDatum?: IApiDatum;
  subscriptions = new Subscription();

  constructor(private store$: Store<IAppState>) {
    // SolarViewer
    // console.log(SolarViewer);

    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData;
        if (this.apiData) {
          const timeStamps = this.apiData.map((data) => {
            return data.date;
          });
          console.log('timeStamps', timeStamps);
          setTimeout(() => {
            this.SBNSSV!.addObservations('65P', timeStamps);
          }, 3000);
        }
      })
    );
    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedDatum)
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;
          const timeStamp = this.apiSelectedDatum!.date;
          this.SBNSSV!.setTargetTime(timeStamp);
          // this.SBNSSV!.cycleTimeStamps('right');
        })
    );
  }

  ngOnInit(): void {
    // SolarViewer.init(this.sbnSolarViewerId);
    if (!false)
      setTimeout(() => {
        this.SBNSSV = new SolarViewer.SBNSSV({
          containerId: this.sbnSolarViewerId,
        });
        this.SBNSSV.begin();
      }, 1000);
  }
}
