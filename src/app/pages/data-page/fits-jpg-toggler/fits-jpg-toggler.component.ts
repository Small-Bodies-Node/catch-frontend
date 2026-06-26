import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IAppState } from '../../../ngrx/reducers';
import { IApiMovum } from '../../../../models/IApiMovum';
import {
  selectApiData,
  selectApiDataStatus,
  selectApiActiveDatum,
} from '../../../ngrx/selectors/api-data.selectors';
import { IApiFixum } from '../../../../models/IApiFixum';
import { TApiDataStatus } from '../../../../models/TApiDataStatus';
import { MatIcon } from '@angular/material/icon';
import {
  IJs9ImageClickCoordinates,
  NgxJs9Component,
  NgxJs9Module,
} from '../../../../../projects/ngx-js9/src/public-api';
import { PanstarrsOverlayComponent } from '../panstarrs-overlay/panstarrs-overlay.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { MatFabButton } from '@angular/material/button';
import { FitsClickCoordinatesService } from '../fits-click-coordinates.service';

@Component({
  selector: 'app-fits-jpg-toggler',
  templateUrl: './fits-jpg-toggler.component.html',
  styleUrls: ['./fits-jpg-toggler.component.scss'],
  imports: [
    //
    MatIcon,
    NgxJs9Module,
    MatProgressSpinner,
    PanstarrsOverlayComponent,
    NgClass,
    MatFabButton,
  ],
  standalone: true,
})
export class FitsJpgTogglerComponent implements AfterViewInit, OnDestroy {
  // --->>>

  subscriptions = new Subscription();
  apiData?: IApiMovum[] | IApiFixum[];
  apiDataStatus?: TApiDataStatus;
  apiActiveDatum?: IApiMovum | IApiFixum;
  isButtonRaised = false;
  isFits = false;
  desiredFitsUrl = '';
  viewerFitsUrl = '';
  widthPxls = 0;
  heightPxls = 0;
  isFitsLoaded = false;
  apiDataWithProblematicFitsUrls: string[] = [];
  isThumbnailReorientated = true;
  private loadingProductId = '';
  private requestedWorldToImageCoordinatesFile: string | null = null;
  private resizeObserver?: ResizeObserver;

  @ViewChild('FitsJpgTogglerContainer')
  fitsJpgTogglerContainer?: ElementRef<HTMLDivElement>;

  @ViewChild(NgxJs9Component)
  js9Component?: NgxJs9Component;

