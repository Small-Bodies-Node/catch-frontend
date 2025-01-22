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
    standalone: false
})
export class PanstarrsOverlayComponent implements OnInit {
  @ViewChild('myContainer') myDiv!: ElementRef;

  apiSelectedDatum?: IApiDatum;
  subscriptions = new Subscription();
  raDecs: { ra: number; dec: number; raErr: number; decErr: number }[] = [];

  constructor(
    private store$: Store<IAppState>,
    private pansstarrsApiService: PanstarrsApiService
  ) {
    this.subscriptions.add(
      combineLatest([this.store$.select(selectApiSelectedDatum)])
        .pipe(
          distinctUntilChanged(),
          map(([apiSelectedDatum]) => apiSelectedDatum)
        )
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;

          if (this.apiSelectedDatum) {
            const ra = this.apiSelectedDatum.ra;
            const dec = this.apiSelectedDatum.dec;

            this.pansstarrsApiService
              .getPanstarrsData(ra, dec, 50, 0.03)
              .subscribe((apiPayload) => {
                this.raDecs = apiPayload.data.map((datum: any) => ({
                  ra: datum.raMean,
                  dec: datum.decMean,
                  raErr: datum.raMeanErr,
                  decErr: datum.decMeanErr,
                }));
              });
          }
        })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Convert degrees to radians
  private deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * First-pass attempt
   */
  getDivLeftOld(ra: number): number {
    const ra0 = this.apiSelectedDatum?.ra;
    if (!ra0) return -1000;
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = ((ra - ra0) / angularWidth) * width + width / 2;
    return res;
  }

  /**
   * Claude-determined solution with cosine correction
   */
  getDivLeft(ra: number): number {
    const ra0 = this.apiSelectedDatum?.ra;
    if (!ra0) return -1000;

    const dec0 = this.apiSelectedDatum?.dec;
    if (dec0 === undefined) return -1000;

    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;

    // Apply the cosine correction factor based on declination
    const cosDec = Math.cos(this.deg2rad(dec0));

    // Adjust the RA difference by the cosine of declination
    const correctedRaDiff = (ra - ra0) * cosDec;

    const res = (correctedRaDiff / angularWidth) * width + width / 2;
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
    return 10;

    //
    /*
    const dec0 = this.apiSelectedDatum?.dec;
    if (dec0 === undefined) return 0;

    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;

    // Apply the cosine correction to the RA error as well
    const cosDec = Math.cos(this.deg2rad(dec0));
    const correctedRaErr = raErr * cosDec;

    const res = (correctedRaErr / angularWidth) * width;
    return res;
    */
  }

  getDivHeight(decErr: number): number {
    return 10;

    //
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = (decErr / angularWidth) * width;
    return res;
  }

  getOpacity(raErr: number) {
    // Return a value between 0.1 and 1.0
    // Return 0.1 if raErr is more than 0.007;
    // Return 1.0 if raErr is less than 0.003;
    return Math.max(0.1, 1.0 - (raErr - 0.003) / 0.004);
  }
}
