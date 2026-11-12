import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, filter, Subscription, take } from 'rxjs';
import { NgxJs9Component, NgxJs9Module } from '../../../../projects/ngx-js9/src/public-api';
import { ThumbnailImageCacheService } from '../../core/services/thumbnail-image-cache/thumbnail-image-cache.service';
import { IAppState } from '../../ngrx/reducers';
import { selectApiDataAstrometryRunsState } from '../../ngrx/selectors/api-data.selectors';
import { selectActiveImageView } from '../../ngrx/selectors/active-image-view.selector';
import { FitsClickCoordinatesService } from './fits-click-coordinates.service';

/** CAT may inspect a solved WCS before applying it to the visible image pair.
 * Own that WCS separately so a coordinate lookup cannot replace the display.
 */
@Component({
  selector: 'app-fits-coordinate-loader',
  standalone: true,
  imports: [NgxJs9Module],
  template: `<lib-ngx-js9
    [fitsUrl]="file"
    [fitsBlob]="blob"
    [widthPxls]="100"
    [heightPxls]="212"
    [globalOpts]="{ menuBar: ['view', 'zoom', 'scale', 'color', 'region'], alerts: false }"
    (fitsLoadStatus)="onLoad($event)"
  ></lib-ngx-js9>`,
  styles: [
    ':host { position: absolute; left: -10000px; width: 100px; height: 212px; visibility: hidden; pointer-events: none; }',
  ],
  host: { 'aria-hidden': 'true' },
})
export class FitsCoordinateLoaderComponent implements OnDestroy {
  @ViewChild(NgxJs9Component) viewer?: NgxJs9Component;
  file = '';
  blob?: Blob;
  private allowed = new Set<string>();
  private visibleFile = '';
  private product = '';
  private loadingFile = '';
  private version = 0;
  private abort?: AbortController;
  private load = new Subscription();
  private subscriptions = new Subscription();

  constructor(
    store: Store<IAppState>,
    private images: ThumbnailImageCacheService,
    private coordinates: FitsClickCoordinatesService,
  ) {
    this.subscriptions.add(
      combineLatest([
        store.select(selectActiveImageView),
        store.select(selectApiDataAstrometryRunsState),
      ]).subscribe(([view, runs]) => {
        const product = view?.datum.product_id ?? '';
        this.visibleFile = view?.fitsUrl ?? '';
        this.allowed = new Set([
          view?.datum.cutout_url ?? '',
          ...(runs?.[product] ?? [])
            .filter((run) => run.status === 'complete')
            .map((run) => run.result?.wcs_image_url ?? ''),
        ]);
        const current = this.loadingFile || this.file;
        if (
          product !== this.product ||
          (current && (current === this.visibleFile || !this.allowed.has(current)))
        )
          this.cancelLoad();
        this.product = product;
      }),
    );
    this.subscriptions.add(
      coordinates.worldToImageCoordinatesRequest$.subscribe((file) => {
        if (file && file !== this.visibleFile && this.allowed.has(file)) this.request(file);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.cancelLoad();
  }

  onLoad(status: 'pending' | 'success' | 'error'): void {
    if (status === 'error') {
      this.coordinates.clearWorldToImageCoordinatesMapper(this.file);
      return;
    }
    if (status !== 'success' || !this.file) return;
    this.coordinates.setWorldToImageCoordinatesMapper(
      this.file,
      (ra, dec) => this.viewer?.getImageCoordinatesFromWorld(ra, dec) ?? null,
    );
    this.coordinates.setImageToWorldCoordinatesMapper(
      this.file,
      (x, y) => this.viewer?.getWorldCoordinatesFromImage(x, y) ?? null,
    );
  }

  private request(file: string): void {
    if (this.file === file || this.loadingFile === file) return;
    this.cancelLoad();
    const version = this.version;
    this.loadingFile = file;
    this.abort = new AbortController();
    this.load = this.images
      .loadImage$({ url: file, kind: 'fits', priority: 'high', signal: this.abort.signal })
      .pipe(
        filter((state) => state.status === 'success' || state.status === 'error'),
        take(1),
      )
      .subscribe((state) => {
        if (version !== this.version) return;
        this.loadingFile = '';
        if (state.status === 'success') {
          this.blob = state.blob;
          this.file = file;
        }
      });
  }

  private cancelLoad(): void {
    this.version++;
    this.abort?.abort();
    this.load.unsubscribe();
    const file = this.file;
    this.file = '';
    this.blob = undefined;
    this.loadingFile = '';
    if (file) this.coordinates.clearWorldToImageCoordinatesMapper(file);
  }
}
