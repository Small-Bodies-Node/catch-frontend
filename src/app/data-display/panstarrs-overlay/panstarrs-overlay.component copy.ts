import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { IAppState } from '../../ngrx/reducers';
import { selectApiSelectedDatum } from '../../ngrx/selectors/api-data.selectors';
import { IApiDatum } from '../../../models/IApiDatum';
import { PanstarrsApiService } from '../../core/services/panstarrs-api/panstarrs-api';

@Component({
  selector: 'app-panstarrs-overlay',
  templateUrl: './panstarrs-overlay.component.html',
  styleUrls: ['./panstarrs-overlay.component.scss'],
})
export class PanstarrsOverlayComponent implements OnInit {
  // --->>>

  @ViewChild('myContainer') myDiv!: ElementRef;

  apiSelectedDatum?: IApiDatum;
  subscriptions = new Subscription();
  pansstarrsData?: any;
  raDecs: { ra: number; dec: number; raErr: number; decErr: number }[] = [];

  constructor(
    private store$: Store<IAppState>,
    private pansstarrsApiService: PanstarrsApiService
  ) {
    //--->>

    this.subscriptions.add(
      combineLatest([this.store$.select(selectApiSelectedDatum)])
        .pipe(
          distinctUntilChanged(),
          map(([apiSelectedDatum]) => {
            // console.log('>>>>> ', apiStatus, target);
            return apiSelectedDatum;
          })
        )
        .subscribe((apiSelectedDatum) => {
          // --->>

          this.apiSelectedDatum = apiSelectedDatum;

          if (this.apiSelectedDatum) {
            const ra = this.apiSelectedDatum.ra;
            const dec = this.apiSelectedDatum.dec;

            // 50 works well for neat data

            this.pansstarrsApiService
              .getPanstarrsData(ra, dec, 50, 0.03)
              .subscribe((apiPayload) => {
                this.raDecs = apiPayload.data.map((datum: any) => {
                  return {
                    ra: datum.raMean,
                    dec: datum.decMean,
                    raErr: datum.raMeanErr,
                    decErr: datum.decMeanErr,
                  };
                });

                // console.log(this.raDecs);
              });
          }
        })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getDivLeft(ra: number): number {
    const ra0 = this.apiSelectedDatum?.ra;
    if (!ra0) return -1000;
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = ((ra - ra0) / angularWidth) * width + width / 2;
    return res;
  }

  getDivTop(dec: number): number {
    const dec0 = this.apiSelectedDatum?.dec;
    if (!dec0) return -1000;
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = ((dec - dec0) / angularWidth) * width + width / 2;
    return res;
  }

  getDivWidth(raErr: number): number {
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = (raErr / angularWidth) * width;
    // console.log('raErr:', raErr, 'res:', res);
    return res;
  }

  getDivHeight(decErr: number): number {
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = (decErr / angularWidth) * width;
    return res;
  }
}
