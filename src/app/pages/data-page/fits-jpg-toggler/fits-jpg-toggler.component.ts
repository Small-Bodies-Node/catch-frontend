import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, forkJoin, filter, take, catchError, of } from 'rxjs';
import { IAppState } from '../../../ngrx/reducers';
import { IApiMovum } from '../../../../models/IApiMovum';
import { IApiFixum } from '../../../../models/IApiFixum';
import { selectApiData } from '../../../ngrx/selectors/api-data.selectors';
import { FitsCoordinateLoaderComponent } from '../fits-coordinate-loader.component';
import { selectActiveImageView } from '../../../ngrx/selectors/active-image-view.selector';
import {
  IJs9ImageClickCoordinates,
  NgxJs9Component,
  NgxJs9Module,
} from '../../../../../projects/ngx-js9/src/public-api';
import { PanstarrsOverlayComponent } from '../panstarrs-overlay/panstarrs-overlay.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { northArrowAngle } from '../../../../utils/northArrowAngle';
import { FitsClickCoordinatesService } from '../fits-click-coordinates.service';
import { ImageWcsService, IWcs } from '../../../core/services/image-wcs/image-wcs.service';
import { ThumbnailImageCacheService } from '../../../core/services/thumbnail-image-cache/thumbnail-image-cache.service';

@Component({
  selector: 'app-fits-jpg-toggler',
  templateUrl: './fits-jpg-toggler.component.html',
  styleUrls: ['./fits-jpg-toggler.component.scss'],
  imports: [
    NgxJs9Module,
    MatProgressSpinner,
    PanstarrsOverlayComponent,
    FitsCoordinateLoaderComponent,
    MatFabButton,
    MatIcon,
  ],
  standalone: true,
})
export class FitsJpgTogglerComponent implements AfterViewInit, OnDestroy {
  subscriptions = new Subscription();
  apiData?: IApiMovum[] | IApiFixum[];
  apiActiveDatum?: IApiMovum | IApiFixum;
  isFits = false;
  desiredFitsUrl = '';
  viewerFitsUrl = '';
  fitsBlob?: Blob;
  previewWcs?: IWcs;
  previewUrl = '';
  widthPxls = 0;
  heightPxls = 0;
  isFitsLoaded = false;
  fitsError = '';
  viewTransform = 'none';
  northAngle: number | null = null;
  viewport?: { top: number; left: number; width: number; height: number };
  private loadSubscription = new Subscription();
  private loadVersion = 0;
  private loadAbort?: AbortController;
  private loadingUrl = '';
  private resizeObserver?: ResizeObserver;
  private previewWcsSubscription = new Subscription();
  private indicatorWcs?: IWcs;

  @ViewChild('FitsJpgTogglerContainer') fitsJpgTogglerContainer?: ElementRef<HTMLDivElement>;
  @ViewChild(NgxJs9Component) js9Component?: NgxJs9Component;

  constructor(
    private store$: Store<IAppState>,
    private coordinates: FitsClickCoordinatesService,
    private images: ThumbnailImageCacheService,
    private wcs: ImageWcsService,
  ) {
    this.subscriptions.add(store$.select(selectApiData).subscribe((data) => (this.apiData = data)));
    this.subscriptions.add(
      store$.select(selectActiveImageView).subscribe((view) => {
        if (
          this.desiredFitsUrl === (view?.fitsUrl ?? '') &&
          this.previewUrl === (view?.previewUrl ?? '') &&
          this.apiActiveDatum?.product_id === view?.datum.product_id
        )
          return;
        this.loadVersion++;
        this.loadAbort?.abort();
        this.loadSubscription.unsubscribe();
        this.loadingUrl = '';
        this.apiActiveDatum = view?.datum;
        this.desiredFitsUrl = view?.fitsUrl ?? '';
        this.previewUrl = view?.previewUrl ?? '';
        this.fitsError = '';
        this.viewTransform = 'none';
        this.isFitsLoaded = false;
        this.viewerFitsUrl = '';
        this.fitsBlob = undefined;
        this.previewWcs = undefined;
        this.indicatorWcs = undefined;
        this.northAngle = null;
        this.previewWcsSubscription.unsubscribe();
        if (this.previewUrl) {
          this.previewWcsSubscription = this.wcs
            .getWcsObservable(this.previewUrl)
            .pipe(
              take(1),
              catchError(() => of(undefined)),
            )
            .subscribe((wcs) => {
              this.indicatorWcs = wcs;
              this.onViewChanged();
            });
        }
        this.coordinates.clearCoordinates();
        this.coordinates.clearWorldToImageCoordinatesMapper();
        if (this.isFits) this.requestFitsLoad(this.desiredFitsUrl, this.previewUrl);
      }),
    );
    this.subscriptions.add(
      coordinates.worldToImageCoordinatesRequest$.subscribe((file) => {
        if (!file) return;
        if (file === this.desiredFitsUrl) this.requestFitsLoad(file, this.previewUrl);
      }),
    );
  }

