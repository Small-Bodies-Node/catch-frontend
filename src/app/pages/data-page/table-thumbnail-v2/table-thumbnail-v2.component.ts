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
    if (changes['priority'] || changes['label'] || changes['apiDatum']) {
      if (!this.priority || !this.label || !this.apiDatum) return;
      this.loadImage(false);
    }
  }

  ngOnDestroy(): void {
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
    const previewUrl = this.apiDatum.preview_url?.trim();
    if (!previewUrl) {
      this.imageState = {
        status: 'error',
        originalUrl: '',
        bucketId: 'missing',
        message: 'No thumbnail URL is available.',
      };
      this.changeDetector.markForCheck();
      return;
    }

    this.loadSubscription?.unsubscribe();
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
  }
}
