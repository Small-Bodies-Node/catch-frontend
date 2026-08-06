import { AsyncPipe } from '@angular/common';
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IAstrometryInputs, IAstrometryRun } from '../../../../models/IAstrometryRun';
import { simpleUid } from '../../../../utils/simpleUid';
import {
  ApiDataAction_ApplyAstrometryCentralization,
  ApiDataAction_ApplyCentroidization,
  ApiDataAction_BeginAstrometryRun,
  ApiDataAction_BeginPhotometricCalibrationRun,
  ApiDataAction_BeginCentroidRun,
  ApiDataAction_BeginTargetPhotometryRun,
  ApiDataAction_RemoveCentroidization,
  ApiDataAction_RemoveAstrometryCentralization,
  ApiDataAction_RemoveSourceMagnitudeCalculation,
  ApiDataAction_SetActiveDatum,
  ApiDataAction_SetSourceMagnitudeCalculation,
} from '../../../ngrx/actions/api-data.actions';
import { IAppState } from '../../../ngrx/reducers';
import {
  selectApiActiveDatum,
  selectApiData,
  selectApiDataAnalysisSelectionState,
  selectApiDataAstrometryCentralizationState,
  selectApiDataAstrometryRunsState,
  selectApiDataPhotometricCalibrationRunsState,
  selectApiDataCentroidRunsState,
  selectApiDataCentroidizationState,
  selectApiDataTargetPhotometryRunsState,
  selectApiDataSourceMagnitudeState,
} from '../../../ngrx/selectors/api-data.selectors';
import { CatToolsStackComponent } from './cat-tools-stack/cat-tools-stack.component';
import { CatFireworkComponent } from './cat-firework/cat-firework.component';
import {
  ICentroidRequest,
  ICentroidResponse,
  ICentroidRun,
  ICentroidization,
} from '../../../../models/ICentroid';
import {
  IPhotometricCalibrationInputs,
  IPhotometricCalibrationResult,
  IPhotometricCalibrationRun,
  TPhotometricCalibrationCatalog,
} from '../../../../models/IPhotometricCalibrationRun';
import { ISourceMagnitudeCalculation } from '../../../../models/ISourceMagnitude';
import {
  ITargetPhotometryRequest,
  ITargetPhotometryResponse,
  ITargetPhotometryRun,
} from '../../../../models/ITargetPhotometry';
import {
  FitsClickCoordinatesService,
  IFitsClickCoordinates,
} from '../fits-click-coordinates.service';
import { getCatShareQueryParams, parseCatShareIntent } from '../../../../utils/catShareLink';
import { toAnalysisItem } from './domain/cat-analysis-items';
import {
  createDefaultAstrometryInputs,
  getAstrometryCentralizationActionLabel,
  getAstrometryInputRows,
  getAstrometryResultGroups,
  getAstrometryRunStatusLabel,
  isAstrometryCentralizationApplied,
  isAstrometryCentralizationAvailable,
} from './domain/cat-astrometry';
import {
  createDefaultPhotometricCalibrationInputs,
  getActivePhotometricCalibrationRun,
  getPhotometricCalibrationInputRows,
  getPhotometricCalibrationPlots,
  getPhotometricCalibrationResultGroups,
  getPhotometricCalibrationRuns,
  getPhotometricCalibrationRunStatusLabel,
  hasRunningPhotometricCalibration,
} from './domain/cat-photometric-calibration';
import { calculateSourceMagnitude as calculateSourceMagnitudeResult } from './domain/cat-source-magnitude';
import {
  getCentroidResultRows,
  getCentroidRunStatusLabel,
  getCentroidRuns,
  getCentroidizationActionLabel,
  isCentroidizationApplied,
  isCentroidizationAvailable,
  roundCentroidRequestPixels,
} from './domain/cat-centroid';
import {
  formatDatumValue,
  getNumberFromDatumOrCutoutUrl,
  isFiniteNumber,
  isOptionalFiniteNumber,
  roundOptionalPixelCoordinate,
  roundPixelCoordinate,
} from './domain/cat-tools-formatters';
import {
  IAnalysisItem,
  IAnalysisSelectionSummary,
  ICatToolsDatumRow,
  ICatToolsDetailView,
  ICatWorkflowDownloadContext,
  ICentroidCoordinatePair,
  ICentroidDraftContext,
  IPhotometricCalibrationDraftContext,
  ITargetPhotometryDraftContext,
} from './domain/cat-tools.types';
import {
  createDefaultTargetPhotometryInputs,
  getTargetPhotometryResultRows,
  getTargetPhotometryRunStatusLabel,
  getTargetPhotometryRuns,
  roundTargetPhotometryRequestPixels,
} from './domain/cat-target-photometry';
import {
  createCatWorkflowExport,
  getCatWorkflowExportFilename,
} from './domain/cat-workflow-export';

@Component({
  selector: 'app-cat-field-info',
  template: `
    <button
      type="button"
      class="cat-tools-field-info"
      [matTooltip]="text"
      matTooltipPosition="above"
      #tooltip="matTooltip"
      [attr.aria-label]="ariaLabel"
      (click)="tooltip.toggle(); $event.preventDefault(); $event.stopPropagation()"
    >
      <mat-icon aria-hidden="true">info</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex: 0 0 auto;
      }

      .cat-tools-field-info {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--mat-sys-primary);
        cursor: help;
      }

      .cat-tools-field-info:hover,
      .cat-tools-field-info:focus-visible {
        background-color: color-mix(in srgb, var(--mat-sys-primary) 10%, transparent);
      }

      .cat-tools-field-info mat-icon {
        width: 16px;
        height: 16px;
        font-size: 16px;
        line-height: 16px;
      }
    `,
  ],
  imports: [MatIcon, MatTooltip],
  standalone: true,
})
export class CatFieldInfoComponent {
  @Input({ required: true }) text = '';
  @Input() label = '';

  get ariaLabel(): string {
    return this.label ? `Show help for ${this.label}` : 'Show field help';
  }
}

@Component({
  selector: 'app-cat-tools',
  templateUrl: './cat-tools.component.html',
  styleUrls: ['./cat-tools.component.scss'],
  imports: [
    AsyncPipe,
    CatFireworkComponent,
    CatToolsStackComponent,
    FormsModule,
    CatFieldInfoComponent,
  ],
  standalone: true,
})
export class CatToolsComponent implements OnDestroy {
  @ViewChild(CatToolsStackComponent)
  private catToolsStack?: CatToolsStackComponent;

  readonly photometricCalibrationCatalogs: readonly TPhotometricCalibrationCatalog[] = [
    'PanSTARRS1',
    'Gaia',
    'SDSS',
  ];
  readonly formatDatumValue = formatDatumValue;
  readonly getAstrometryCentralizationActionLabel = getAstrometryCentralizationActionLabel;
  readonly getAstrometryInputRows = getAstrometryInputRows;
  readonly getAstrometryResultGroups = getAstrometryResultGroups;
  readonly getAstrometryRunStatusLabel = getAstrometryRunStatusLabel;
  readonly getPhotometricCalibrationInputRows = getPhotometricCalibrationInputRows;
  readonly getPhotometricCalibrationPlots = getPhotometricCalibrationPlots;
  readonly getPhotometricCalibrationResultGroups = getPhotometricCalibrationResultGroups;
  readonly getPhotometricCalibrationRunStatusLabel = getPhotometricCalibrationRunStatusLabel;
  readonly getCentroidRunStatusLabel = getCentroidRunStatusLabel;
  readonly getCentroidizationActionLabel = getCentroidizationActionLabel;
  readonly getTargetPhotometryResultRows = getTargetPhotometryResultRows;
  readonly getTargetPhotometryRunStatusLabel = getTargetPhotometryRunStatusLabel;
  readonly isAstrometryCentralizationApplied = isAstrometryCentralizationApplied;
  readonly isAstrometryCentralizationAvailable = isAstrometryCentralizationAvailable;
  readonly isCentroidizationApplied = isCentroidizationApplied;
  readonly isCentroidizationAvailable = isCentroidizationAvailable;
  readonly analysisSelectionSummary$: Observable<IAnalysisSelectionSummary>;
  private readonly getPhotometricCalibrationRunsForAstrometry = getPhotometricCalibrationRuns;
  private readonly getCentroidRunsForCalibration = getCentroidRuns;
  private readonly getTargetPhotometryRunsForCentroid = getTargetPhotometryRuns;
  private readonly isFiniteNumber = isFiniteNumber;
  private readonly isOptionalFiniteNumber = isOptionalFiniteNumber;
  private readonly roundCentroidRequestPixels = roundCentroidRequestPixels;
  private readonly roundOptionalPixelCoordinate = roundOptionalPixelCoordinate;
  private readonly roundPixelCoordinate = roundPixelCoordinate;
  private readonly roundTargetPhotometryRequestPixels = roundTargetPhotometryRequestPixels;
  private readonly subscriptions = new Subscription();
  private latestAnalysisSelectionSummary?: IAnalysisSelectionSummary;
  private latestFitsClickCoordinates: IFitsClickCoordinates | null = null;
  private lastCentroidDiagnosticsSnapshot = '';
  private lastOutputAutoscrollSignature = '';
  private lastAppliedCatShareDetailIntentKey = '';

