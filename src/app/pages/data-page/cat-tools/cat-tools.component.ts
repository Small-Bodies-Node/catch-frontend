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

import {
  IAstrometryInputs,
  IAstrometryRun,
  TAstrometryBand,
} from '../../../../models/IAstrometryRun';
import { simpleUid } from '../../../../utils/simpleUid';
import {
  ApiDataAction_ApplyAstrometryCentralization,
  ApiDataAction_ApplyCentroidization,
  ApiDataAction_BeginAstrometryRun,
  ApiDataAction_BeginCentroidRun,
  ApiDataAction_BeginTargetPhotometryRun,
  ApiDataAction_RemoveCentroidization,
  ApiDataAction_RemoveAstrometryCentralization,
  ApiDataAction_SetActiveDatum,
} from '../../../ngrx/actions/api-data.actions';
import { IAppState } from '../../../ngrx/reducers';
import {
  selectApiActiveDatum,
  selectApiData,
  selectApiDataAnalysisSelectionState,
  selectApiDataAstrometryCentralizationState,
  selectApiDataAstrometryRunsState,
  selectApiDataCentroidRunsState,
  selectApiDataCentroidizationState,
  selectApiDataTargetPhotometryRunsState,
} from '../../../ngrx/selectors/api-data.selectors';
import { CatToolsStackComponent } from './cat-tools-stack/cat-tools-stack.component';
import {
  ICentroidRequest,
  ICentroidResponse,
  ICentroidRun,
  ICentroidization,
} from '../../../../models/ICentroid';
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
  getAstrometryPhotometryWarning,
  getAstrometryResultGroups,
  getAstrometryRunStatusLabel,
  isAstrometryCentralizationApplied,
  isAstrometryCentralizationAvailable,
  isAstrometryPartialSuccess,
} from './domain/cat-astrometry';
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
  imports: [AsyncPipe, CatToolsStackComponent, FormsModule, CatFieldInfoComponent],
  standalone: true,
})
export class CatToolsComponent implements OnDestroy {
  @ViewChild(CatToolsStackComponent)
  private catToolsStack?: CatToolsStackComponent;

