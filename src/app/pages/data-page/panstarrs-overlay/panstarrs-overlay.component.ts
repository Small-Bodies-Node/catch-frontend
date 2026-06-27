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
import { combineLatest, Subscription, map, catchError, of, forkJoin } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { IAppState } from '../../../ngrx/reducers';
import {
  selectApiActiveDatum,
  selectApiDataAstrometryCentralizationState,
  selectApiDataCentroidizationState,
  selectApiDataStatus,
  selectApiDataTargetPhotometryRunsState,
} from '../../../ngrx/selectors/api-data.selectors';
import { IApiMovum } from '../../../../models/IApiMovum';
import { PanstarrsApiService } from '../../../core/services/panstarrs-api/panstarrs-api';
import { IApiFixum } from '../../../../models/IApiFixum';
import { IAstrometryCentralization } from '../../../../models/IAstrometryRun';
import { ICentroidization } from '../../../../models/ICentroid';
import {
  ITargetPhotometryApertureParams,
  ITargetPhotometryRun,
} from '../../../../models/ITargetPhotometry';
import { convertToDecimal } from '../../../../utils/convertToDecimal';
import { distToPanstarrsCenter } from '../../../../utils/distToPanstarrsCenter';
import { ImageWcsService } from '../../../core/services/image-wcs/image-wcs.service';
import { ImageFetchService } from '../../../core/services/fetch-image/fetch-image.service';
import { getOverlaySurveyScaleTransform } from '../../../../utils/image-orientation';
import {
  DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
  type ICrudeOverlayAngularFov,
  getAspectAwareCrudeOverlayAngularFov,
} from '../../../../utils/crudeOverlayFov';
import {
  calculateImageRenderState,
  createDefaultImageRenderState,
  getApertureDiameter,
  getApertureOverlayCenter,
  getCentroidAstrometryAnchorX,
  getCentroidAstrometryAnchorY,
  getCentroidOverlayDelta,
  getCrudeOverlayBaseAngularFovDeg,
  getCrudeOverlayHeight,
  getCrudeOverlayLeft,
  getCrudeOverlayTop,
  getCrudeOverlayWidth,
  getOverlayOpacity,
  getWcsOverlayLeft,
  getWcsOverlayTop,
  isFiniteNumber,
} from './domain/panstarrs-overlay-geometry';
import {
  ICrudeOverlayProjectionInput,
  IImageRenderState,
  IOverlayActiveContext,
  IPanstarrsRaDec,
  IWcsCentralizationShift,
  IWcsPixelCoordinate,
  TPanstarrsStatusVariant,
} from './domain/panstarrs-overlay.types';