  constructor(
    private store$: Store<IAppState>,
    private fitsClickCoordinatesService: FitsClickCoordinatesService,
  ) {
    // --->>

    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData;
      }),
    );

    this.subscriptions.add(
      this.store$.select(selectApiDataStatus).subscribe((apiDataStatus) => {
        this.apiDataStatus = apiDataStatus;
        const { search } = apiDataStatus;
        if (!search) return;
        const { searchType } = search;
        this.isThumbnailReorientated = searchType === 'moving';
      }),
    );

    this.subscriptions.add(
      this.store$.select(selectApiActiveDatum).subscribe((apiActiveDatum) => {
        this.apiActiveDatum = apiActiveDatum;
        this.desiredFitsUrl = this.apiActiveDatum?.cutout_url || '';
        this.isFitsLoaded = this.viewerFitsUrl === this.desiredFitsUrl && !!this.viewerFitsUrl;
        if (!this.isFitsLoaded) {
          this.fitsClickCoordinatesService.clearCoordinates();
          this.fitsClickCoordinatesService.clearWorldToImageCoordinatesMapper();
        }

        if (this.isFitsButtonDisabled()) {
          if (this.isFits) {
            this.hideFitsViewer();
          }
          this.isButtonRaised = false;
          return;
        }

        if (!this.isFits && this.requestedWorldToImageCoordinatesFile !== this.desiredFitsUrl) {
          this.isButtonRaised = false;
          return;
        }

        this.requestFitsLoadForCurrentSelection();
      }),
    );

    this.subscriptions.add(
      this.fitsClickCoordinatesService.worldToImageCoordinatesRequest$.subscribe((file) => {
        this.requestedWorldToImageCoordinatesFile = file;
        if (!file || file !== this.desiredFitsUrl || this.isFitsButtonDisabled()) {
          return;
        }

        this.requestFitsLoadForCurrentSelection();
      }),
    );
  }

  ngAfterViewInit(): void {
    if (!this.fitsJpgTogglerContainer?.nativeElement) {
      return;
    }

    const container = this.fitsJpgTogglerContainer.nativeElement;
    this.updateViewerSize(container.clientWidth, container.clientHeight);

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.updateViewerSize(entry.contentRect.width, entry.contentRect.height);
    });
    this.resizeObserver.observe(container);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.resizeObserver?.disconnect();
  }

  toggleFits(): void {
    if (this.isFits) {
      this.hideFitsViewer();
      return;
    }

    if (this.isFitsButtonDisabled()) {
      return;
    }

    this.isFits = true;
    this.requestFitsLoadForCurrentSelection();
  }

  onFitsLoadStatusUpdate(event: 'pending' | 'success' | 'error'): void {
    if (event === 'error') {
      this.fitsClickCoordinatesService.clearWorldToImageCoordinatesMapper();
      if (
        this.loadingProductId &&
        !this.apiDataWithProblematicFitsUrls.includes(this.loadingProductId)
      ) {
        this.apiDataWithProblematicFitsUrls.push(this.loadingProductId);
      }
      this.isFitsLoaded = false;
      this.hideFitsViewer();
    } else if (event === 'success') {
      this.isFitsLoaded = this.viewerFitsUrl === this.desiredFitsUrl && !!this.viewerFitsUrl;
      this.isButtonRaised = this.isFits && this.isFitsLoaded;
      if (this.viewerFitsUrl) {
        this.fitsClickCoordinatesService.setWorldToImageCoordinatesMapper(
          this.viewerFitsUrl,
          (ra, dec) => {
            const coords = this.js9Component?.getImageCoordinatesFromWorld(ra, dec);
            return coords
              ? {
                  imageX: coords.imageX,
                  imageY: coords.imageY,
                  wcsPixelX: coords.wcsPixelX,
                  wcsPixelY: coords.wcsPixelY,
                  wcsPixelAsPhysicalX: coords.wcsPixelAsPhysicalX,
                  wcsPixelAsPhysicalY: coords.wcsPixelAsPhysicalY,
                  wcsPixelAsImageX: coords.wcsPixelAsImageX,
                  wcsPixelAsImageY: coords.wcsPixelAsImageY,
                  wcsString: coords.wcsString,
                }
              : null;
          },
        );
        this.fitsClickCoordinatesService.setImageToWorldCoordinatesMapper(
          this.viewerFitsUrl,
          (imageX, imageY) =>
            this.js9Component?.getWorldCoordinatesFromImage(imageX, imageY) ?? null,
        );
      }
    } else {
      this.fitsClickCoordinatesService.clearCoordinates();
      this.fitsClickCoordinatesService.clearWorldToImageCoordinatesMapper();
      this.isFitsLoaded = false;
      this.isButtonRaised = false;
    }
  }

  onFitsImageClick(coordinates: IJs9ImageClickCoordinates): void {
    this.fitsClickCoordinatesService.setCoordinates(coordinates);
  }

  isFitsButtonDisabled(): boolean {
    if (!this.desiredFitsUrl) return true;
    return this.apiDataWithProblematicFitsUrls.includes(this.apiActiveDatum?.product_id || '');
  }

  getLabel() {
    // Create a label for this image from the carousel
    this.apiActiveDatum;
    const i = this.apiData
      ?.map((apiDatum) => apiDatum.product_id)
      .indexOf(this.apiActiveDatum?.product_id || '');
    return '*C' + i;
  }

  /**
   * Switching off pansstarrs for fixed for now because too confusing with orientations of images being all over the place
   */
  isPanstarrsOverlay() {
    if (!this.apiDataStatus) return false;
    const { search } = this.apiDataStatus;
    if (!search) return false;
    const { searchType } = search;
    return searchType === 'moving';
  }

  private hideFitsViewer(): void {
    this.isFits = false;
    this.isButtonRaised = false;
  }

  private requestFitsLoadForCurrentSelection(): void {
    if (!this.desiredFitsUrl) {
      this.isFitsLoaded = false;
      this.isButtonRaised = false;
      return;
    }

    if (this.viewerFitsUrl === this.desiredFitsUrl && this.isFitsLoaded) {
      this.isButtonRaised = this.isFits;
      return;
    }

    this.loadingProductId = this.apiActiveDatum?.product_id || '';
    this.viewerFitsUrl = this.desiredFitsUrl;
    this.isFitsLoaded = false;
    this.isButtonRaised = false;
  }

  private updateViewerSize(width: number, height: number): void {
    const squareSize = Math.floor(Math.min(width, height));
    this.widthPxls = squareSize;
    this.heightPxls = squareSize;
  }
}