  activeDetailView: ICatToolsDetailView | null = null;
  astrometryDraft: IAstrometryInputs | null = null;
  photometricCalibrationDraft: IPhotometricCalibrationInputs | null = null;
  centroidDraft: ICentroidRequest | null = null;
  targetPhotometryDraft: ITargetPhotometryRequest | null = null;
  private photometricCalibrationDraftContext: IPhotometricCalibrationDraftContext | null = null;
  private centroidDraftContext: ICentroidDraftContext | null = null;
  private targetPhotometryDraftContext: ITargetPhotometryDraftContext | null = null;
  private isCentroidDraftUserEdited = false;
  private sourceColorDrafts: Record<string, number | null> = {};
  private sourceMagnitudeValidationErrors: Record<string, string> = {};
  readonly catInputHelp = {
    astrometryRa:
      'RA coordinate about which to search for reference catalog objects to use for astrometric calibration.',
    astrometryDec:
      'Dec coordinate about which to search for reference catalog objects to use for astrometric calibration.',
    astrometryPixelScale:
      'Approximate image pixel scale in arcseconds per pixel. This constrains the astrometry solve.',
    astrometryScaleLow:
      'Optional lower pixel-scale bound for the astrometry solve. Leave blank when the nominal pixel scale is enough.',
    astrometryScaleHigh:
      'Optional upper pixel-scale bound for the astrometry solve. Leave blank when the nominal pixel scale is enough.',
    astrometrySearchRadius:
      'Search radius, in degrees, around RA/Dec for source matching and astrometric calibration.',
    astrometrySnrThreshold:
      'Minimum signal-to-noise ratio for image sources used by detection and matching.',
    photometrySnrThreshold:
      'Minimum signal-to-noise ratio for sources used by photometric calibration.',
    photometryApertureRadius:
      'Aperture radius, in pixels, used to measure calibration-source fluxes.',
    photometryCatalog: 'Reference catalog used for photometric calibration.',
    photometryCalBand: 'Catalog band used as the photometric calibration reference.',
    photometryColorIndex:
      'Color-index label sent as color_term, for example g-r. The fitted response coefficient is a separate numeric value.',
    sourceColor:
      'Numeric source color for the displayed calibration color index. This value is required to calculate magnitude.',
    centroidX:
      'Initial FITS image X pixel to search around for the target centroid. Clicking the FITS viewer updates this value.',
    centroidY:
      'Initial FITS image Y pixel to search around for the target centroid. Clicking the FITS viewer updates this value.',
    centroidSearchRadius: 'Radius, in pixels, around the X/Y guess used to find a centroid.',
    targetShape:
      'Target aperture shape sent to CAT. The current workflow uses circular target apertures.',
    targetSize: 'Circular aperture radius, in pixels, used to sum target flux.',
    targetX:
      'FITS image X pixel for the target aperture center, initialized from the applied centroid.',
    targetY:
      'FITS image Y pixel for the target aperture center, initialized from the applied centroid.',
    backgroundShape:
      'Background aperture shape sent to CAT. Circular annulus estimates sky background in a ring around the target.',
    backgroundSize:
      'Background aperture size parameter sent with the CAT request for compatibility with the backend.',
    backgroundInnerRadius:
      'Inner radius, in pixels, of the background annulus. Pixels inside this radius are excluded from the background estimate.',
    backgroundOuterRadius:
      'Outer radius, in pixels, of the background annulus. Pixels between inner and outer radii estimate local background.',
    backgroundX:
      'FITS image X pixel for the background aperture center, normally the same as the target center.',
    backgroundY:
      'FITS image Y pixel for the background aperture center, normally the same as the target center.',
  } as const;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store$: Store<IAppState>,
    private fitsClickCoordinatesService: FitsClickCoordinatesService,
  ) {
    this.analysisSelectionSummary$ = combineLatest([
      this.store$.select(selectApiData),
      this.store$.select(selectApiDataAnalysisSelectionState),
      this.store$.select(selectApiActiveDatum),
      this.store$.select(selectApiDataAstrometryRunsState),
      this.store$.select(selectApiDataAstrometryCentralizationState),
      this.store$.select(selectApiDataPhotometricCalibrationRunsState),
      this.store$.select(selectApiDataCentroidRunsState),
      this.store$.select(selectApiDataCentroidizationState),
      this.store$.select(selectApiDataTargetPhotometryRunsState),
      this.store$.select(selectApiDataSourceMagnitudeState),
    ]).pipe(
      map(
        ([
          apiData,
          analysisSelectionState,
          activeDatum,
          astrometryRunsState,
          astrometryCentralizationState,
          photometricCalibrationRunsState,
          centroidRunsState,
          centroidizationState,
          targetPhotometryRunsState,
          sourceMagnitudeState,
        ]) => {
          const activeProductId = activeDatum?.product_id;
          const items = (apiData ?? [])
            .filter((apiDatum) => analysisSelectionState[apiDatum.product_id])
            .map((apiDatum) =>
              toAnalysisItem(
                apiDatum,
                activeProductId,
                astrometryRunsState[apiDatum.product_id],
                astrometryCentralizationState[apiDatum.product_id],
                photometricCalibrationRunsState[apiDatum.product_id],
                centroidRunsState[apiDatum.product_id],
                centroidizationState[apiDatum.product_id],
                targetPhotometryRunsState[apiDatum.product_id],
                sourceMagnitudeState[apiDatum.product_id],
              ),
            );

          return {
            totalCount: items.length,
            items,
          };
        },
      ),
      tap((summary) => {
        this.latestAnalysisSelectionSummary = summary;
        this.refreshPhotometricCalibrationDraftForActiveView();
        this.refreshCentroidDraftForActiveView();
        this.refreshTargetPhotometryDraftForActiveView();
        this.scrollToNewOutputIfNeeded(summary);
      }),
    );

    this.subscriptions.add(
      combineLatest([this.analysisSelectionSummary$, this.route.queryParams]).subscribe(
        ([summary, queryParams]) => this.restoreCatShareDetailIntent(summary, queryParams),
      ),
    );

    this.subscriptions.add(
      this.fitsClickCoordinatesService.coordinates$.subscribe((coordinates) => {
        this.latestFitsClickCoordinates = coordinates;
        this.applyFitsClickToCentroidDraft(coordinates);
      }),
    );

    this.subscriptions.add(
      this.fitsClickCoordinatesService.mapperVersion$.subscribe(() => {
        this.refreshCentroidDraftFromFitsWcs();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  activateAnalysisItem(item: IAnalysisItem): void {
    this.store$.dispatch(ApiDataAction_SetActiveDatum({ apiDatum: item.apiDatum }));
  }

  openAstrometryLauncher(item: IAnalysisItem): void {
    this.activateAnalysisItem(item);
    this.astrometryDraft = createDefaultAstrometryInputs(item.apiDatum);
    this.clearPhotometricCalibrationDraft();
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
    this.clearSourceMagnitudeDrafts();
    this.activeDetailView = {
      kind: 'astrometry-launcher',
      title: 'New Astrometry',
      productId: item.productId,
    };
  }

  openAstrometryReview(item: IAnalysisItem, runId: string): void {
    this.activateAnalysisItem(item);
    this.astrometryDraft = null;
    this.activeDetailView = {
      kind: 'astrometry-review',
      title: 'Calibration Results',
      productId: item.productId,
      runId,
    };
    this.initializePhotometricCalibrationDraftIfVisible(
      item,
      item.astrometryRuns.find((run) => run.id === runId),
    );
    this.initializeCentroidDraftIfVisible(
      item,
      item.astrometryRuns.find((run) => run.id === runId),
    );
    this.initializeTargetPhotometryDraftIfVisible(
      item,
      item.astrometryRuns.find((run) => run.id === runId),
    );
    this.primeOutputAutoscrollSignature(
      item,
      item.astrometryRuns.find((run) => run.id === runId),
    );
  }

  openAstrometryLauncherForDetailItem(item: IAnalysisItem): void {
    this.openAstrometryLauncher(item);
  }

  launchAstrometry(): void {
    if (!this.activeDetailView || !this.astrometryDraft) {
      return;
    }

    const productId = this.activeDetailView.productId;
    const runId = simpleUid();
    this.store$.dispatch(
      ApiDataAction_BeginAstrometryRun({
        productId,
        runId,
        inputs: { ...this.astrometryDraft },
        createdAt: new Date().toISOString(),
      }),
    );
    this.astrometryDraft = null;
    this.clearPhotometricCalibrationDraft();
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
    this.clearSourceMagnitudeDrafts();
    this.activeDetailView = {
      kind: 'astrometry-review',
      title: 'Calibration Results',
      productId,
      runId,
    };
    this.lastOutputAutoscrollSignature = '';
  }

  closeDetailView(): void {
    this.activeDetailView = null;
    this.astrometryDraft = null;
    this.clearPhotometricCalibrationDraft();
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
    this.clearSourceMagnitudeDrafts();
    this.lastOutputAutoscrollSignature = '';
  }

  isAstrometryLaunchDisabled(): boolean {
    if (!this.astrometryDraft) {
      return true;
    }

    return (
      !this.astrometryDraft.image_url ||
      !this.isFiniteNumber(this.astrometryDraft.ra) ||
      !this.isFiniteNumber(this.astrometryDraft.dec) ||
      !this.isFiniteNumber(this.astrometryDraft.pixel_scale) ||
      !this.isOptionalFiniteNumber(this.astrometryDraft.scale_low) ||
      !this.isOptionalFiniteNumber(this.astrometryDraft.scale_high) ||
      !this.isFiniteNumber(this.astrometryDraft.search_radius) ||
      !this.isFiniteNumber(this.astrometryDraft.snr_threshold)
    );
  }

  getDetailItem(summary: IAnalysisSelectionSummary): IAnalysisItem | null {
    if (!this.activeDetailView) {
      return null;
    }

    return (
      summary.items.find((item) => item.productId === this.activeDetailView?.productId) ?? null
    );
  }

  getActiveReviewRun(item: IAnalysisItem): IAstrometryRun | null {
    if (!this.activeDetailView || this.activeDetailView.kind !== 'astrometry-review') {
      return null;
    }

    return item.astrometryRuns.find((run) => run.id === this.activeDetailView?.runId) ?? null;
  }

  getReviewRunPosition(item: IAnalysisItem): string {
    const runIndex = this.getActiveReviewRunIndex(item);
    if (runIndex < 0) {
      return 'Run 0 of 0';
    }

    return `Run ${runIndex + 1} of ${item.astrometryRuns.length}`;
  }

  goToAdjacentReviewRun(item: IAnalysisItem, step: -1 | 1): void {
    const runIndex = this.getActiveReviewRunIndex(item);
    const nextRun = item.astrometryRuns[runIndex + step];
    if (!nextRun) {
      return;
    }

    this.activeDetailView = {
      kind: 'astrometry-review',
      title: 'Calibration Results',
      productId: item.productId,
      runId: nextRun.id,
    };
    this.initializePhotometricCalibrationDraftIfVisible(item, nextRun);
    this.initializeCentroidDraftIfVisible(item, nextRun);
    this.initializeTargetPhotometryDraftIfVisible(item, nextRun);
    this.primeOutputAutoscrollSignature(item, nextRun);
  }

  isAdjacentReviewRunAvailable(item: IAnalysisItem, step: -1 | 1): boolean {
    const runIndex = this.getActiveReviewRunIndex(item);
    return !!item.astrometryRuns[runIndex + step];
  }

  getCatWorkflowDownloadContext(): ICatWorkflowDownloadContext | null {
    if (!this.latestAnalysisSelectionSummary) {
      return null;
    }

    const item = this.getDetailItem(this.latestAnalysisSelectionSummary);
    if (!item) {
      return null;
    }

    const run = this.getActiveReviewRun(item);
    if (!run?.result) {
      return null;
    }

    return { item, run };
  }

  copyCatShareLink(item: IAnalysisItem): void {
    const queryParams = {
      ...this.route.snapshot.queryParams,
      ...getCatShareQueryParams(item.productId),
    };
    const urlTree = this.router.createUrlTree(['/data'], { queryParams });
    const serializedUrl = this.router.serializeUrl(urlTree);
    const shareUrl =
      typeof window === 'undefined' ? serializedUrl : `${window.location.origin}${serializedUrl}`;

    void this.copyTextToClipboard(shareUrl)
      .then(() => {
        this.snackBar.open('CAT share link copied', 'Close', { duration: 2500 });
      })
      .catch(() => {
        this.snackBar.open('Unable to copy CAT share link', 'Close', { duration: 5000 });
      });
  }

  downloadCatWorkflowJson(item: IAnalysisItem, run: IAstrometryRun): void {
    if (!run.result) {
      return;
    }

    const exportPayload = createCatWorkflowExport(item, run);
    const filename = getCatWorkflowExportFilename(item, run);
    this.downloadJsonFile(filename, JSON.stringify(exportPayload, null, 2));
  }

  getPhotometricCalibrationRuns(
    item: IAnalysisItem,
    run: IAstrometryRun,
  ): IPhotometricCalibrationRun[] {
    return this.getPhotometricCalibrationRunsForAstrometry(item, run);
  }

  getActivePhotometricCalibrationRun(
    item: IAnalysisItem,
    run: IAstrometryRun,
  ): IPhotometricCalibrationRun | null {
    return getActivePhotometricCalibrationRun(item, run);
  }

  getPhotometricCalibrationColorIndex(run: IPhotometricCalibrationRun): string {
    return run.result?.photometry.color_index || run.inputs.color_term;
  }

  launchPhotometricCalibration(item: IAnalysisItem, run: IAstrometryRun): void {
    const wcsImageUrl = run.result?.wcs_image_url;
    if (
      !this.photometricCalibrationDraft ||
      !wcsImageUrl ||
      this.isPhotometricCalibrationLaunchDisabled(item, run)
    ) {
      return;
    }

    this.activateAnalysisItem(item);
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
    this.clearSourceMagnitudeDrafts();
    this.store$.dispatch(
      ApiDataAction_BeginPhotometricCalibrationRun({
        productId: item.productId,
        astrometryRunId: run.id,
        runId: simpleUid(),
        inputs: {
          ...this.photometricCalibrationDraft,
          // This is an internal workflow value, never a user-provided form value.
          wcs_image_url: wcsImageUrl,
        },
        createdAt: new Date().toISOString(),
      }),
    );
  }

  isPhotometricCalibrationLaunchDisabled(item: IAnalysisItem, run: IAstrometryRun): boolean {
    const draft = this.photometricCalibrationDraft;
    return (
      !draft ||
      run.status !== 'complete' ||
      !run.result?.wcs_image_url ||
      !this.isFiniteNumber(draft.snr_threshold) ||
      draft.snr_threshold <= 0 ||
      !this.isFiniteNumber(draft.aperture_radius) ||
      draft.aperture_radius <= 0 ||
      !draft.catalog ||
      !draft.cal_band.trim() ||
      !draft.color_term.trim() ||
      hasRunningPhotometricCalibration(item, run)
    );
  }

  getPhotometricCalibrationOutputScrollTarget(run: IPhotometricCalibrationRun): string {
    return `photometric-calibration-output-${run.id}`;
  }

  toggleAstrometryCentralization(item: IAnalysisItem, run: IAstrometryRun): void {
    this.activateAnalysisItem(item);

    if (this.isAstrometryCentralizationApplied(item, run)) {
      this.store$.dispatch(
        ApiDataAction_RemoveAstrometryCentralization({ productId: item.productId }),
      );
      this.clearCentroidDraft();
      this.clearTargetPhotometryDraft();
      this.clearSourceMagnitudeDrafts();
      return;
    }

    const centerRaDeg = run.result?.center_ra_deg;
    const centerDecDeg = run.result?.center_dec_deg;

    if (
      run.productId !== item.productId ||
      !this.isAstrometryCentralizationAvailable(run) ||
      !this.isFiniteNumber(centerRaDeg) ||
      !this.isFiniteNumber(centerDecDeg)
    ) {
      return;
    }

    this.store$.dispatch(
      ApiDataAction_ApplyAstrometryCentralization({
        centralization: {
          productId: item.productId,
          runId: run.id,
          centerRaDeg,
          centerDecDeg,
        },
      }),
    );
    const calibrationRun = this.getActivePhotometricCalibrationRun(item, run);
    if (calibrationRun) {
      this.initializeCentroidDraft(item, run, calibrationRun, true);
    }
    this.clearTargetPhotometryDraft();
    this.clearSourceMagnitudeDrafts();
    this.catToolsStack?.scrollDetailTargetIntoView(this.getCentroidInputScrollTarget(run));
  }

  launchCentroid(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
  ): void {
    if (
      !this.centroidDraft ||
      !this.isCentroidSectionVisible(item, astrometryRun, calibrationRun) ||
      this.isCentroidLaunchDisabled()
    ) {
      return;
    }

    this.activateAnalysisItem(item);
    const inputs = this.roundCentroidRequestPixels(this.centroidDraft);
    this.centroidDraft = inputs;
    this.store$.dispatch(
      ApiDataAction_BeginCentroidRun({
        productId: item.productId,
        astrometryRunId: astrometryRun.id,
        photometricCalibrationRunId: calibrationRun.id,
        runId: simpleUid(),
        inputs,
        createdAt: new Date().toISOString(),
      }),
    );
  }

  isCentroidSectionVisible(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
  ): boolean {
    return (
      calibrationRun.status === 'complete' &&
      !!calibrationRun.result?.photometry_image_url &&
      this.isAstrometryCentralizationApplied(item, astrometryRun)
    );
  }

  isCentroidLaunchDisabled(): boolean {
    return (
      !this.centroidDraft ||
      !this.centroidDraft.file ||
      !this.isFiniteNumber(this.centroidDraft.target_x) ||
      !this.isFiniteNumber(this.centroidDraft.target_y) ||
      !this.isFiniteNumber(this.centroidDraft.search_radius) ||
      this.centroidDraft.target_x <= 0 ||
      this.centroidDraft.target_y <= 0 ||
      this.centroidDraft.search_radius <= 0
    );
  }

  markCentroidDraftEdited(): void {
    this.isCentroidDraftUserEdited = true;
  }

  roundCentroidDraftPixels(): void {
    if (!this.centroidDraft) {
      return;
    }

    this.centroidDraft = this.roundCentroidRequestPixels(this.centroidDraft);
  }

  getCentroidRuns(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
  ): ICentroidRun[] {
    return this.getCentroidRunsForCalibration(item, astrometryRun, calibrationRun);
  }

  hasSuccessfulCentroidRun(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
  ): boolean {
    return this.getCentroidRuns(item, astrometryRun, calibrationRun).some(
      (centroidRun) => centroidRun.status === 'complete' && !!centroidRun.result,
    );
  }

  getCentroidInputHint(): string {
    if (!this.centroidDraft) {
      return '';
    }

    if (this.centroidDraft.target_x === 0 && this.centroidDraft.target_y === 0) {
      return (
        'Loading the displayed FITS WCS to initialize X/Y from astrometry RA/Dec. ' +
        'You can still click a FITS pixel to override.'
      );
    }

    return 'X/Y are initialized from astrometry on the displayed FITS; click a FITS pixel to override.';
  }

  getCentroidResultRows(run: ICentroidRun): ICatToolsDatumRow[] {
    return getCentroidResultRows(run, this.getCentroidWorldCoordinates(run));
  }

  getCentroidWorldCoordinates(run: ICentroidRun): { ra: number; dec: number } | null {
    const result = run.result?.search_results;
    if (
      !result ||
      !run.inputs.file ||
      !this.isFiniteNumber(result.cent_x) ||
      !this.isFiniteNumber(result.cent_y)
    ) {
      return null;
    }

    return this.fitsClickCoordinatesService.getWorldCoordinatesFromImage(
      run.inputs.file,
      result.cent_x,
      result.cent_y,
    );
  }

  getAppliedCentroidRun(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
  ): ICentroidRun | null {
    const centroidization = item.centroidization;
    if (
      !centroidization ||
      centroidization.astrometryRunId !== astrometryRun.id ||
      centroidization.photometricCalibrationRunId !== calibrationRun.id
    ) {
      return null;
    }

    return (
      this.getCentroidRuns(item, astrometryRun, calibrationRun).find(
        (centroidRun) => centroidRun.id === centroidization.centroidRunId,
      ) ?? null
    );
  }

  isTargetPhotometrySectionVisible(item: IAnalysisItem, run: ICentroidRun): boolean {
    return this.isCentroidizationApplied(item, run) && this.isCentroidizationAvailable(run);
  }

  launchTargetPhotometry(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
    centroidRun: ICentroidRun,
  ): void {
    if (
      !this.targetPhotometryDraft ||
      !this.isTargetPhotometrySectionVisible(item, centroidRun) ||
      this.isTargetPhotometryLaunchDisabled()
    ) {
      return;
    }

    this.activateAnalysisItem(item);
    const inputs = this.roundTargetPhotometryRequestPixels(this.targetPhotometryDraft);
    this.targetPhotometryDraft = inputs;
    this.store$.dispatch(
      ApiDataAction_BeginTargetPhotometryRun({
        productId: item.productId,
        astrometryRunId: astrometryRun.id,
        photometricCalibrationRunId: calibrationRun.id,
        centroidRunId: centroidRun.id,
        runId: simpleUid(),
        inputs,
        createdAt: new Date().toISOString(),
      }),
    );
  }

  isTargetPhotometryLaunchDisabled(): boolean {
    const draft = this.targetPhotometryDraft;
    if (!draft) {
      return true;
    }

    const [targetX, targetY] = draft.target_aperture_params.position;
    const [backgroundX, backgroundY] = draft.background_aperture_params.position;

    return (
      !draft.file ||
      !this.isFiniteNumber(targetX) ||
      !this.isFiniteNumber(targetY) ||
      !this.isFiniteNumber(backgroundX) ||
      !this.isFiniteNumber(backgroundY) ||
      !this.isFiniteNumber(draft.target_aperture_params.size) ||
      draft.target_aperture_params.size <= 0
    );
  }

  setTargetPhotometrySize(size: number): void {
    if (!this.targetPhotometryDraft) {
      return;
    }

    const numericSize = this.roundPixelCoordinate(Number(size));
    this.targetPhotometryDraft = {
      ...this.targetPhotometryDraft,
      target_aperture_params: {
        ...this.targetPhotometryDraft.target_aperture_params,
        size: numericSize,
      },
      background_aperture_params: {
        ...this.targetPhotometryDraft.background_aperture_params,
        size: numericSize,
        inner_r: numericSize,
        outer_r: numericSize * 2,
      },
    };
  }

  getTargetPhotometryRuns(item: IAnalysisItem, run: ICentroidRun): ITargetPhotometryRun[] {
    return this.getTargetPhotometryRunsForCentroid(item, run);
  }

  hasSuccessfulTargetPhotometryRun(item: IAnalysisItem, run: ICentroidRun): boolean {
    return this.getTargetPhotometryRuns(item, run).some(
      (photometryRun) => photometryRun.status === 'complete' && !!photometryRun.result,
    );
  }

  getSourceColorDraft(run: ITargetPhotometryRun): number | null {
    return this.sourceColorDrafts[run.id] ?? null;
  }

  setSourceColorDraft(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
    centroidRun: ICentroidRun,
    targetRun: ITargetPhotometryRun,
    value: number | null,
  ): void {
    this.sourceColorDrafts = { ...this.sourceColorDrafts, [targetRun.id]: value };
    const { [targetRun.id]: _removed, ...remainingErrors } = this.sourceMagnitudeValidationErrors;
    this.sourceMagnitudeValidationErrors = remainingErrors;

    if (this.getSourceMagnitudeCalculation(item, targetRun)) {
      this.store$.dispatch(
        ApiDataAction_RemoveSourceMagnitudeCalculation({
          productId: item.productId,
          astrometryRunId: astrometryRun.id,
          photometricCalibrationRunId: calibrationRun.id,
          centroidRunId: centroidRun.id,
          targetPhotometryRunId: targetRun.id,
        }),
      );
    }
  }

  calculateSourceMagnitude(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
    centroidRun: ICentroidRun,
    targetRun: ITargetPhotometryRun,
  ): void {
    if (!calibrationRun.result || !targetRun.result) {
      this.setSourceMagnitudeValidationError(
        targetRun.id,
        'Photometric calibration and aperture photometry must both be complete.',
      );
      this.catToolsStack?.scrollDetailTargetIntoView(
        this.getSourceMagnitudeOutputScrollTarget(targetRun),
      );
      return;
    }

    const result = calculateSourceMagnitudeResult({
      sourceColor: this.getSourceColorDraft(targetRun),
      targetPhotometryResult: targetRun.result,
      photometricCalibrationResult: calibrationRun.result,
    });
    if (!result.success) {
      this.setSourceMagnitudeValidationError(targetRun.id, result.error);
      this.catToolsStack?.scrollDetailTargetIntoView(
        this.getSourceMagnitudeOutputScrollTarget(targetRun),
      );
      return;
    }

    const calculation: ISourceMagnitudeCalculation = {
      productId: item.productId,
      astrometryRunId: astrometryRun.id,
      photometricCalibrationRunId: calibrationRun.id,
      centroidRunId: centroidRun.id,
      targetPhotometryRunId: targetRun.id,
      sourceColor: result.sourceColor,
      magnitude: result.magnitude,
      magnitudeUncertainty: result.magnitudeUncertainty,
      calculatedAt: new Date().toISOString(),
    };
    this.store$.dispatch(ApiDataAction_SetSourceMagnitudeCalculation({ calculation }));
    this.setSourceMagnitudeValidationError(targetRun.id, '');
    this.catToolsStack?.scrollDetailTargetIntoView(
      this.getSourceMagnitudeOutputScrollTarget(targetRun),
    );
  }

  getSourceMagnitudeCalculation(
    item: IAnalysisItem,
    run: ITargetPhotometryRun,
  ): ISourceMagnitudeCalculation | null {
    return (
      item.sourceMagnitudeState?.[run.astrometryRunId]?.[run.photometricCalibrationRunId]?.[
        run.centroidRunId
      ]?.[run.id] ?? null
    );
  }

  getSourceMagnitudeValidationError(run: ITargetPhotometryRun): string {
    return this.sourceMagnitudeValidationErrors[run.id] ?? '';
  }

  getCatOutputImageUrl(path: string | null | undefined): string {
    const imagePath = path?.trim();
    if (!imagePath) {
      return '';
    }

    return this.isDisplayableCatOutputImage(path) ? imagePath : '';
  }

  isDisplayableCatOutputImage(path: string | null | undefined): boolean {
    const imagePath = path?.trim();
    return (
      !!imagePath && (/^(https?:|data:|blob:)/i.test(imagePath) || imagePath.startsWith('/api/'))
    );
  }

  getCatOutputFigureReference(path: string | null | undefined): string {
    return path?.trim() || 'N/A';
  }

  getCentroidFigureUrl(result: ICentroidResponse): string {
    return this.getCatOutputImageUrl(result.centroid_figure_url ?? result.centroid_figure);
  }

  getTargetPhotometryFigureUrl(result: ITargetPhotometryResponse): string {
    return this.getCatOutputImageUrl(result.aperture_figure_url ?? result.aperture_figure);
  }

  getAstrometryOutputScrollTarget(run: IAstrometryRun): string {
    return `astrometry-output-${run.id}`;
  }

  getAstrometryCentralizationScrollTarget(run: IAstrometryRun): string {
    return `astrometry-centralization-${run.id}`;
  }

  getAstrometryErrorScrollTarget(run: IAstrometryRun): string {
    return `astrometry-error-${run.id}`;
  }

  getCentroidInputScrollTarget(run: IAstrometryRun): string {
    return `centroid-input-${run.id}`;
  }

  getCentroidOutputScrollTarget(run: ICentroidRun): string {
    return `centroid-output-${run.id}`;
  }

  getTargetPhotometryInputScrollTarget(run: ICentroidRun): string {
    return `target-photometry-input-${run.id}`;
  }

  getTargetPhotometryOutputScrollTarget(run: ITargetPhotometryRun): string {
    return `target-photometry-output-${run.id}`;
  }

  getSourceMagnitudeOutputScrollTarget(run: ITargetPhotometryRun): string {
    return 'source-magnitude-output-' + run.id;
  }

  toggleCentroidization(item: IAnalysisItem, run: ICentroidRun): void {
    this.activateAnalysisItem(item);

    if (this.isCentroidizationApplied(item, run)) {
      this.store$.dispatch(ApiDataAction_RemoveCentroidization({ productId: item.productId }));
      this.clearTargetPhotometryDraft();
      this.clearSourceMagnitudeDrafts();
      return;
    }

    const centX = this.roundOptionalPixelCoordinate(run.result?.search_results.cent_x);
    const centY = this.roundOptionalPixelCoordinate(run.result?.search_results.cent_y);
    const astrometryCenterX = run.inputs.astrometry_center_x;
    const astrometryCenterY = run.inputs.astrometry_center_y;

    if (
      !this.isCentroidizationAvailable(run) ||
      !this.isFiniteNumber(centX) ||
      !this.isFiniteNumber(centY)
    ) {
      return;
    }

    const centroidization: ICentroidization = {
      productId: item.productId,
      astrometryRunId: run.astrometryRunId,
      photometricCalibrationRunId: run.photometricCalibrationRunId,
      centroidRunId: run.id,
      initX: this.roundPixelCoordinate(run.inputs.target_x),
      initY: this.roundPixelCoordinate(run.inputs.target_y),
      astrometryCenterX: this.isFiniteNumber(astrometryCenterX)
        ? this.roundPixelCoordinate(astrometryCenterX)
        : this.roundPixelCoordinate(run.inputs.target_x),
      astrometryCenterY: this.isFiniteNumber(astrometryCenterY)
        ? this.roundPixelCoordinate(astrometryCenterY)
        : this.roundPixelCoordinate(run.inputs.target_y),
      centX,
      centY,
    };

    this.store$.dispatch(ApiDataAction_ApplyCentroidization({ centroidization }));
    this.initializeTargetPhotometryDraftIfVisible(
      { ...item, centroidization },
      item.astrometryRuns.find((astrometryRun) => astrometryRun.id === run.astrometryRunId),
      true,
    );
    this.catToolsStack?.scrollDetailTargetIntoView(this.getTargetPhotometryInputScrollTarget(run));
  }

  private refreshCentroidDraftForActiveView(): void {
    if (!this.activeDetailView || this.activeDetailView.kind !== 'astrometry-review') {
      this.clearCentroidDraft();
      return;
    }

    const item =
      this.latestAnalysisSelectionSummary?.items.find(
        (candidate) => candidate.productId === this.activeDetailView?.productId,
      ) ?? null;
    const run = item?.astrometryRuns.find(
      (candidate) => candidate.id === this.activeDetailView?.runId,
    );
    if (!item) {
      this.clearCentroidDraft();
      return;
    }

    this.initializeCentroidDraftIfVisible(item, run);
  }

  private refreshPhotometricCalibrationDraftForActiveView(): void {
    if (!this.activeDetailView || this.activeDetailView.kind !== 'astrometry-review') {
      this.clearPhotometricCalibrationDraft();
      return;
    }

    const item =
      this.latestAnalysisSelectionSummary?.items.find(
        (candidate) => candidate.productId === this.activeDetailView?.productId,
      ) ?? null;
    const run = item?.astrometryRuns.find(
      (candidate) => candidate.id === this.activeDetailView?.runId,
    );
    this.initializePhotometricCalibrationDraftIfVisible(item ?? undefined, run);
  }

  private initializePhotometricCalibrationDraftIfVisible(
    item: IAnalysisItem | undefined,
    run: IAstrometryRun | undefined,
  ): void {
    if (!item || run?.status !== 'complete' || !run.result?.wcs_image_url) {
      this.clearPhotometricCalibrationDraft();
      return;
    }

    const context = { productId: item.productId, astrometryRunId: run.id };
    if (this.isSamePhotometricCalibrationDraftContext(context)) {
      this.photometricCalibrationDraft = this.photometricCalibrationDraft
        ? { ...this.photometricCalibrationDraft, wcs_image_url: run.result.wcs_image_url }
        : createDefaultPhotometricCalibrationInputs(run);
      return;
    }

    this.photometricCalibrationDraftContext = context;
    this.photometricCalibrationDraft = createDefaultPhotometricCalibrationInputs(run);
  }

  private initializeCentroidDraftIfVisible(
    item: IAnalysisItem,
    run: IAstrometryRun | undefined,
  ): void {
    const calibrationRun = run ? this.getActivePhotometricCalibrationRun(item, run) : null;
    if (!run || !calibrationRun || !this.isCentroidSectionVisible(item, run, calibrationRun)) {
      this.clearCentroidDraft();
      return;
    }

    this.initializeCentroidDraft(item, run, calibrationRun, false);
  }

  private initializeCentroidDraft(
    item: IAnalysisItem,
    run: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
    forceReset: boolean,
  ): void {
    const context = {
      productId: item.productId,
      astrometryRunId: run.id,
      photometricCalibrationRunId: calibrationRun.id,
    };
    if (!forceReset && this.isSameCentroidDraftContext(context)) {
      this.refreshCentroidDraftFromFitsWcs();
      return;
    }

    this.centroidDraftContext = context;
    this.isCentroidDraftUserEdited = false;
    this.centroidDraft = this.createDefaultCentroidInputs(item, run, calibrationRun);
    this.refreshCentroidDraftFromFitsWcs();
  }

  private createDefaultCentroidInputs(
    item: IAnalysisItem,
    run: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
  ): ICentroidRequest {
    const file = calibrationRun.result?.photometry_image_url ?? '';
    const coordinateReferenceFile = this.getCentroidCoordinateReferenceFile(item, run, file);
    if (coordinateReferenceFile) {
      this.fitsClickCoordinatesService.requestWorldToImageCoordinatesMapper(
        coordinateReferenceFile,
      );
    }

    const centerCoordinates = this.getCentralizedFitsPixelCoordinates(coordinateReferenceFile, run);
    const fallbackCoordinates = this.getLatestFitsClickCoordinatesForFile(
      coordinateReferenceFile,
      item.productId,
    );

    const draft = {
      file,
      target_x: this.roundPixelCoordinate(centerCoordinates?.imageX ?? fallbackCoordinates?.imageX),
      target_y: this.roundPixelCoordinate(centerCoordinates?.imageY ?? fallbackCoordinates?.imageY),
      search_radius: this.isFiniteNumber(calibrationRun.inputs.aperture_radius)
        ? this.roundPixelCoordinate(calibrationRun.inputs.aperture_radius)
        : 7,
      astrometry_center_x: this.roundOptionalPixelCoordinate(centerCoordinates?.imageX),
      astrometry_center_y: this.roundOptionalPixelCoordinate(centerCoordinates?.imageY),
    };

    this.logCentroidCoordinateDiagnostics('initial default', item, run, draft);
    return draft;
  }

  /**
   * CAT's calibrated FITS files preserve the source pixel grid, while JS9 registers its WCS
   * mapper against the original FITS URL displayed for the row.
   */
  private getCentroidCoordinateReferenceFile(
    item: IAnalysisItem,
    run: IAstrometryRun,
    fallbackFile: string,
  ): string {
    return item.apiDatum.cutout_url || run.inputs.image_url || fallbackFile;
  }

  private refreshTargetPhotometryDraftForActiveView(): void {
    if (!this.activeDetailView || this.activeDetailView.kind !== 'astrometry-review') {
      this.clearTargetPhotometryDraft();
      return;
    }

    const item =
      this.latestAnalysisSelectionSummary?.items.find(
        (candidate) => candidate.productId === this.activeDetailView?.productId,
      ) ?? null;
    const run = item?.astrometryRuns.find(
      (candidate) => candidate.id === this.activeDetailView?.runId,
    );

    if (!item || !run) {
      this.clearTargetPhotometryDraft();
      return;
    }

    this.initializeTargetPhotometryDraftIfVisible(item, run);
  }

  private initializeTargetPhotometryDraftIfVisible(
    item: IAnalysisItem,
    run: IAstrometryRun | undefined,
    forceReset = false,
  ): void {
    if (!run) {
      this.clearTargetPhotometryDraft();
      return;
    }

    const calibrationRun = this.getActivePhotometricCalibrationRun(item, run);
    const centroidRun = calibrationRun
      ? this.getAppliedCentroidRun(item, run, calibrationRun)
      : null;
    if (
      !calibrationRun ||
      !centroidRun ||
      !this.isTargetPhotometrySectionVisible(item, centroidRun)
    ) {
      this.clearTargetPhotometryDraft();
      return;
    }

    this.initializeTargetPhotometryDraft(item, run, calibrationRun, centroidRun, forceReset);
  }

  private initializeTargetPhotometryDraft(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    calibrationRun: IPhotometricCalibrationRun,
    centroidRun: ICentroidRun,
    forceReset: boolean,
  ): void {
    const context = {
      productId: item.productId,
      astrometryRunId: astrometryRun.id,
      photometricCalibrationRunId: calibrationRun.id,
      centroidRunId: centroidRun.id,
    };
    if (!forceReset && this.isSameTargetPhotometryDraftContext(context)) {
      return;
    }

    this.targetPhotometryDraftContext = context;
    this.targetPhotometryDraft = createDefaultTargetPhotometryInputs(centroidRun);
  }

  private scrollToNewOutputIfNeeded(summary: IAnalysisSelectionSummary): void {
    const item = this.getDetailItem(summary);
    if (!item) {
      this.lastOutputAutoscrollSignature = '';
      return;
    }

    const run = this.getActiveReviewRun(item);
    if (!run) {
      this.lastOutputAutoscrollSignature = '';
      return;
    }

    const outputState = this.getOutputAutoscrollState(item, run);
    if (outputState.signature === this.lastOutputAutoscrollSignature) {
      return;
    }

    this.lastOutputAutoscrollSignature = outputState.signature;
    if (outputState.target) {
      this.catToolsStack?.scrollDetailTargetIntoView(outputState.target);
    }
  }

  private primeOutputAutoscrollSignature(
    item: IAnalysisItem,
    run: IAstrometryRun | undefined,
  ): void {
    this.lastOutputAutoscrollSignature = run
      ? this.getOutputAutoscrollState(item, run).signature
      : '';
  }

  private getOutputAutoscrollState(
    item: IAnalysisItem,
    run: IAstrometryRun,
  ): { signature: string; target: string | null } {
    const outputKeys: string[] = [];
    let target: string | null = null;

    if (run.status === 'running') {
      outputKeys.push('astrometry-running:' + run.id);
      target = this.getAstrometryOutputScrollTarget(run);
    } else if (run.result) {
      outputKeys.push(`astrometry-result:${run.id}`);
      target = this.isAstrometryCentralizationAvailable(run)
        ? this.getAstrometryCentralizationScrollTarget(run)
        : this.getAstrometryOutputScrollTarget(run);
    } else if (run.error) {
      outputKeys.push(`astrometry-error:${run.id}`);
      target = this.getAstrometryErrorScrollTarget(run);
    }

    for (const calibrationRun of this.getPhotometricCalibrationRuns(item, run)) {
      if (calibrationRun.status === 'running') {
        outputKeys.push('photometric-calibration-running:' + calibrationRun.id);
        target = this.getPhotometricCalibrationOutputScrollTarget(calibrationRun);
      } else if (calibrationRun.result) {
        outputKeys.push(`photometric-calibration-result:${calibrationRun.id}`);
        target = this.getPhotometricCalibrationOutputScrollTarget(calibrationRun);
      } else if (calibrationRun.error) {
        outputKeys.push(`photometric-calibration-error:${calibrationRun.id}`);
        target = this.getPhotometricCalibrationOutputScrollTarget(calibrationRun);
      }

      for (const centroidRun of this.getCentroidRuns(item, run, calibrationRun)) {
        if (centroidRun.status === 'running') {
          outputKeys.push('centroid-running:' + centroidRun.id);
          target = this.getCentroidOutputScrollTarget(centroidRun);
        } else if (centroidRun.result) {
          outputKeys.push(`centroid-result:${centroidRun.id}`);
          target = this.getCentroidOutputScrollTarget(centroidRun);
        } else if (centroidRun.error) {
          outputKeys.push(`centroid-error:${centroidRun.id}`);
          target = this.getCentroidOutputScrollTarget(centroidRun);
        }

        for (const targetRun of this.getTargetPhotometryRuns(item, centroidRun)) {
          if (targetRun.status === 'running') {
            outputKeys.push('target-photometry-running:' + targetRun.id);
            target = this.getTargetPhotometryOutputScrollTarget(targetRun);
          } else if (targetRun.result) {
            outputKeys.push(`target-photometry-result:${targetRun.id}`);
            target = this.getTargetPhotometryOutputScrollTarget(targetRun);
          } else if (targetRun.error) {
            outputKeys.push(`target-photometry-error:${targetRun.id}`);
            target = this.getTargetPhotometryOutputScrollTarget(targetRun);
          }

          if (this.getSourceMagnitudeCalculation(item, targetRun)) {
            outputKeys.push('source-magnitude:' + targetRun.id);
            target = this.getSourceMagnitudeOutputScrollTarget(targetRun);
          }
        }
      }
    }

    return {
      signature: outputKeys.join('|'),
      target,
    };
  }

  private refreshCentroidDraftFromFitsWcs(): void {
    if (!this.centroidDraft || !this.centroidDraftContext) {
      return;
    }

    const activeItem = this.getCentroidDraftAnalysisItem();
    const activeRun = this.getCentroidDraftAstrometryRun();
    if (!activeItem || !activeRun) {
      return;
    }

    const coordinateReferenceFile = this.getCentroidCoordinateReferenceFile(
      activeItem,
      activeRun,
      this.centroidDraft.file,
    );
    if (coordinateReferenceFile) {
      this.fitsClickCoordinatesService.requestWorldToImageCoordinatesMapper(
        coordinateReferenceFile,
      );
    }

    const centerCoordinates = this.getCentralizedFitsPixelCoordinates(
      coordinateReferenceFile,
      activeRun,
    );
    if (!centerCoordinates) {
      return;
    }

    const centerX = this.roundPixelCoordinate(centerCoordinates.imageX);
    const centerY = this.roundPixelCoordinate(centerCoordinates.imageY);

    this.centroidDraft = this.isCentroidDraftUserEdited
      ? {
          ...this.centroidDraft,
          astrometry_center_x: centerX,
          astrometry_center_y: centerY,
        }
      : {
          ...this.centroidDraft,
          target_x: centerX,
          target_y: centerY,
          astrometry_center_x: centerX,
          astrometry_center_y: centerY,
        };

    this.logCentroidCoordinateDiagnostics(
      'wcs mapper refresh',
      activeItem,
      activeRun,
      this.centroidDraft,
    );
  }

  private applyFitsClickToCentroidDraft(coordinates: IFitsClickCoordinates | null): void {
    if (
      !coordinates ||
      !this.centroidDraft ||
      !this.isCentroidDraftActive() ||
      !this.isFitsClickForCentroidDraft(coordinates)
    ) {
      return;
    }

    this.centroidDraft = {
      ...this.centroidDraft,
      target_x: this.roundPixelCoordinate(coordinates.imageX),
      target_y: this.roundPixelCoordinate(coordinates.imageY),
    };
    this.isCentroidDraftUserEdited = true;

    const activeItem = this.getCentroidDraftAnalysisItem();
    const activeRun = this.getCentroidDraftAstrometryRun();
    if (activeItem && activeRun) {
      this.logCentroidCoordinateDiagnostics(
        'fits click override',
        activeItem,
        activeRun,
        this.centroidDraft,
      );
    }
  }

  private getCentralizedFitsPixelCoordinates(
    file: string,
    run: IAstrometryRun,
  ): { imageX: number; imageY: number } | null {
    const originalTargetPixel = this.getFitsPixelCoordinatesForRaDec(
      file,
      run.inputs.ra,
      run.inputs.dec,
    );
    const solvedCenterPixel = this.getFitsPixelCoordinatesForRaDec(
      file,
      run.result?.center_ra_deg,
      run.result?.center_dec_deg,
    );

    if (originalTargetPixel && solvedCenterPixel) {
      return {
        imageX:
          originalTargetPixel.imageX + (originalTargetPixel.imageX - solvedCenterPixel.imageX),
        imageY:
          originalTargetPixel.imageY + (originalTargetPixel.imageY - solvedCenterPixel.imageY),
      };
    }

    return originalTargetPixel ?? solvedCenterPixel;
  }

  private getFitsPixelCoordinatesForRaDec(
    file: string,
    ra: number | null | undefined,
    dec: number | null | undefined,
  ): ICentroidCoordinatePair | null {
    if (!file || !this.isFiniteNumber(ra) || !this.isFiniteNumber(dec)) {
      return null;
    }

    return this.fitsClickCoordinatesService.getImageCoordinatesFromWorld(file, ra, dec);
  }

  private logCentroidCoordinateDiagnostics(
    trigger: string,
    item: IAnalysisItem,
    run: IAstrometryRun,
    draft: ICentroidRequest,
  ): void {
    const file = this.getCentroidCoordinateReferenceFile(item, run, draft.file);
    const rowRa = getNumberFromDatumOrCutoutUrl(item.apiDatum, 'ra');
    const rowDec = getNumberFromDatumOrCutoutUrl(item.apiDatum, 'dec');
    const resultRa = run.result?.center_ra_deg;
    const resultDec = run.result?.center_dec_deg;
    const rowPixel = this.getFitsPixelCoordinatesForRaDec(file, rowRa, rowDec);
    const inputPixel = this.getFitsPixelCoordinatesForRaDec(file, run.inputs.ra, run.inputs.dec);
    const resultPixel = this.getFitsPixelCoordinatesForRaDec(file, resultRa, resultDec);
    const latestClick = this.latestFitsClickCoordinates
      ? {
          imageX: this.latestFitsClickCoordinates.imageX,
          imageY: this.latestFitsClickCoordinates.imageY,
          imageFrameX: this.latestFitsClickCoordinates.imageFrameX,
          imageFrameY: this.latestFitsClickCoordinates.imageFrameY,
          physicalX: this.latestFitsClickCoordinates.physicalX,
          physicalY: this.latestFitsClickCoordinates.physicalY,
          displayX: this.latestFitsClickCoordinates.displayX,
          displayY: this.latestFitsClickCoordinates.displayY,
          ra: this.latestFitsClickCoordinates.ra,
          dec: this.latestFitsClickCoordinates.dec,
          wcsSystem: this.latestFitsClickCoordinates.wcsSystem,
          wcsString: this.latestFitsClickCoordinates.wcsString,
          file: this.latestFitsClickCoordinates.file,
          productId: this.latestFitsClickCoordinates.productId,
          coordinateSource: this.latestFitsClickCoordinates.coordinateSource,
        }
      : null;
    const draftPoint = { imageX: draft.target_x, imageY: draft.target_y };
    const mappedPoints = [
      {
        label: 'row RA/Dec -> JS9 WCS pixel',
        ra: rowRa,
        dec: rowDec,
        targetX: rowPixel?.imageX ?? null,
        targetY: rowPixel?.imageY ?? null,
        wcsPixelX: rowPixel?.wcsPixelX ?? null,
        wcsPixelY: rowPixel?.wcsPixelY ?? null,
        wcsPixelAsPhysicalX: rowPixel?.wcsPixelAsPhysicalX ?? null,
        wcsPixelAsPhysicalY: rowPixel?.wcsPixelAsPhysicalY ?? null,
        wcsPixelAsImageX: rowPixel?.wcsPixelAsImageX ?? null,
        wcsPixelAsImageY: rowPixel?.wcsPixelAsImageY ?? null,
      },
      {
        label: 'astrometry input RA/Dec -> JS9 WCS pixel',
        ra: run.inputs.ra,
        dec: run.inputs.dec,
        targetX: inputPixel?.imageX ?? null,
        targetY: inputPixel?.imageY ?? null,
        wcsPixelX: inputPixel?.wcsPixelX ?? null,
        wcsPixelY: inputPixel?.wcsPixelY ?? null,
        wcsPixelAsPhysicalX: inputPixel?.wcsPixelAsPhysicalX ?? null,
        wcsPixelAsPhysicalY: inputPixel?.wcsPixelAsPhysicalY ?? null,
        wcsPixelAsImageX: inputPixel?.wcsPixelAsImageX ?? null,
        wcsPixelAsImageY: inputPixel?.wcsPixelAsImageY ?? null,
      },
      {
        label: 'astrometry result RA/Dec -> JS9 WCS pixel',
        ra: resultRa ?? null,
        dec: resultDec ?? null,
        targetX: resultPixel?.imageX ?? null,
        targetY: resultPixel?.imageY ?? null,
        wcsPixelX: resultPixel?.wcsPixelX ?? null,
        wcsPixelY: resultPixel?.wcsPixelY ?? null,
        wcsPixelAsPhysicalX: resultPixel?.wcsPixelAsPhysicalX ?? null,
        wcsPixelAsPhysicalY: resultPixel?.wcsPixelAsPhysicalY ?? null,
        wcsPixelAsImageX: resultPixel?.wcsPixelAsImageX ?? null,
        wcsPixelAsImageY: resultPixel?.wcsPixelAsImageY ?? null,
      },
      {
        label: 'current centroid draft sent to /centroid',
        ra: null,
        dec: null,
        targetX: draft.target_x,
        targetY: draft.target_y,
        wcsPixelX: null,
        wcsPixelY: null,
        wcsPixelAsPhysicalX: null,
        wcsPixelAsPhysicalY: null,
        wcsPixelAsImageX: null,
        wcsPixelAsImageY: null,
      },
      {
        label: 'latest FITS click',
        ra: latestClick?.ra ?? null,
        dec: latestClick?.dec ?? null,
        targetX: latestClick?.imageX ?? null,
        targetY: latestClick?.imageY ?? null,
        imageFrameX: latestClick?.imageFrameX ?? null,
        imageFrameY: latestClick?.imageFrameY ?? null,
        physicalX: latestClick?.physicalX ?? null,
        physicalY: latestClick?.physicalY ?? null,
      },
    ];
    const diagnostics = {
      note: 'targetX/targetY are the values CATCH will send to /centroid as target_x/target_y.',
      trigger,
      productId: item.productId,
      sourceName: item.sourceName,
      date: item.date,
      centroidRequestFile: draft.file,
      coordinateReferenceFile: file,
      run: {
        id: run.id,
        sequence: run.sequence,
        status: run.status,
      },
      astrometryInputs: run.inputs,
      astrometryResult: run.result ?? null,
      centroidDraft: { ...draft },
      latestFitsClick: latestClick,
      mappedPoints,
      coordinateDeltas: {
        astrometryResultMinusRow: this.getCoordinateDelta(resultPixel, rowPixel),
        centroidDraftMinusRow: this.getCoordinateDelta(draftPoint, rowPixel),
        centroidDraftMinusAstrometryResult: this.getCoordinateDelta(draftPoint, resultPixel),
        latestClickMinusCentroidDraft: this.getCoordinateDelta(
          latestClick ? { imageX: latestClick.imageX, imageY: latestClick.imageY } : null,
          draftPoint,
        ),
      },
    };
    const snapshot = JSON.stringify(diagnostics, null, 2);
    const hasMappedCoordinates = !!rowPixel || !!inputPixel || !!resultPixel || !!latestClick;
    if (!hasMappedCoordinates || snapshot === this.lastCentroidDiagnosticsSnapshot) {
      return;
    }

    this.lastCentroidDiagnosticsSnapshot = snapshot;
    console.log(`[CATCH centroid diagnostics] ${trigger}: ${item.sourceName} ${item.date}`);
    console.log(diagnostics);
    console.table(mappedPoints);
    console.log(`[CATCH centroid diagnostics JSON]\n${snapshot}`);
  }

  private getCoordinateDelta(
    point: ICentroidCoordinatePair | null,
    reference: ICentroidCoordinatePair | null,
  ): ICentroidCoordinatePair | null {
    if (!point || !reference) {
      return null;
    }

    return {
      imageX: point.imageX - reference.imageX,
      imageY: point.imageY - reference.imageY,
    };
  }

  private getCentroidDraftAnalysisItem(): IAnalysisItem | null {
    if (!this.centroidDraftContext || !this.latestAnalysisSelectionSummary) {
      return null;
    }

    return (
      this.latestAnalysisSelectionSummary.items.find(
        (candidate) => candidate.productId === this.centroidDraftContext?.productId,
      ) ?? null
    );
  }

  private getLatestFitsClickCoordinatesForFile(
    file: string,
    productId: string,
  ): IFitsClickCoordinates | null {
    const latestClick = this.latestFitsClickCoordinates;
    if (!latestClick) {
      return null;
    }

    if (latestClick.file && latestClick.file !== file) {
      return null;
    }

    if (latestClick.productId && latestClick.productId !== productId) {
      return null;
    }

    return latestClick;
  }

  private isFitsClickForCentroidDraft(coordinates: IFitsClickCoordinates): boolean {
    const activeItem = this.getCentroidDraftAnalysisItem();
    const activeRun = this.getCentroidDraftAstrometryRun();
    const coordinateReferenceFile =
      activeItem && activeRun
        ? this.getCentroidCoordinateReferenceFile(
            activeItem,
            activeRun,
            this.centroidDraft?.file ?? '',
          )
        : '';
    if (
      coordinates.file &&
      coordinates.file !== this.centroidDraft?.file &&
      coordinates.file !== coordinateReferenceFile
    ) {
      return false;
    }

    if (
      coordinates.productId &&
      this.centroidDraftContext &&
      coordinates.productId !== this.centroidDraftContext.productId
    ) {
      return false;
    }

    return true;
  }

  private getCentroidDraftAstrometryRun(): IAstrometryRun | null {
    if (!this.centroidDraftContext) {
      return null;
    }

    const item = this.getCentroidDraftAnalysisItem();
    return (
      item?.astrometryRuns.find((run) => run.id === this.centroidDraftContext?.astrometryRunId) ??
      null
    );
  }

  private isCentroidDraftActive(): boolean {
    if (!this.activeDetailView || !this.centroidDraftContext) {
      return false;
    }

    return (
      this.activeDetailView.kind === 'astrometry-review' &&
      this.activeDetailView.productId === this.centroidDraftContext.productId &&
      this.activeDetailView.runId === this.centroidDraftContext.astrometryRunId
    );
  }

  private isSamePhotometricCalibrationDraftContext(
    context: IPhotometricCalibrationDraftContext,
  ): boolean {
    return (
      this.photometricCalibrationDraftContext?.productId === context.productId &&
      this.photometricCalibrationDraftContext?.astrometryRunId === context.astrometryRunId
    );
  }

  private clearPhotometricCalibrationDraft(): void {
    this.photometricCalibrationDraft = null;
    this.photometricCalibrationDraftContext = null;
  }

  private isSameCentroidDraftContext(context: ICentroidDraftContext): boolean {
    return (
      this.centroidDraftContext?.productId === context.productId &&
      this.centroidDraftContext?.astrometryRunId === context.astrometryRunId &&
      this.centroidDraftContext?.photometricCalibrationRunId === context.photometricCalibrationRunId
    );
  }

  private clearCentroidDraft(): void {
    this.centroidDraft = null;
    this.centroidDraftContext = null;
    this.isCentroidDraftUserEdited = false;
  }

  private isSameTargetPhotometryDraftContext(context: ITargetPhotometryDraftContext): boolean {
    return (
      this.targetPhotometryDraftContext?.productId === context.productId &&
      this.targetPhotometryDraftContext?.astrometryRunId === context.astrometryRunId &&
      this.targetPhotometryDraftContext?.photometricCalibrationRunId ===
        context.photometricCalibrationRunId &&
      this.targetPhotometryDraftContext?.centroidRunId === context.centroidRunId
    );
  }

  private clearTargetPhotometryDraft(): void {
    this.targetPhotometryDraft = null;
    this.targetPhotometryDraftContext = null;
  }

  private setSourceMagnitudeValidationError(runId: string, error: string): void {
    if (!error) {
      const { [runId]: _removed, ...remainingErrors } = this.sourceMagnitudeValidationErrors;
      this.sourceMagnitudeValidationErrors = remainingErrors;
      return;
    }

    this.sourceMagnitudeValidationErrors = {
      ...this.sourceMagnitudeValidationErrors,
      [runId]: error,
    };
  }

  private clearSourceMagnitudeDrafts(): void {
    this.sourceColorDrafts = {};
    this.sourceMagnitudeValidationErrors = {};
  }

  private restoreCatShareDetailIntent(
    summary: IAnalysisSelectionSummary,
    queryParams: Record<string, unknown>,
  ): void {
    const intent = parseCatShareIntent(queryParams);
    if (!intent) {
      return;
    }

    const item = summary.items.find((candidate) => candidate.productId === intent.productId);
    if (!item) {
      return;
    }

    const intentKey = `${intent.productId}:${intent.view}`;
    if (intentKey === this.lastAppliedCatShareDetailIntentKey) {
      return;
    }

    this.lastAppliedCatShareDetailIntentKey = intentKey;
    this.openAstrometryLauncher(item);
  }

  private copyTextToClipboard(text: string): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }

    if (typeof document === 'undefined') {
      return Promise.reject(new Error('Clipboard is unavailable.'));
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '-1000px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const didCopy = document.execCommand('copy');
      return didCopy ? Promise.resolve() : Promise.reject(new Error('Clipboard command failed.'));
    } finally {
      document.body.removeChild(textArea);
    }
  }

  private downloadJsonFile(filename: string, json: string): void {
    if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return;
    }

    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }

  private getActiveReviewRunIndex(item: IAnalysisItem): number {
    if (!this.activeDetailView?.runId) {
      return -1;
    }

    return item.astrometryRuns.findIndex((run) => run.id === this.activeDetailView?.runId);
  }
}
