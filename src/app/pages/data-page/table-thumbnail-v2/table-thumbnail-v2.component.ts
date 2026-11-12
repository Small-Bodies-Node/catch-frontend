import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

import { IApiFixum } from '../../../../models/IApiFixum';
import { IApiMovum } from '../../../../models/IApiMovum';
import { getTableThumbnailSurveyScaleTransform } from '../../../../utils/image-orientation';
import { nativePreviewUrl } from '../../../../utils/nativePreviewUrl';
import { ThumbnailImageCacheService } from '../../../core/services/thumbnail-image-cache/thumbnail-image-cache.service';
import { ThumbnailImageState } from '../../../core/services/thumbnail-image-cache/thumbnail-image.types';

@Component({
  selector: 'app-table-thumbnail-v2',
  templateUrl: './table-thumbnail-v2.component.html',
  styleUrls: ['./table-thumbnail-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinner, MatTooltip, NgStyle],
  standalone: true,
})
export class TableThumbnailV2Component implements OnChanges, OnDestroy {
  @Input() apiDatum!: IApiMovum | IApiFixum;
  @Input() previewUrl?: string | null;
  @Input() label!: string;
  @Input() priority!: 'vip' | 'nip';

  @Input() width = '60px';
  @Input() height = '60px';
  @Input() diameterPxls = 30;
  @Input() isReorientated = false;

  readonly placeholderImage = 'assets/images/placeholder.png';

  imageState: ThumbnailImageState = { status: 'idle' };
  private loadSubscription?: Subscription;
  private loadRequestId = 0;
  private retryNonce = 0;

  constructor(
    private thumbnailImageCacheService: ThumbnailImageCacheService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priority'] || changes['label'] || changes['apiDatum'] || changes['previewUrl']) {
      if (!this.priority || !this.label || !this.apiDatum) return;
      this.loadImage(false);
    }
  }

  ngOnDestroy(): void {
    this.loadRequestId++;
    this.loadSubscription?.unsubscribe();
  }

  retryImage(event: MouseEvent): void {
    event.stopPropagation();
    this.retryNonce++;
    this.loadImage(true);
  }

  getWrapperStyles() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  getImageStyles() {
    return {
      ...this.getWrapperStyles(),
      transform: getTableThumbnailSurveyScaleTransform(this.apiDatum?.source, this.isReorientated),
    };
  }

  private loadImage(forceRefresh: boolean): void {
    const previewUrl = (
      this.previewUrl ?? nativePreviewUrl(this.apiDatum.preview_url, this.apiDatum.cutout_url)
    ).trim();
    if (!previewUrl) {
      this.loadRequestId++;
      this.loadSubscription?.unsubscribe();
      this.imageState = {
        status: 'error',
        originalUrl: '',
        bucketId: 'missing',
        message: 'No thumbnail URL is available.',
      };
      this.changeDetector.markForCheck();
      return;
    }

    const previousSubscription = this.loadSubscription;
    const requestId = ++this.loadRequestId;
    this.imageState = {
      status: 'loading',
      originalUrl: previewUrl,
      bucketId: 'pending',
    };

    this.loadSubscription = this.thumbnailImageCacheService
      .loadImage$({
        url: previewUrl,
        source: this.apiDatum.source,
        sourceName: this.apiDatum.source_name,
        label: `${this.label}:${this.retryNonce}`,
        priority: this.priority === 'vip' ? 'high' : 'normal',
        forceRefresh,
      })
      .subscribe((imageState) => {
        if (requestId !== this.loadRequestId) return;
        this.imageState = imageState;
        this.changeDetector.markForCheck();
      });
    // A priority/label change may retain the same URL. Acquire it before releasing
    // the old subscription so a shared fetch is promoted rather than restarted.
    previousSubscription?.unsubscribe();
  }
}
