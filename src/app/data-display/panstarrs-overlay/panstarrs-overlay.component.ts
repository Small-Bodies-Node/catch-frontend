import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription, debounceTime, map, catchError, of, forkJoin } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { IAppState } from '../../ngrx/reducers';
import {
  selectApiDataStatus,
  selectApiSelectedDatum,
} from '../../ngrx/selectors/api-data.selectors';
import { IApiMovum } from '../../../models/IApiMovum';
import { PanstarrsApiService } from '../../core/services/panstarrs-api/panstarrs-api';
import { IApiFixum } from '../../../models/IApiFixum';
import { convertToDecimal } from '../../../utils/convertToDecimal';
import { IPanstarrsApiResponse } from '../../../models/IPanstarrsApiResponse';
import { distToPanstarrsCenter } from '../../../utils/distToPanstarrsCenter';
import { ImageWcsService } from '../../core/services/image-wcs/image-wcs.service';

@Component({
  selector: 'app-panstarrs-overlay',
  templateUrl: './panstarrs-overlay.component.html',
  styleUrls: ['./panstarrs-overlay.component.scss'],
  standalone: false,
})
export class PanstarrsOverlayComponent implements OnInit, OnDestroy {
  @ViewChild('myContainer') myDiv!: ElementRef;

  apiSelectedDatum?: IApiMovum | IApiFixum;
  ra: number | string = 0;
  dec: number | string = 0;
  subscriptions = new Subscription();
  raDecs: { id: number; ra: number; dec: number; raErr: number; decErr: number; rMeanPSFMag: number }[] = [];
  isPanstarrsDataFound = false;

  // Properties for WCS-derived pixel coordinates
  pixelCoordinatesWCS: { x: number; y: number; id: number; ra: number; dec: number }[] = [];
  wcsDivWidth = 6;
  wcsDivHeight = 6;

  private wcsPixelCoordSubscription: Subscription = new Subscription(); // For managing WCS calculation subscription

  constructor(
    private store$: Store<IAppState>,
    private pansstarrsApiService: PanstarrsApiService,
    private imageWcsService: ImageWcsService
  ) {
    this.subscriptions.add(this.wcsPixelCoordSubscription); // Add to main subscriptions for cleanup

    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiSelectedDatum),
        this.store$.select(selectApiDataStatus),
      ])
        .pipe(distinctUntilChanged())
        .subscribe(([apiSelectedDatum, apiDataStatus]) => {
          if (!apiSelectedDatum) return;
          if (!apiDataStatus) return;
          if (!apiDataStatus.search) return;

          this.apiSelectedDatum = apiSelectedDatum;

          // I need to use this URL to get the WCS information
          const url = apiSelectedDatum.preview_url;

          this.ra =
            'ra' in this.apiSelectedDatum
              ? this.apiSelectedDatum.ra
              : 'ra' in apiDataStatus.search.searchParams
              ? apiDataStatus.search.searchParams.ra
              : 0;
          this.dec =
            'dec' in this.apiSelectedDatum
              ? this.apiSelectedDatum.dec
              : 'dec' in apiDataStatus.search.searchParams
              ? apiDataStatus.search.searchParams.dec
              : 0;

          this.pansstarrsApiService
            .getPanstarrsData(this.ra, this.dec, 50, 0.03)
            .subscribe((apiPayload) => {
              const data = apiPayload.data
                .sort(
                  (a, b) =>
                    distToPanstarrsCenter(a, this.ra, this.dec) -
                    distToPanstarrsCenter(b, this.ra, this.dec)
                )
                .filter((_, ind) => ind < 500);
              this.isPanstarrsDataFound = data.length > 0;
              this.raDecs = data.map((datum: any, ind: number) => ({
                id: ind,
                ra: datum.raMean,
                dec: datum.decMean,
                raErr: datum.raMeanErr,
                decErr: datum.decMeanErr,
                rMeanPSFMag: datum.rMeanPSFMag,
              }));

              // ---- Add WCS Pixel Coordinate Calculation ----
              this.wcsPixelCoordSubscription.unsubscribe(); // Cancel any previous ongoing WCS calculations
              this.wcsPixelCoordSubscription = new Subscription(); // Re-initialize for new additions

              const url = this.apiSelectedDatum?.preview_url;

              if (!url || !this.raDecs || this.raDecs.length === 0) {
                this.pixelCoordinatesWCS = [];
                // Potentially return or handle if other logic below depends on this check
              } else {
                const coordObservables = this.raDecs.map(raDecItem =>
                  this.imageWcsService.getPixelCoordinatesFromUrl(url, raDecItem.ra, raDecItem.dec).pipe(
                    map(([x, y]) => ({
                      x,
                      y,
                      id: raDecItem.id,
                      ra: raDecItem.ra,
                      dec: raDecItem.dec
                    })),
                    catchError(error => {
                      console.warn(`WCS: Failed to get pixel coords for RA:${raDecItem.ra}, Dec:${raDecItem.dec}. Error: ${error.message || error}`);
                      return of(null); // Return null for this item on error, will be filtered later
                    })
                  )
                );

                if (coordObservables.length > 0) {
                  this.wcsPixelCoordSubscription.add( // Add the forkJoin subscription to our manager
                    forkJoin(coordObservables).subscribe({
                      next: (results) => {
                        this.pixelCoordinatesWCS = results.filter(r => r !== null) as { x: number, y: number, id: number, ra: number, dec: number }[];
                      },
                      error: (err) => {
                        console.error("WCS: Critical error in forkJoin for pixel coordinates:", err);
                        this.pixelCoordinatesWCS = []; // Clear on major error
                      }
                    })
                  );
                } else {
                  this.pixelCoordinatesWCS = []; // No observables to process
                }
              }
              // ---- End WCS Pixel Coordinate Calculation ----
            });
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
    const ra0 = convertToDecimal(this.ra);
    if (!ra0 && ra0 !== 0) return -1000;
    const angularWidth = 0.0833;
    const width = this.myDiv.nativeElement.offsetWidth || 0;
    const res = ((ra - ra0) / angularWidth) * width + width / 2;
    return res;
  }

  /**
   * Claude-determined solution with cosine correction
   */
  getDivLeft(ra: number): number {
    const ra0 = convertToDecimal(this.ra);
    if (!ra0 && ra0 !== 0) return -1000;

    const dec0 = convertToDecimal(this.dec);
    if (!dec0 && dec0 !== 0) return -1000;

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
    const dec0 = convertToDecimal(this.dec);
    if (!dec0 && dec0 !== 0) return -1000;
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
