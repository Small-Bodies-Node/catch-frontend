import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ImageFetchService } from '../../../core/services/fetch-image/fetch-image.service';
import { IApiMovum } from '../../../../models/IApiMovum';
import { IApiFixum } from '../../../../models/IApiFixum';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgStyle } from '@angular/common';
import { getTableThumbnailSurveyScaleTransform } from '../../../../utils/image-orientation';
// import { colog } from '../../../utils/colog';

@Component({
  selector: 'app-table-thumbnail',
  templateUrl: './table-thumbnail.component.html',
  styleUrls: ['./table-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinner, NgStyle],
  standalone: true,
})
export class TableThumbnailComponent implements OnChanges {
  // --->>>

  // Required inputs
  @Input() apiDatum!: IApiMovum | IApiFixum;
  @Input() label!: string;
  @Input() priority!: 'vip' | 'nip';

  @Input() width: string = '60px';
  @Input() height: string = '60px';
  @Input() diameterPxls: number = 30;
  @Input() isReorientated = false;

  imageSrc?: string;
  isImageInQueue: boolean = false;
  readonly placeholderImage: string = 'assets/images/placeholder.png';

  constructor(
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priority'] || changes['label'] || changes['apiDatum']) {
      if (!this.priority || !this.label || !this.apiDatum) return;
      if (!this.isImageInQueue || changes['priority']) {
        this.isImageInQueue = true;
        this.loadImage();
      }
    }
  }

  private loadImage(): void {
    const { preview_url } = this.apiDatum;
    if (!preview_url) {
      this.imageSrc = this.placeholderImage;
      this.isImageInQueue = false;
      this.changeDetector.detectChanges();
      return;
    }

    this.imageFetchService
      .fetchImage(preview_url, {
        isPriority: this.priority === 'vip',
        label: this.label,
      })
      .then((objUrl) => {
        this.imageSrc = objUrl || this.placeholderImage;
        this.isImageInQueue = false;
        this.changeDetector.detectChanges();
      })
      .catch((_) => {
        this.isImageInQueue = false;
        this.imageSrc = this.placeholderImage;
        this.changeDetector.detectChanges();
      });
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