@Component({
  selector: 'app-panstarrs-overlay',
  templateUrl: './panstarrs-overlay.component.html',
  styleUrls: ['./panstarrs-overlay.component.scss'],
  standalone: true,
})
export class PanstarrsOverlayComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('myContainer') myDiv!: ElementRef;
  @ViewChild('overlayImage') overlayImageRef!: ElementRef<HTMLImageElement>;

  imageSrc?: string;
  readonly placeholderImage: string = 'assets/images/placeholder.png';

  apiActiveDatum?: IApiMovum | IApiFixum;
  activeAstrometryCentralization?: IAstrometryCentralization;
  activeCentroidization?: ICentroidization;
  activeTargetPhotometryRun?: ITargetPhotometryRun;
  wcsCentralizationShift?: IWcsCentralizationShift;
  ra: number | string = 0;
  dec: number | string = 0;
  subscriptions = new Subscription();
  raDecs: IPanstarrsRaDec[] = [];
  isPanstarrsDataFound = false;
  isAtlasOrNeat = false;
  panstarrsStatusMessage = '';
  panstarrsStatusVariant: TPanstarrsStatusVariant = null;

  // Properties for WCS-derived pixel coordinates
  pixelCoordinatesWCS: IWcsPixelCoordinate[] = [];
  starDivDiameter = 6;
  crosshairCenterCutoutFraction = 0.15; // Fraction of the line length to cut out from center
  private readonly centroidCrosshairCenterGapPx = 15;

  // ---- Image rendering properties ----
  nativeImageWidth = 1; // Default to 1 to prevent division by zero initially
  nativeImageHeight = 1; // Default to 1
  renderedImageWidth = 0;
  renderedImageHeight = 0;
  containerWidth = 0;
  containerHeight = 0;
  imageOffsetX = 0;
  imageOffsetY = 0;
  imageScaleX = 1;
  imageScaleY = 1;
  private crudeOverlayAngularFov: ICrudeOverlayAngularFov = {
    widthDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
    heightDeg: DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG,
  };
  // ---- End Image rendering properties ----

  private panstarrsDataSubscription = new Subscription();
  private wcsPixelCoordSubscription = new Subscription();
  private wcsCentralizationShiftSubscription = new Subscription();
  private resizeObserver!: ResizeObserver;
  private selectionVersion = 0;
  private activeImageUrl = '';
  private crudeOverlayBaseAngularFovDeg = DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG;
  private isPanstarrsLoading = false;
  private loadingIndicatorTimeoutId?: ReturnType<typeof setTimeout>;
  private panstarrsLoadingStartedAt?: number;
  private readonly minLoadingIndicatorMs = 250;
  private readonly postLoadIndicatorMs = 1000;
  private readonly isFiniteNumber = isFiniteNumber;
  private suppressInitialStatusChip = true;

  constructor(
    private store$: Store<IAppState>,
    private pansstarrsApiService: PanstarrsApiService,
    private imageWcsService: ImageWcsService,
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiActiveDatum),
        this.store$.select(selectApiDataStatus),
      ])
        .pipe(
          map(([apiActiveDatum, apiDataStatus]) => {
            if (!apiActiveDatum || !apiDataStatus?.search) return null;

            const imageUrl = apiActiveDatum.preview_url;
            if (!imageUrl) return null;

            return {
              apiActiveDatum,
              imageUrl,
              ra:
                'ra' in apiActiveDatum
                  ? apiActiveDatum.ra
                  : 'ra' in apiDataStatus.search.searchParams
                    ? apiDataStatus.search.searchParams.ra
                    : 0,
              dec:
                'dec' in apiActiveDatum
                  ? apiActiveDatum.dec
                  : 'dec' in apiDataStatus.search.searchParams
                    ? apiDataStatus.search.searchParams.dec
                    : 0,
            } satisfies IOverlayActiveContext;
          }),
          distinctUntilChanged((prev, curr) => this.isSameActiveContext(prev, curr)),
        )
        .subscribe((activeContext) => {
          if (!activeContext) {
            this.resetOverlayState();
            return;
          }

          this.loadActiveContext(activeContext);
        }),
    );

    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiActiveDatum),
        this.store$.select(selectApiDataAstrometryCentralizationState),
        this.store$.select(selectApiDataCentroidizationState),
        this.store$.select(selectApiDataTargetPhotometryRunsState),
      ])
        .pipe(
          map(
            ([
              apiActiveDatum,
              astrometryCentralizationState,
              centroidizationState,
              targetPhotometryRunsState,
            ]) => {
              const centralization = apiActiveDatum
                ? astrometryCentralizationState[apiActiveDatum.product_id]
                : undefined;
              const centroidization =
                apiActiveDatum &&
                centralization &&
                centroidizationState[apiActiveDatum.product_id]?.astrometryRunId ===
                  centralization.runId
                  ? centroidizationState[apiActiveDatum.product_id]
                  : undefined;
              const targetPhotometryRun =
                apiActiveDatum && centroidization
                  ? this.getLatestTargetPhotometryRun(
                      targetPhotometryRunsState[apiActiveDatum.product_id]?.[
                        centroidization.astrometryRunId
                      ]?.[centroidization.centroidRunId],
                    )
                  : undefined;

              return { centralization, centroidization, targetPhotometryRun };
            },
          ),
          distinctUntilChanged(
            (previous, current) =>
              this.isSameAstrometryCentralization(
                previous.centralization,
                current.centralization,
              ) &&
              this.isSameCentroidization(previous.centroidization, current.centroidization) &&
              this.isSameTargetPhotometryRun(
                previous.targetPhotometryRun,
                current.targetPhotometryRun,
              ),
          ),
        )
        .subscribe(({ centralization, centroidization, targetPhotometryRun }) => {
          this.activeAstrometryCentralization = centralization;
          this.activeCentroidization = centroidization;
          this.activeTargetPhotometryRun = targetPhotometryRun;
          this.updateWcsCentralizationShift();
          this.changeDetector.markForCheck();
        }),
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
        'PanstarrsOverlayComponent: myDiv not available in ngAfterViewInit for ResizeObserver.',
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.panstarrsDataSubscription.unsubscribe();
    this.wcsPixelCoordSubscription.unsubscribe();
    this.wcsCentralizationShiftSubscription.unsubscribe();
    this.clearLoadingIndicatorTimeout();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect(); // Disconnect observer to prevent memory leaks
    }
  }

  private loadActiveContext(activeContext: IOverlayActiveContext): void {
    const selectionVersion = ++this.selectionVersion;
    const showStatusChip = !this.suppressInitialStatusChip;
    this.suppressInitialStatusChip = false;

    this.cancelInFlightRequests();

    this.apiActiveDatum = activeContext.apiActiveDatum;
    this.ra = activeContext.ra;
    this.dec = activeContext.dec;
    this.activeImageUrl = activeContext.imageUrl;
    this.crudeOverlayBaseAngularFovDeg = getCrudeOverlayBaseAngularFovDeg(activeContext.imageUrl);
    this.imageSrc = activeContext.imageUrl || this.placeholderImage;
    this.raDecs = [];
    this.pixelCoordinatesWCS = [];
    this.wcsCentralizationShift = undefined;
    this.isPanstarrsDataFound = false;
    this.resetRenderedImageState();
    if (showStatusChip) {
      this.beginPanstarrsLoading();
    } else {
      this.clearPanstarrsStatus();
    }
    this.isAtlasOrNeat =
      activeContext.imageUrl.toUpperCase().includes('NEAT') ||
      activeContext.imageUrl.toUpperCase().includes('ATLAS');
    this.updateWcsCentralizationShift(selectionVersion);

    this.imageFetchService
      .fetchImage(activeContext.imageUrl, {
        isPriority: true,
        label: 'panstarrs-overlay-image',
      })
      .then((objUrl) => {
        if (!this.isCurrentSelection(selectionVersion)) return;

        this.imageSrc = objUrl || this.placeholderImage;
        // onImageLoad will be called by the <img> tag, which then calls calculateImageRenderDimensions
        this.changeDetector.detectChanges(); // Ensure view updates with new imageSrc
      });

    this.panstarrsDataSubscription = this.pansstarrsApiService
      .getPanstarrsData(activeContext.ra, activeContext.dec, 50, 0.03)
      .subscribe({
        next: (apiPayload) => {
          if (!this.isCurrentSelection(selectionVersion)) return;

          const data = apiPayload.data
            .sort(
              (a, b) =>
                distToPanstarrsCenter(a, activeContext.ra, activeContext.dec) -
                distToPanstarrsCenter(b, activeContext.ra, activeContext.dec),
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
          if (showStatusChip) {
            this.completePanstarrsLoading(data.length > 0, selectionVersion);
          } else {
            this.clearPanstarrsStatus();
          }

          this.updateWcsPixelCoordinates(activeContext.imageUrl, selectionVersion);
        },
        error: () => {
          if (!this.isCurrentSelection(selectionVersion)) return;

          this.isPanstarrsDataFound = false;
          this.raDecs = [];
          this.pixelCoordinatesWCS = [];
          if (showStatusChip) {
            this.finishPanstarrsLoading(selectionVersion, 'error', 'Pan-STARRS unavailable');
          } else {
            this.clearPanstarrsStatus();
          }
        },
      });
  }

  private updateWcsPixelCoordinates(imageUrl: string, selectionVersion: number): void {
    this.wcsPixelCoordSubscription.unsubscribe();
    this.wcsPixelCoordSubscription = new Subscription();

    if (!this.isAtlasOrNeat || this.raDecs.length === 0) {
      this.pixelCoordinatesWCS = [];
      return;
    }

    const coordObservables = this.raDecs.map((raDecItem) =>
      this.imageWcsService
        .getPixelCoordinatesFromUrl(imageUrl + '&align=true', raDecItem.ra, raDecItem.dec)
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
              `WCS: Failed to get pixel coords for RA:${raDecItem.ra}, Dec:${raDecItem.dec}. Error: ${
                error.message || error
              }`,
            );
            return of(null); // Return null for this item on error, will be filtered later
          }),
        ),
    );

    if (coordObservables.length === 0) {
      this.pixelCoordinatesWCS = [];
      return;
    }

    this.wcsPixelCoordSubscription = forkJoin(coordObservables).subscribe({
      next: (results) => {
        if (!this.isCurrentSelection(selectionVersion)) return;

        this.pixelCoordinatesWCS = results.filter((r) => r !== null) as IWcsPixelCoordinate[];
      },
      error: (err) => {
        if (!this.isCurrentSelection(selectionVersion)) return;

        console.error('WCS: Critical error in forkJoin for pixel coordinates:', err);
        this.pixelCoordinatesWCS = []; // Clear on major error
      },
    });
  }

  private updateWcsCentralizationShift(selectionVersion = this.selectionVersion): void {
    this.wcsCentralizationShiftSubscription.unsubscribe();
    this.wcsCentralizationShiftSubscription = new Subscription();
    this.wcsCentralizationShift = undefined;

    const centralization = this.activeAstrometryCentralization;
    const originalRa = convertToDecimal(this.ra);
    const originalDec = convertToDecimal(this.dec);

    if (
      !centralization ||
      centralization.productId !== this.apiActiveDatum?.product_id ||
      !this.isAtlasOrNeat ||
      !this.activeImageUrl ||
      !this.isFiniteNumber(originalRa) ||
      !this.isFiniteNumber(originalDec) ||
      !this.isFiniteNumber(centralization.centerRaDeg) ||
      !this.isFiniteNumber(centralization.centerDecDeg)
    ) {
      return;
    }

    const imageUrl = this.activeImageUrl + '&align=true';

    this.wcsCentralizationShiftSubscription = forkJoin({
      originalCenter: this.imageWcsService.getPixelCoordinatesFromUrl(
        imageUrl,
        originalRa,
        originalDec,
      ),
      correctedCenter: this.imageWcsService.getPixelCoordinatesFromUrl(
        imageUrl,
        centralization.centerRaDeg,
        centralization.centerDecDeg,
      ),
    })
      .pipe(
        catchError((error) => {
          console.warn(
            `WCS: Failed to derive centralization shift. Error: ${error.message || error}`,
          );
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (
          !result ||
          !this.isCurrentSelection(selectionVersion) ||
          !this.isSameAstrometryCentralization(centralization, this.activeAstrometryCentralization)
        ) {
          return;
        }

        const [originalCenterX, originalCenterY] = result.originalCenter;
        const [correctedCenterX, correctedCenterY] = result.correctedCenter;

        this.wcsCentralizationShift = {
          dx: originalCenterX - correctedCenterX,
          dy: originalCenterY - correctedCenterY,
          productId: centralization.productId,
          runId: centralization.runId,
        };
        this.changeDetector.detectChanges();
      });
  }

  private cancelInFlightRequests(): void {
    this.panstarrsDataSubscription.unsubscribe();
    this.panstarrsDataSubscription = new Subscription();

    this.wcsPixelCoordSubscription.unsubscribe();
    this.wcsPixelCoordSubscription = new Subscription();

    this.wcsCentralizationShiftSubscription.unsubscribe();
    this.wcsCentralizationShiftSubscription = new Subscription();
  }

  private resetOverlayState(): void {
    this.selectionVersion++;
    this.cancelInFlightRequests();
    this.apiActiveDatum = undefined;
    this.activeAstrometryCentralization = undefined;
    this.activeCentroidization = undefined;
    this.activeTargetPhotometryRun = undefined;
    this.wcsCentralizationShift = undefined;
    this.imageSrc = undefined;
    this.activeImageUrl = '';
    this.crudeOverlayBaseAngularFovDeg = DEFAULT_CRUDE_OVERLAY_ANGULAR_FOV_DEG;
    this.ra = 0;
    this.dec = 0;
    this.raDecs = [];
    this.pixelCoordinatesWCS = [];
    this.isPanstarrsDataFound = false;
    this.isAtlasOrNeat = false;
    this.resetRenderedImageState();
    this.clearPanstarrsStatus();
  }

  private isSameAstrometryCentralization(
    previous: IAstrometryCentralization | undefined,
    current: IAstrometryCentralization | undefined,
  ): boolean {
    if (!previous || !current) return previous === current;

    return (
      previous.productId === current.productId &&
      previous.runId === current.runId &&
      previous.centerRaDeg === current.centerRaDeg &&
      previous.centerDecDeg === current.centerDecDeg
    );
  }

  private isSameCentroidization(
    previous: ICentroidization | undefined,
    current: ICentroidization | undefined,
  ): boolean {
    if (!previous || !current) return previous === current;

    return (
      previous.productId === current.productId &&
      previous.astrometryRunId === current.astrometryRunId &&
      previous.centroidRunId === current.centroidRunId &&
      previous.initX === current.initX &&
      previous.initY === current.initY &&
      previous.astrometryCenterX === current.astrometryCenterX &&
      previous.astrometryCenterY === current.astrometryCenterY &&
      previous.centX === current.centX &&
      previous.centY === current.centY
    );
  }

  private isSameTargetPhotometryRun(
    previous: ITargetPhotometryRun | undefined,
    current: ITargetPhotometryRun | undefined,
  ): boolean {
    if (!previous || !current) return previous === current;

    return (
      previous.id === current.id &&
      previous.status === current.status &&
      previous.completedAt === current.completedAt &&
      previous.inputs.target_aperture_params.size === current.inputs.target_aperture_params.size &&
      previous.inputs.background_aperture_params.inner_r ===
        current.inputs.background_aperture_params.inner_r &&
      previous.inputs.background_aperture_params.outer_r ===
        current.inputs.background_aperture_params.outer_r
    );
  }

  private getLatestTargetPhotometryRun(
    runs: ITargetPhotometryRun[] | undefined,
  ): ITargetPhotometryRun | undefined {
    if (!runs?.length) {
      return undefined;
    }

    return runs[runs.length - 1];
  }

  private isCurrentSelection(selectionVersion: number): boolean {
    return selectionVersion === this.selectionVersion;
  }

  private isSameActiveContext(
    previous: IOverlayActiveContext | null,
    current: IOverlayActiveContext | null,
  ): boolean {
    if (!previous || !current) return previous === current;

    return (
      previous.imageUrl === current.imageUrl &&
      previous.ra === current.ra &&
      previous.dec === current.dec
    );
  }

  private resetRenderedImageState(): void {
    this.applyImageRenderState(createDefaultImageRenderState());
    this.updateCrudeOverlayAngularFov();
  }

  private beginPanstarrsLoading(): void {
    this.clearLoadingIndicatorTimeout();
    this.isPanstarrsLoading = true;
    this.panstarrsLoadingStartedAt = Date.now();
    this.panstarrsStatusVariant = 'loading';
    this.panstarrsStatusMessage = 'PanSTARRS';
    this.changeDetector.detectChanges();
  }

  private completePanstarrsLoading(hasData: boolean, selectionVersion: number): void {
    if (hasData) {
      this.finishPanstarrsLoading(selectionVersion, null, '');
      return;
    }

    this.finishPanstarrsLoading(selectionVersion, 'empty', 'No Pan-STARRS matches');
  }

  private finishPanstarrsLoading(
    selectionVersion: number,
    variant: TPanstarrsStatusVariant,
    message: string,
  ): void {
    const elapsedMs = this.panstarrsLoadingStartedAt
      ? Date.now() - this.panstarrsLoadingStartedAt
      : this.minLoadingIndicatorMs;
    const remainingMs =
      Math.max(0, this.minLoadingIndicatorMs - elapsedMs) + this.postLoadIndicatorMs;

    const applyStatus = () => {
      if (!this.isCurrentSelection(selectionVersion)) return;

      this.isPanstarrsLoading = false;
      this.panstarrsLoadingStartedAt = undefined;
      this.panstarrsStatusVariant = variant;
      this.panstarrsStatusMessage = message;
      this.loadingIndicatorTimeoutId = undefined;
      this.changeDetector.detectChanges();
    };

    this.clearLoadingIndicatorTimeout();

    if (remainingMs === 0) {
      applyStatus();
      return;
    }

    this.loadingIndicatorTimeoutId = setTimeout(applyStatus, remainingMs);
  }

  private clearPanstarrsStatus(): void {
    this.clearLoadingIndicatorTimeout();
    this.isPanstarrsLoading = false;
    this.panstarrsLoadingStartedAt = undefined;
    this.panstarrsStatusVariant = null;
    this.panstarrsStatusMessage = '';
  }

  private clearLoadingIndicatorTimeout(): void {
    if (!this.loadingIndicatorTimeoutId) return;
    clearTimeout(this.loadingIndicatorTimeoutId);
    this.loadingIndicatorTimeoutId = undefined;
  }

  // Method called when the image has loaded
  onImageLoad(): void {
    if (this.overlayImageRef && this.overlayImageRef.nativeElement) {
      this.nativeImageWidth = this.overlayImageRef.nativeElement.naturalWidth || 1;
      this.nativeImageHeight = this.overlayImageRef.nativeElement.naturalHeight || 1;
      this.updateCrudeOverlayAngularFov();
      this.calculateImageRenderDimensions();
      this.changeDetector.detectChanges(); // Trigger change detection after image load
    } else {
      console.warn('PanstarrsOverlayComponent: overlayImageRef not available in onImageLoad.');
      // Fallback if image ref is not yet available (should not happen with proper HTML binding)
      this.nativeImageWidth = 1;
      this.nativeImageHeight = 1;
      this.updateCrudeOverlayAngularFov();
      this.calculateImageRenderDimensions();
      this.changeDetector.detectChanges();
    }
  }

  private getImageRenderState(): IImageRenderState {
    return {
      nativeImageWidth: this.nativeImageWidth,
      nativeImageHeight: this.nativeImageHeight,
      renderedImageWidth: this.renderedImageWidth,
      renderedImageHeight: this.renderedImageHeight,
      containerWidth: this.containerWidth,
      containerHeight: this.containerHeight,
      imageOffsetX: this.imageOffsetX,
      imageOffsetY: this.imageOffsetY,
      imageScaleX: this.imageScaleX,
      imageScaleY: this.imageScaleY,
    };
  }

  private getCrudeProjectionInput(): ICrudeOverlayProjectionInput {
    return {
      renderedImageWidth: this.renderedImageWidth,
      renderedImageHeight: this.renderedImageHeight,
      imageOffsetX: this.imageOffsetX,
      imageOffsetY: this.imageOffsetY,
      angularFovWidthDeg: this.crudeOverlayAngularFov.widthDeg,
      angularFovHeightDeg: this.crudeOverlayAngularFov.heightDeg,
      displayRa: this.getDisplayRa(),
      displayDec: this.getDisplayDec(),
    };
  }

  getDivLeft(ra: number): number {
    return getCrudeOverlayLeft(ra, this.getCrudeProjectionInput());
  }

  getDivTop(dec: number): number {
    return getCrudeOverlayTop(dec, this.getCrudeProjectionInput());
  }

  getDivWidth(raErr: number): number {
    return getCrudeOverlayWidth(raErr, this.getCrudeProjectionInput());
  }

  getDivHeight(decErr: number): number {
    return getCrudeOverlayHeight(decErr, this.getCrudeProjectionInput());
  }

  getOpacity(raErr: number) {
    return getOverlayOpacity(raErr);
  }

  getWcsDivLeft(coord: { x: number; ra: number }): number {
    return getWcsOverlayLeft(
      coord,
      this.getImageRenderState(),
      this.starDivDiameter,
      this.wcsCentralizationShift,
    );
  }

  getWcsDivTop(coord: { y: number; dec: number }): number {
    return getWcsOverlayTop(
      coord,
      this.getImageRenderState(),
      this.starDivDiameter,
      this.wcsCentralizationShift,
    );
  }

  getCrosshairCenterX(): number {
    const imageCenterX = this.imageOffsetX + this.renderedImageWidth / 2;

    if (!this.activeAstrometryCentralization) {
      return imageCenterX;
    }

    if (this.isAtlasOrNeat) {
      return imageCenterX + (this.wcsCentralizationShift?.dx ?? 0) * this.imageScaleX;
    }

    const originalRa = convertToDecimal(this.ra);
    if (!this.isFiniteNumber(originalRa)) {
      return imageCenterX;
    }

    return this.getDivLeft(originalRa);
  }

  getCrosshairCenterY(): number {
    const imageCenterY = this.imageOffsetY + this.renderedImageHeight / 2;

    if (!this.activeAstrometryCentralization) {
      return imageCenterY;
    }

    if (this.isAtlasOrNeat) {
      return imageCenterY + (this.wcsCentralizationShift?.dy ?? 0) * this.imageScaleY;
    }

    const originalDec = convertToDecimal(this.dec);
    if (!this.isFiniteNumber(originalDec)) {
      return imageCenterY;
    }

    return this.getDivTop(originalDec);
  }

  getCrosshairTopSegmentHeight(): number {
    return Math.max(0, this.getCrosshairCenterY() - this.getCrosshairVerticalCutoutPx());
  }

  getCrosshairBottomSegmentTop(): number {
    return this.getCrosshairCenterY() + this.getCrosshairVerticalCutoutPx();
  }

  getCrosshairBottomSegmentHeight(): number {
    return Math.max(0, this.containerHeight - this.getCrosshairBottomSegmentTop());
  }

  getCrosshairLeftSegmentWidth(): number {
    return Math.max(0, this.getCrosshairCenterX() - this.getCrosshairHorizontalCutoutPx());
  }

  getCrosshairRightSegmentLeft(): number {
    return this.getCrosshairCenterX() + this.getCrosshairHorizontalCutoutPx();
  }

  getCrosshairRightSegmentWidth(): number {
    return Math.max(0, this.containerWidth - this.getCrosshairRightSegmentLeft());
  }

  getCentroidCrosshairCenterX(): number {
    const baseX = this.getCrosshairCenterX();
    const centroidization = this.activeCentroidization;
    if (!centroidization) {
      return baseX;
    }

    return baseX + this.getCentroidOverlayDelta(centroidization).x * this.imageScaleX;
  }

  getCentroidCrosshairCenterY(): number {
    const baseY = this.getCrosshairCenterY();
    const centroidization = this.activeCentroidization;
    if (!centroidization) {
      return baseY;
    }

    return baseY + this.getCentroidOverlayDelta(centroidization).y * this.imageScaleY;
  }

  getCentroidCrosshairTopSegmentTop(): number {
    if (!this.activeCentroidization) {
      return this.getCrosshairCenterY() - this.getCentroidCrosshairCutoutPx();
    }

    return 0;
  }

  getCentroidCrosshairTopSegmentHeight(): number {
    if (!this.activeCentroidization) {
      return 0;
    }

    return Math.max(0, this.getCentroidCrosshairCenterY() - this.getCentroidCrosshairCutoutPx());
  }

  getCentroidCrosshairBottomSegmentTop(): number {
    const centerY = this.activeCentroidization
      ? this.getCentroidCrosshairCenterY()
      : this.getCrosshairCenterY();

    return centerY + this.getCentroidCrosshairCutoutPx();
  }

  getCentroidCrosshairBottomSegmentHeight(): number {
    if (!this.activeCentroidization) {
      return 0;
    }

    return Math.max(0, this.containerHeight - this.getCentroidCrosshairBottomSegmentTop());
  }

  getCentroidCrosshairLeftSegmentLeft(): number {
    if (!this.activeCentroidization) {
      return this.getCrosshairCenterX() - this.getCentroidCrosshairCutoutPx();
    }

    return 0;
  }

  getCentroidCrosshairLeftSegmentWidth(): number {
    if (!this.activeCentroidization) {
      return 0;
    }

    return Math.max(0, this.getCentroidCrosshairCenterX() - this.getCentroidCrosshairCutoutPx());
  }

  getCentroidCrosshairRightSegmentLeft(): number {
    const centerX = this.activeCentroidization
      ? this.getCentroidCrosshairCenterX()
      : this.getCrosshairCenterX();

    return centerX + this.getCentroidCrosshairCutoutPx();
  }

  getCentroidCrosshairRightSegmentWidth(): number {
    if (!this.activeCentroidization) {
      return 0;
    }

    return Math.max(0, this.containerWidth - this.getCentroidCrosshairRightSegmentLeft());
  }

  getTargetPhotometryApertureCenterX(): number {
    return this.getApertureOverlayCenter().x;
  }

  getTargetPhotometryApertureCenterY(): number {
    return this.getApertureOverlayCenter().y;
  }

  getTargetPhotometryApertureDiameter(): number {
    return this.getApertureDiameter(this.activeTargetPhotometryRun?.inputs.target_aperture_params);
  }

  getTargetPhotometryBackgroundInnerDiameter(): number {
    return this.getApertureDiameter(
      this.activeTargetPhotometryRun?.inputs.background_aperture_params,
      'inner_r',
    );
  }

  getTargetPhotometryBackgroundOuterDiameter(): number {
    return this.getApertureDiameter(
      this.activeTargetPhotometryRun?.inputs.background_aperture_params,
      'outer_r',
    );
  }

  private getCrosshairVerticalCutoutPx(): number {
    return (this.containerHeight * this.crosshairCenterCutoutFraction) / 2;
  }

  private getCrosshairHorizontalCutoutPx(): number {
    return (this.containerWidth * this.crosshairCenterCutoutFraction) / 2;
  }

  private getCentroidCrosshairCutoutPx(): number {
    return this.centroidCrosshairCenterGapPx / 2;
  }

  private getCentroidAstrometryAnchorX(centroidization: ICentroidization): number {
    return getCentroidAstrometryAnchorX(centroidization);
  }

  private getCentroidAstrometryAnchorY(centroidization: ICentroidization): number {
    return getCentroidAstrometryAnchorY(centroidization);
  }

  private getCentroidOverlayDelta(centroidization: ICentroidization): { x: number; y: number } {
    return getCentroidOverlayDelta(this.apiActiveDatum?.source, centroidization);
  }

  private getApertureOverlayCenter(): { x: number; y: number } {
    return getApertureOverlayCenter({
      source: this.apiActiveDatum?.source,
      baseX: this.getCrosshairCenterX(),
      baseY: this.getCrosshairCenterY(),
      imageScaleX: this.imageScaleX,
      imageScaleY: this.imageScaleY,
      centroidization: this.activeCentroidization,
      aperturePosition: this.activeTargetPhotometryRun?.inputs.target_aperture_params.position,
    });
  }

  private getApertureDiameter(
    aperture: ITargetPhotometryApertureParams | undefined,
    radiusKey: 'size' | 'inner_r' | 'outer_r' = 'size',
  ): number {
    return getApertureDiameter(aperture, this.getImageRenderState(), radiusKey);
  }

  private updateCrudeOverlayAngularFov(): void {
    this.crudeOverlayAngularFov = getAspectAwareCrudeOverlayAngularFov(
      this.nativeImageWidth,
      this.nativeImageHeight,
      this.crudeOverlayBaseAngularFovDeg,
    );
  }

  private getDisplayRa(): number | string {
    return this.activeAstrometryCentralization?.centerRaDeg ?? this.ra;
  }

  private getDisplayDec(): number | string {
    return this.activeAstrometryCentralization?.centerDecDeg ?? this.dec;
  }

  private calculateImageRenderDimensions(): void {
    if (!this.myDiv || !this.myDiv.nativeElement) {
      console.warn('calculateImageRenderDimensions: myDiv ElementRef not ready.');
      return;
    }

    const containerWidth = this.myDiv.nativeElement.offsetWidth;
    const containerHeight = this.myDiv.nativeElement.offsetHeight;

    this.applyImageRenderState(
      calculateImageRenderState({
        nativeImageWidth: this.nativeImageWidth,
        nativeImageHeight: this.nativeImageHeight,
        containerWidth,
        containerHeight,
      }),
    );
  }

  private applyImageRenderState(renderState: IImageRenderState): void {
    this.nativeImageWidth = renderState.nativeImageWidth;
    this.nativeImageHeight = renderState.nativeImageHeight;
    this.renderedImageWidth = renderState.renderedImageWidth;
    this.renderedImageHeight = renderState.renderedImageHeight;
    this.containerWidth = renderState.containerWidth;
    this.containerHeight = renderState.containerHeight;
    this.imageOffsetX = renderState.imageOffsetX;
    this.imageOffsetY = renderState.imageOffsetY;
    this.imageScaleX = renderState.imageScaleX;
    this.imageScaleY = renderState.imageScaleY;
  }

  //
  surveyScaleTransform() {
    return getOverlaySurveyScaleTransform(this.apiActiveDatum?.source);
  }
}
