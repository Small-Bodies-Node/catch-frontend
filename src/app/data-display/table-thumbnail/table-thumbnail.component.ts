import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ImageFetchService } from '../../core/services/fetch-image/fetch-image.service';
import { IApiMovum } from '../../../models/IApiMovum';
import { IApiFixum } from '../../../models/IApiFixum';
import { colog } from '../../../utils/colog';

@Component({
  selector: 'app-table-thumbnail',
  templateUrl: './table-thumbnail.component.html',
  styleUrls: ['./table-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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

  @Output() onLoadEventMessage = new EventEmitter<string>();

  imageSrc?: string;
  isImageInQueue: boolean = false;
  readonly placeholderImage: string = 'assets/images/placeholder.png';

  constructor(
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef
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
    if (!preview_url) return;

    this.imageFetchService
      .fetchImage(preview_url, {
        isPriority: this.priority === 'vip',
        label: this.label,
      })
      .then(
        (objUrl) => {
          this.imageSrc = objUrl || this.placeholderImage;
          // this.isImageLoaded = true;
          this.isImageInQueue = false;
          this.changeDetector.detectChanges();
        },
        (error) => {
          this.isImageInQueue = false;
          this.imageSrc = this.placeholderImage;
        }
      )
      .catch((_) => {
        console.log('The following URL failed:', preview_url);
      });
  }

  /**
   * Some surveys need to be flipped, etc. to have ra and dec increase +ve in consistent dirn
   */
  getSurveyScaleTransform() {
    // return 'scale(1, 1)';
    if (!this.isReorientated) return 'scale(1, 1)';
    if (!this.apiDatum) return 'scale(1, 1)';
    if (this.apiDatum.source.includes('neat')) {
      return 'scale(1, 1)';
      // return 'scale(-1, -1)';
      // return 'rotate(-90deg)';
    }
    if (this.apiDatum.source.includes('atlas')) {
      return 'scale(1, 1)';
      // return 'scale(-1, 1)';
      // return 'rotate(-90deg)';
    }
    if (this.apiDatum.source === 'loneos') {
      return 'scale(-1, -1)';
    }
    if (this.apiDatum.source === 'skymapper_dr4') {
      // return 'scale(-1, -1)';
      return 'rotate(180deg)';
    }
    if (this.apiDatum.source === 'ps1dr2') {
      return 'scale(-1, -1)';
      // return 'rotate(180deg)';
    }
    if (this.apiDatum.source === 'spacewatch') {
      return 'scale(-1, 1)';
      // return 'rotate(180deg)';
    }
    if (
      [
        //
        'catalina_bigelow',
        'catalina_lemmon',
        'catalina_bokneosurvey',
      ].includes(this.apiDatum.source)
    ) {
      return 'scale(-1, -1)';
      // return 'rotate(180deg)';
    }

    return 'scale(1, 1)';
  }

  getStyles() {
    return {
      width: !false ? this.width : 'auto',
      height: !false ? this.height : 'auto',
      transform: this.getSurveyScaleTransform(),
    };
  }
}
