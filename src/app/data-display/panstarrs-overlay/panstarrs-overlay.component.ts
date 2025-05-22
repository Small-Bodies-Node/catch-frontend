import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  Subscription,
  map,
  catchError,
  of,
  forkJoin,
} from 'rxjs';
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
import { distToPanstarrsCenter } from '../../../utils/distToPanstarrsCenter';
import { ImageWcsService } from '../../core/services/image-wcs/image-wcs.service';
import { ImageFetchService } from '../../core/services/fetch-image/fetch-image.service';

@Component({
  selector: 'app-panstarrs-overlay',
  templateUrl: './panstarrs-overlay.component.html',
  styleUrls: ['./panstarrs-overlay.component.scss'],
  standalone: false,
})
export class PanstarrsOverlayComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('myContainer') myDiv!: ElementRef;
  @ViewChild('overlayImage') overlayImageRef!: ElementRef<HTMLImageElement>;

  imageSrc?: string;
  readonly placeholderImage: string = 'assets/images/placeholder.png';

  apiSelectedDatum?: IApiMovum | IApiFixum;
  ra: number | string = 0;
  dec: number | string = 0;
  subscriptions = new Subscription();
  raDecs: {
    id: number;
    ra: number;
    dec: number;
    raErr: number;
    decErr: number;
    rMeanPSFMag: number;
  }[] = [];
  isPanstarrsDataFound = false;

  // Properties for WCS-derived pixel coordinates
  pixelCoordinatesWCS: {
    x: number;
    y: number;
    id: number;
    ra: number;
    dec: number;
  }[] = [];
  wcsDivWidth = 6;
  wcsDivHeight = 6;

  // ---- Image rendering properties ----
  nativeImageWidth = 1; // Default to 1 to prevent division by zero initially
  nativeImageHeight = 1; // Default to 1
  renderedImageWidth = 0;
  renderedImageHeight = 0;
  imageOffsetX = 0;
  imageOffsetY = 0;
  imageScaleX = 1;
  imageScaleY = 1;
  // ---- End Image rendering properties ----

  private wcsPixelCoordSubscription: Subscription = new Subscription(); // For managing WCS calculation subscription
  private resizeObserver!: ResizeObserver;

  constructor(
    private store$: Store<IAppState>,
    private pansstarrsApiService: PanstarrsApiService,
    private imageWcsService: ImageWcsService,
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef
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

          if (apiSelectedDatum.preview_url) {
            console.log(
              'PanstarrsOverlayComponent: preview_url: ',
              apiSelectedDatum.preview_url
            );
            this.imageFetchService
              .fetchImage(apiSelectedDatum.preview_url, {
                isPriority: true,
                label: 'panstarrs-overlay-image',
              })
              .then((objUrl) => {
                this.imageSrc = objUrl || this.placeholderImage;
                // onImageLoad will be called by the <img> tag, which then calls calculateImageRenderDimensions
                this.changeDetector.detectChanges(); // Ensure view updates with new imageSrc
              });
          }

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
                const coordObservables = this.raDecs.map((raDecItem) =>
                  this.imageWcsService
                    .getPixelCoordinatesFromUrl(
                      url + '&align=true',
                      raDecItem.ra,
                      raDecItem.dec
                    )
                    .pipe(
                      map(([x, y]) => ({
                        x,
                        y,
                        id: raDecItem.id,
                        ra: raDecItem.ra,
                        dec: raDecItem.dec,
                      })),
                      catchError((error) => {
                        console.warn(
                          `WCS: Failed to get pixel coords for RA:${
                            raDecItem.ra
                          }, Dec:${raDecItem.dec}. Error: ${
                            error.message || error
                          }`
                        );
                        return of(null); // Return null for this item on error, will be filtered later
                      })
                    )
                );

                if (coordObservables.length > 0) {
                  this.wcsPixelCoordSubscription.add(
                    // Add the forkJoin subscription to our manager
                    forkJoin(coordObservables).subscribe({
                      next: (results) => {
                        this.pixelCoordinatesWCS = results.filter(
                          (r) => r !== null
                        ) as {
                          x: number;
                          y: number;
                          id: number;
                          ra: number;
                          dec: number;
                        }[];
                      },
                      error: (err) => {
                        console.error(
                          'WCS: Critical error in forkJoin for pixel coordinates:',
                          err
                        );
                        this.pixelCoordinatesWCS = []; // Clear on major error
                      },
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

  ngOnInit(): void {
    // Instantiate ResizeObserver here
    this.resizeObserver = new ResizeObserver(() => {
      if (
        this.myDiv &&
        this.myDiv.nativeElement &&
        this.nativeImageWidth > 0 &&
        this.nativeImageHeight > 0
      ) {
        // Check > 0
        this.calculateImageRenderDimensions();
        this.changeDetector.detectChanges(); // Trigger change detection after resize
      }
    });
    // DO NOT call .observe() here
  }

  ngAfterViewInit(): void {
    // Start observing after the view is initialized and myDiv is available
    if (this.myDiv && this.myDiv.nativeElement) {
      this.resizeObserver.observe(this.myDiv.nativeElement);
    } else {
      console.warn(
        'PanstarrsOverlayComponent: myDiv not available in ngAfterViewInit for ResizeObserver.'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect(); // Disconnect observer to prevent memory leaks
    }
  }

  // Method called when the image has loaded
  onImageLoad(): void {
    if (this.overlayImageRef && this.overlayImageRef.nativeElement) {
      this.nativeImageWidth =
        this.overlayImageRef.nativeElement.naturalWidth || 1;
      this.nativeImageHeight =
        this.overlayImageRef.nativeElement.naturalHeight || 1;
      this.calculateImageRenderDimensions();
      this.changeDetector.detectChanges(); // Trigger change detection after image load
    } else {
      console.warn(
        'PanstarrsOverlayComponent: overlayImageRef not available in onImageLoad.'
      );
      // Fallback if image ref is not yet available (should not happen with proper HTML binding)
      this.nativeImageWidth = 1;
      this.nativeImageHeight = 1;
      this.calculateImageRenderDimensions();
      this.changeDetector.detectChanges();
    }
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

  private calculateImageRenderDimensions(): void {
    if (!this.myDiv || !this.myDiv.nativeElement) {
      console.warn(
        'calculateImageRenderDimensions: myDiv ElementRef not ready.'
      );
      return;
    }

    const containerWidth = this.myDiv.nativeElement.offsetWidth;
    const containerHeight = this.myDiv.nativeElement.offsetHeight;

    if (containerWidth <= 0 || containerHeight <= 0) {
      // console.warn('calculateImageRenderDimensions: Container has zero or negative dimensions.');
      this.renderedImageWidth = 0;
      this.renderedImageHeight = 0;
      this.imageOffsetX = 0;
      this.imageOffsetY = 0;
      this.imageScaleX = 1;
      this.imageScaleY = 1;
      return;
    }

    if (this.nativeImageWidth <= 0 || this.nativeImageHeight <= 0) {
      // console.warn('calculateImageRenderDimensions: Native image dimensions are zero, negative or not yet loaded.');
      // Default to filling container if native dimensions are broken, though this might distort
      // Or, more safely, render nothing or a placeholder indication
      this.renderedImageWidth = 0; // Or containerWidth if you want to fill
      this.renderedImageHeight = 0; // Or containerHeight
      this.imageOffsetX = 0;
      this.imageOffsetY = 0;
      this.imageScaleX = 1;
      this.imageScaleY = 1;
      return;
    }

    // Calculate dimensions to fit height and maintain aspect ratio
    let newRenderedHeight = containerHeight;
    const imageAspectRatio = this.nativeImageWidth / this.nativeImageHeight;
    let newRenderedWidth = newRenderedHeight * imageAspectRatio;

    // If calculated width is greater than container width, then fit by width instead
    if (newRenderedWidth > containerWidth) {
      newRenderedWidth = containerWidth;
      newRenderedHeight = newRenderedWidth / imageAspectRatio;
    }

    this.renderedImageWidth = newRenderedWidth;
    this.renderedImageHeight = newRenderedHeight;

    // Calculate offsets for centering
    this.imageOffsetX = (containerWidth - this.renderedImageWidth) / 2;
    this.imageOffsetY = (containerHeight - this.renderedImageHeight) / 2; // Center vertically too

    // Calculate scaling factors
    this.imageScaleX = this.renderedImageWidth / this.nativeImageWidth;
    this.imageScaleY = this.renderedImageHeight / this.nativeImageHeight;
  }
}
