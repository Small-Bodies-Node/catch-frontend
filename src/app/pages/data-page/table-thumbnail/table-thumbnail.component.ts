import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { ImageFetchService } from '../../../core/services/fetch-image/fetch-image.service';
import { IApiMovum } from '../../../../models/IApiMovum';
import { IApiFixum } from '../../../../models/IApiFixum';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgStyle } from '@angular/common';
import { getTableThumbnailSurveyScaleTransform } from '../../../../utils/image-orientation';
import { nativePreviewUrl } from '../../../../utils/nativePreviewUrl';
// import { colog } from '../../../utils/colog';

@Component({
  selector: 'app-table-thumbnail',
  templateUrl: './table-thumbnail.component.html',
  styleUrls: ['./table-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinner, NgStyle],
  standalone: true,
})
export class TableThumbnailComponent implements OnChanges, OnDestroy {
  // --->>>

  // Required inputs
  @Input() apiDatum!: IApiMovum | IApiFixum;
  @Input() previewUrl?: string | null;
  @Input() label!: string;
  @Input() priority!: 'vip' | 'nip';

  @Input() width: string = '60px';
  @Input() height: string = '60px';
  @Input() diameterPxls: number = 30;
  @Input() isReorientated = false;

  imageSrc?: string;
  isImageInQueue: boolean = false;
  readonly placeholderImage: string = 'assets/images/placeholder.png';
  private loadVersion = 0;
  private loadAbort?: AbortController;

  constructor(
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priority'] || changes['label'] || changes['apiDatum'] || changes['previewUrl']) {
      if (!this.priority || !this.label || !this.apiDatum) return;
      this.isImageInQueue = true;
      this.loadImage();
    }
  }

  ngOnDestroy(): void {
    this.loadVersion++;
    this.loadAbort?.abort();
  }

  private loadImage(): void {
    const version = ++this.loadVersion;
    const previousAbort = this.loadAbort;
    this.loadAbort = new AbortController();
    const preview_url =
      this.previewUrl ?? nativePreviewUrl(this.apiDatum.preview_url, this.apiDatum.cutout_url);
    if (!preview_url) {
      previousAbort?.abort();
      this.imageSrc = this.placeholderImage;
      this.isImageInQueue = false;
      this.changeDetector.detectChanges();
      return;
    }

    this.imageFetchService
      .fetchImage(preview_url, {
        isPriority: this.priority === 'vip',
        label: this.label,
        signal: this.loadAbort.signal,
      })
      .then((objUrl) => {
        if (version !== this.loadVersion) return;
        this.imageSrc = objUrl || this.placeholderImage;
        this.isImageInQueue = false;
        this.changeDetector.detectChanges();
      })
      .catch((_) => {
        if (version !== this.loadVersion) return;
        this.isImageInQueue = false;
        this.imageSrc = this.placeholderImage;
        this.changeDetector.detectChanges();
      });
    previousAbort?.abort();
  }

  /**
   * Some surveys need to be flipped, etc. to have ra and dec increase +ve in consistent dirn
   */
  getSurveyScaleTransform() {
    return getTableThumbnailSurveyScaleTransform(this.apiDatum?.source, this.isReorientated);
  }

  getStyles() {
    return {
      width: !false ? this.width : 'auto',
      height: !false ? this.height : 'auto',
      transform: this.getSurveyScaleTransform(),
    };
  }
}