  readonly astrometryBands: readonly TAstrometryBand[] = ['g', 'r', 'i', 'z', 'y'];
  readonly formatDatumValue = formatDatumValue;
  readonly getAstrometryCentralizationActionLabel = getAstrometryCentralizationActionLabel;
  readonly getAstrometryInputRows = getAstrometryInputRows;
  readonly getAstrometryPhotometryWarning = getAstrometryPhotometryWarning;
  readonly getAstrometryResultGroups = getAstrometryResultGroups;
  readonly getAstrometryRunStatusLabel = getAstrometryRunStatusLabel;
  readonly getCentroidRunStatusLabel = getCentroidRunStatusLabel;
  readonly getCentroidizationActionLabel = getCentroidizationActionLabel;
  readonly getTargetPhotometryResultRows = getTargetPhotometryResultRows;
  readonly getTargetPhotometryRunStatusLabel = getTargetPhotometryRunStatusLabel;
  readonly isAstrometryCentralizationApplied = isAstrometryCentralizationApplied;
  readonly isAstrometryCentralizationAvailable = isAstrometryCentralizationAvailable;
  readonly isAstrometryPartialSuccess = isAstrometryPartialSuccess;
  readonly isCentroidizationApplied = isCentroidizationApplied;
  readonly isCentroidizationAvailable = isCentroidizationAvailable;
  readonly analysisSelectionSummary$: Observable<IAnalysisSelectionSummary>;
  private readonly getCentroidRunsForAstrometry = getCentroidRuns;
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
  centroidDraft: ICentroidRequest | null = null;
  targetPhotometryDraft: ITargetPhotometryRequest | null = null;
  private centroidDraftContext: ICentroidDraftContext | null = null;
  private targetPhotometryDraftContext: ITargetPhotometryDraftContext | null = null;
  private isCentroidDraftUserEdited = false;
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
    astrometryApertureRadius:
      'Aperture radius, in pixels, used for source photometry during astrometry and calibration.',
    astrometryCatalog:
      'Reference catalog queried for astrometric and photometric calibration objects.',
    astrometryObsBand: 'Filter band of the selected image observation.',
    astrometryCalBand: 'Catalog band used as the photometric calibration reference.',
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
      this.store$.select(selectApiDataCentroidRunsState),
      this.store$.select(selectApiDataCentroidizationState),
      this.store$.select(selectApiDataTargetPhotometryRunsState),
    ]).pipe(
      map(
        ([
          apiData,
          analysisSelectionState,
          activeDatum,
          astrometryRunsState,
          astrometryCentralizationState,
          centroidRunsState,
          centroidizationState,
          targetPhotometryRunsState,
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
                centroidRunsState[apiDatum.product_id],
                centroidizationState[apiDatum.product_id],
                targetPhotometryRunsState[apiDatum.product_id],
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
        this.refreshCentroidDraftFromFitsWcs();
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
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
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
      title: 'Astrometry Results',
      productId: item.productId,
      runId,
    };
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
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
    this.activeDetailView = {
      kind: 'astrometry-review',
      title: 'Astrometry Results',
      productId,
      runId,
    };
    this.lastOutputAutoscrollSignature = '';
  }

  closeDetailView(): void {
    this.activeDetailView = null;
    this.astrometryDraft = null;
    this.clearCentroidDraft();
    this.clearTargetPhotometryDraft();
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
      !this.isFiniteNumber(this.astrometryDraft.snr_threshold) ||
      !this.isFiniteNumber(this.astrometryDraft.aperture_radius)
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
      title: 'Astrometry Results',
      productId: item.productId,
      runId: nextRun.id,
    };
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

  toggleAstrometryCentralization(item: IAnalysisItem, run: IAstrometryRun): void {
    this.activateAnalysisItem(item);

    if (this.isAstrometryCentralizationApplied(item, run)) {
      this.store$.dispatch(
        ApiDataAction_RemoveAstrometryCentralization({ productId: item.productId }),
      );
      this.clearCentroidDraft();
      this.clearTargetPhotometryDraft();
      return;
    }

    const centerRaDeg = run.result?.astrometry.center_ra_deg;
    const centerDecDeg = run.result?.astrometry.center_dec_deg;

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
    this.initializeCentroidDraft(item, run, true);
    this.clearTargetPhotometryDraft();
    this.catToolsStack?.scrollDetailTargetIntoView(this.getCentroidInputScrollTarget(run));
  }

  launchCentroid(item: IAnalysisItem, run: IAstrometryRun): void {
    if (
      !this.centroidDraft ||
      !this.isCentroidSectionVisible(item, run) ||
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
        astrometryRunId: run.id,
        runId: simpleUid(),
        inputs,
        createdAt: new Date().toISOString(),
      }),
    );
  }

  isCentroidSectionVisible(item: IAnalysisItem, run: IAstrometryRun): boolean {
    return run.status === 'complete' && this.isAstrometryCentralizationApplied(item, run);
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

  getCentroidRuns(item: IAnalysisItem, run: IAstrometryRun): ICentroidRun[] {
    return this.getCentroidRunsForAstrometry(item, run);
  }

  hasSuccessfulCentroidRun(item: IAnalysisItem, run: IAstrometryRun): boolean {
    return this.getCentroidRuns(item, run).some(
      (centroidRun) => centroidRun.status === 'complete' && !!centroidRun.result,
    );
  }

  getCentroidInputHint(): string {
    if (!this.centroidDraft) {
      return '';
    }

    if (this.centroidDraft.target_x === 0 && this.centroidDraft.target_y === 0) {
      return (
        'Loading FITS WCS to initialize X/Y from astrometry RA/Dec. ' +
        'You can still click a FITS pixel to override.'
      );
    }

    return 'X/Y are initialized from astrometry RA/Dec; click a FITS pixel to override.';
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

  getAppliedCentroidRun(item: IAnalysisItem, run: IAstrometryRun): ICentroidRun | null {
    const centroidization = item.centroidization;
    if (!centroidization || centroidization.astrometryRunId !== run.id) {
      return null;
    }

    return (
      this.getCentroidRuns(item, run).find(
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

  getCatOutputImageUrl(path: string | null | undefined): string {
    const imagePath = path?.trim();
    if (!imagePath) {
      return '';
    }

    if (this.isDisplayableCatOutputImage(path)) {
      return imagePath;
    }

    return '';
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

  toggleCentroidization(item: IAnalysisItem, run: ICentroidRun): void {
    this.activateAnalysisItem(item);

    if (this.isCentroidizationApplied(item, run)) {
      this.store$.dispatch(ApiDataAction_RemoveCentroidization({ productId: item.productId }));
      this.clearTargetPhotometryDraft();
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
      {
        ...item,
        centroidization,
      },
      item.astrometryRuns.find((astrometryRun) => astrometryRun.id === run.astrometryRunId),
      true,
    );
    this.catToolsStack?.scrollDetailTargetIntoView(this.getTargetPhotometryInputScrollTarget(run));
  }

  private initializeCentroidDraftIfVisible(
    item: IAnalysisItem,
    run: IAstrometryRun | undefined,
  ): void {
    if (!run || !this.isCentroidSectionVisible(item, run)) {
      this.clearCentroidDraft();
      return;
    }

    this.initializeCentroidDraft(item, run, false);
  }

  private initializeCentroidDraft(
    item: IAnalysisItem,
    run: IAstrometryRun,
    forceReset: boolean,
  ): void {
    const context = { productId: item.productId, astrometryRunId: run.id };
    if (!forceReset && this.isSameCentroidDraftContext(context)) {
      this.refreshCentroidDraftFromFitsWcs();
      return;
    }

    this.centroidDraftContext = context;
    this.isCentroidDraftUserEdited = false;
    this.centroidDraft = this.createDefaultCentroidInputs(item, run);
    this.refreshCentroidDraftFromFitsWcs();
  }

  private createDefaultCentroidInputs(item: IAnalysisItem, run: IAstrometryRun): ICentroidRequest {
    const file = item.apiDatum.cutout_url || run.inputs.image_url || '';
    if (file) {
      this.fitsClickCoordinatesService.requestWorldToImageCoordinatesMapper(file);
    }

    const centerCoordinates = this.getCentralizedFitsPixelCoordinates(file, run);
    const fallbackCoordinates = this.latestFitsClickCoordinates;

    const draft = {
      file,
      target_x: this.roundPixelCoordinate(centerCoordinates?.imageX ?? fallbackCoordinates?.imageX),
      target_y: this.roundPixelCoordinate(centerCoordinates?.imageY ?? fallbackCoordinates?.imageY),
      search_radius: this.isFiniteNumber(run.inputs.aperture_radius)
        ? this.roundPixelCoordinate(run.inputs.aperture_radius)
        : 7,
      astrometry_center_x: this.roundOptionalPixelCoordinate(centerCoordinates?.imageX),
      astrometry_center_y: this.roundOptionalPixelCoordinate(centerCoordinates?.imageY),
    };

    this.logCentroidCoordinateDiagnostics('initial default', item, run, draft);

    return draft;
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

    const centroidRun = this.getAppliedCentroidRun(item, run);
    if (!centroidRun || !this.isTargetPhotometrySectionVisible(item, centroidRun)) {
      this.clearTargetPhotometryDraft();
      return;
    }

    this.initializeTargetPhotometryDraft(item, run, centroidRun, forceReset);
  }

  private initializeTargetPhotometryDraft(
    item: IAnalysisItem,
    astrometryRun: IAstrometryRun,
    centroidRun: ICentroidRun,
    forceReset: boolean,
  ): void {
    const context = {
      productId: item.productId,
      astrometryRunId: astrometryRun.id,
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

    if (run.result) {
      outputKeys.push(`astrometry-result:${run.id}`);
      target = this.isAstrometryCentralizationAvailable(run)
        ? this.getAstrometryCentralizationScrollTarget(run)
        : this.getAstrometryOutputScrollTarget(run);
    } else if (run.error) {
      outputKeys.push(`astrometry-error:${run.id}`);
      target = this.getAstrometryErrorScrollTarget(run);
    }

    for (const centroidRun of this.getCentroidRuns(item, run)) {
      if (centroidRun.result) {
        outputKeys.push(`centroid-result:${centroidRun.id}`);
        target = this.getCentroidOutputScrollTarget(centroidRun);
      } else if (centroidRun.error) {
        outputKeys.push(`centroid-error:${centroidRun.id}`);
        target = this.getCentroidOutputScrollTarget(centroidRun);
      }

      for (const photometryRun of this.getTargetPhotometryRuns(item, centroidRun)) {
        if (photometryRun.result) {
          outputKeys.push(`target-photometry-result:${photometryRun.id}`);
          target = this.getTargetPhotometryOutputScrollTarget(photometryRun);
        } else if (photometryRun.error) {
          outputKeys.push(`target-photometry-error:${photometryRun.id}`);
          target = this.getTargetPhotometryOutputScrollTarget(photometryRun);
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

    if (this.centroidDraft.file) {
      this.fitsClickCoordinatesService.requestWorldToImageCoordinatesMapper(
        this.centroidDraft.file,
      );
    }

    const centerCoordinates = this.getCentralizedFitsPixelCoordinates(
      this.centroidDraft.file,
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
    if (!coordinates || !this.centroidDraft || !this.isCentroidDraftActive()) {
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
      run.result?.astrometry.center_ra_deg,
      run.result?.astrometry.center_dec_deg,
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
    const file = draft.file;
    const rowRa = getNumberFromDatumOrCutoutUrl(item.apiDatum, 'ra');
    const rowDec = getNumberFromDatumOrCutoutUrl(item.apiDatum, 'dec');
    const resultRa = run.result?.astrometry.center_ra_deg;
    const resultDec = run.result?.astrometry.center_dec_deg;
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
      file,
      run: {
        id: run.id,
        sequence: run.sequence,
        status: run.status,
      },
      astrometryInputs: run.inputs,
      astrometryResult: run.result?.astrometry ?? null,
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

  private isSameCentroidDraftContext(context: ICentroidDraftContext): boolean {
    return (
      this.centroidDraftContext?.productId === context.productId &&
      this.centroidDraftContext?.astrometryRunId === context.astrometryRunId
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
      this.targetPhotometryDraftContext?.centroidRunId === context.centroidRunId
    );
  }

  private clearTargetPhotometryDraft(): void {
    this.targetPhotometryDraft = null;
    this.targetPhotometryDraftContext = null;
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