  ngAfterViewInit(): void {
    const container = this.fitsJpgTogglerContainer?.nativeElement;
    if (!container) return;
    this.updateViewerSize(container.clientWidth, container.clientHeight);
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(([entry]) =>
      this.updateViewerSize(entry.contentRect.width, entry.contentRect.height),
    );
    this.resizeObserver.observe(container);
  }
  ngOnDestroy(): void {
    this.loadVersion++;
    this.loadAbort?.abort();
    this.loadSubscription.unsubscribe();
    this.subscriptions.unsubscribe();
    this.resizeObserver?.disconnect();
    this.previewWcsSubscription.unsubscribe();
    this.coordinates.clearWorldToImageCoordinatesMapper(this.viewerFitsUrl);
  }
  showPreview(): void {
    this.isFits = false;
    this.onViewChanged();
  }
  showFits(): void {
    if (!this.desiredFitsUrl) return;
    this.isFits = true;
    this.requestFitsLoad(this.desiredFitsUrl, this.previewUrl);
  }
  toggleFits(): void {
    if (this.isFits) this.showPreview();
    else this.showFits();
  }
  onImageViewport(viewport: { top: number; left: number; width: number; height: number }): void {
    this.viewport = viewport;
    this.onViewChanged();
  }

  onViewChanged(): void {
    if (!this.isFits) {
      this.viewTransform = this.isFitsLoaded
        ? (this.js9Component?.getPreviewTransform({
            width: this.widthPxls,
            height: this.heightPxls,
          }) ?? 'none')
        : 'none';
    }
    this.northAngle = this.isFitsLoaded
      ? (this.js9Component?.getNorthAngle() ?? null)
      : this.indicatorWcs
        ? northArrowAngle(this.indicatorWcs)
        : null;
  }

  onFitsLoadStatusUpdate(status: 'pending' | 'success' | 'error'): void {
    this.isFitsLoaded = status === 'success';
    this.onViewChanged();
    if (status === 'error') {
      this.fitsError = 'FITS could not be loaded. Select FITS to retry.';
      this.coordinates.clearWorldToImageCoordinatesMapper(this.viewerFitsUrl);
      return;
    }
    if (status !== 'success' || !this.viewerFitsUrl) return;
    this.coordinates.setWorldToImageCoordinatesMapper(
      this.viewerFitsUrl,
      (ra, dec) => this.js9Component?.getImageCoordinatesFromWorld(ra, dec) ?? null,
    );
    this.coordinates.setImageToWorldCoordinatesMapper(
      this.viewerFitsUrl,
      (x, y) => this.js9Component?.getWorldCoordinatesFromImage(x, y) ?? null,
    );
  }
  onFitsImageClick(coordinates: IJs9ImageClickCoordinates): void {
    this.coordinates.setCoordinates({
      ...coordinates,
      file: this.viewerFitsUrl,
      productId: this.apiActiveDatum?.product_id,
      coordinateSource: 'fits-viewer',
    });
  }

  private requestFitsLoad(file: string, preview: string): void {
    if (!file || (file === this.viewerFitsUrl && this.isFitsLoaded) || file === this.loadingUrl)
      return;
    this.loadSubscription.unsubscribe();
    const version = ++this.loadVersion;
    this.loadAbort?.abort();
    this.loadAbort = new AbortController();
    this.loadingUrl = file;
    this.coordinates.clearWorldToImageCoordinatesMapper(this.viewerFitsUrl);
    this.isFitsLoaded = false;
    this.fitsError = '';
    this.viewerFitsUrl = '';
    this.loadSubscription = forkJoin({
      image: this.images
        .loadImage$({ url: file, kind: 'fits', priority: 'high', signal: this.loadAbort.signal })
        .pipe(
          filter((state) => state.status === 'success' || state.status === 'error'),
          take(1),
        ),
      wcs: preview
        ? this.wcs.getWcsObservable(preview).pipe(
            take(1),
            catchError(() => of(undefined)),
          )
        : of(undefined),
    }).subscribe(({ image, wcs }) => {
      if (version !== this.loadVersion) return;
      this.loadingUrl = '';
      if (image.status !== 'success') {
        this.fitsError = 'FITS could not be loaded. Select FITS to retry.';
        return;
      }
      this.fitsBlob = image.blob;
      this.previewWcs = wcs;
      // Recreate the JS9 component on retry and selection, including same-URL retry.
      this.viewerFitsUrl = file;
    });
  }
  private updateViewerSize(width: number, height: number): void {
    this.widthPxls = Math.floor(width);
    this.heightPxls = Math.floor(height);
    this.onViewChanged();
  }
}
