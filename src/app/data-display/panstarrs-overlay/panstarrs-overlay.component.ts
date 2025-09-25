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
  isAtlasOrNeat = false;

  // Properties for WCS-derived pixel coordinates
  pixelCoordinatesWCS: {
    x: number;
    y: number;
    id: number;
    ra: number;
    dec: number;
  }[] = [];
  starDivDiameter = 6;
  crosshairCenterCutoutFraction = 0.15; // Fraction of the line length to cut out from center

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

          const imageUrl = apiSelectedDatum.preview_url;

          if (!imageUrl) return;

          this.imageFetchService
            .fetchImage(imageUrl, {
              isPriority: true,
              label: 'panstarrs-overlay-image',
            })
            .then((objUrl) => {
              this.imageSrc = objUrl || this.placeholderImage;
              // onImageLoad will be called by the <img> tag, which then calls calculateImageRenderDimensions
              this.changeDetector.detectChanges(); // Ensure view updates with new imageSrc
            });

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

              // Only get WCS coords if url includea 'neat' or 'atlas'
              this.isAtlasOrNeat =
                imageUrl.toUpperCase().includes('NEAT') ||
                imageUrl.toUpperCase().includes('ATLAS');

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

              if (this.isAtlasOrNeat && this.raDecs.length > 0) {
                const coordObservables = this.raDecs.map((raDecItem) =>
                  this.imageWcsService
                    .getPixelCoordinatesFromUrl(
                      imageUrl + '&align=true',
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
              } else {
                this.pixelCoordinatesWCS = [];
              }
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

  getDivLeft(ra: number): number {
    const raStar = ra; // ra is already decimal from the input
    const raCenter = convertToDecimal(this.ra);
    const decCenter = convertToDecimal(this.dec);

    if (
      (!raCenter && raCenter !== 0) ||
      (!decCenter && decCenter !== 0) ||
      this.renderedImageWidth <= 0
    ) {
      return -1000; // Off-screen or image not ready
    }

    const angularFovWidth = 0.0833; // 5 arcminutes in degrees
    const cosDecCenter = Math.cos(this.deg2rad(decCenter));

    // Normalized offset from center (-0.5 to 0.5 across the FOV)
    const normXOffset = ((raStar - raCenter) * cosDecCenter) / angularFovWidth;

    // Pixel position on the scaled image, from its left edge
    // (normXOffset + 0.5) maps -0.5 to +0.5 range to 0 to 1 range (left to right)
    const pixelXOnImage = (normXOffset + 0.5) * this.renderedImageWidth;

    return this.imageOffsetX + pixelXOnImage;
  }

  getDivTop(dec: number): number {
    const decStar = dec; // dec is already decimal
    const decCenter = convertToDecimal(this.dec);

    if ((!decCenter && decCenter !== 0) || this.renderedImageHeight <= 0) {
      return -1000; // Off-screen or image not ready
    }

    const angularFovWidth = 0.0833; // 5 arcminutes in degrees

    // Normalized offset from center (-0.5 to 0.5 across the FOV)
    const normYOffset = (decStar - decCenter) / angularFovWidth;

    // Pixel position on the scaled image, from its top edge
    // (0.5 - normYOffset) maps -0.5 (bottom) to +0.5 (top) FOV range to 0 (top) to 1 (bottom) screen range
    const pixelYOnImage = (0.5 - normYOffset) * this.renderedImageHeight;

    return this.imageOffsetY + pixelYOnImage;
  }

  getDivWidth(raErr: number): number {
    const decCenter = convertToDecimal(this.dec);
    if ((!decCenter && decCenter !== 0) || this.renderedImageWidth <= 0) {
      return 2; // Minimum visible size or image not ready
    }

    const angularFovWidth = 0.0833; // 5 arcminutes in degrees
    const cosDecCenter = Math.cos(this.deg2rad(decCenter));

    const correctedRaErrAngular = raErr * cosDecCenter; // raErr is an angular size
    const pixelWidth =
      (correctedRaErrAngular / angularFovWidth) * this.renderedImageWidth;

    return Math.max(2, pixelWidth); // Ensure a minimum visible size
  }

  getDivHeight(decErr: number): number {
    if (this.renderedImageHeight <= 0) {
      return 2; // Minimum visible size or image not ready
    }
    const angularFovWidth = 0.0833; // 5 arcminutes in degrees
    const pixelHeight = (decErr / angularFovWidth) * this.renderedImageHeight; // decErr is an angular size

    return Math.max(2, pixelHeight); // Ensure a minimum visible size
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

  //
  surveyScaleTransform() {
    if (!this.apiSelectedDatum) return 'scale(1, 1)';
    const source = this.apiSelectedDatum.source.toLowerCase();
    // if (source.includes('neat')) return 'scale(1, 1)';
    // if (source.includes('atlas')) return 'scale(1, 1)';
    if (source.includes('loneos')) return 'scale(1, 1)';
    if (source.includes('skymapper')) return 'scale(-1, 1)';
    if (source.includes('spacewatch')) return 'scale(-1, 1)';
    if (source.includes('catalina')) return 'scale(-1, 1)';
    if (source.includes('ps1dr2')) return 'scale(-1, 1)';
    return 'scale(1, 1)';
  }
}
