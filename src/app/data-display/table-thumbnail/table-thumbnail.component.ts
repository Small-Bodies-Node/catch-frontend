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
import { IApiDatum } from '../../../models/IApiDatum';
import { ImageFetchService } from '../../core/services/fetch-image/fetch-image.service';

@Component({
  selector: 'app-table-thumbnail',
  templateUrl: './table-thumbnail.component.html',
  styleUrls: ['./table-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableThumbnailComponent implements OnChanges {
  // --->>>

  @Input() apiDatum?: IApiDatum;
  @Input() size: string = '60px';
  @Input() width: string = '60px';
  @Input() height: string = '60px';
  @Input() isPriority = false;
  @Input() label = '-';
  @Input() diameterPxls: number = 30;

  imageSrc: string | undefined;
  isImageLoaded: boolean = false; // Controls spinner
  isImageInQueue: boolean = false; // Prevents duplicate calls to fetchImage

  @Output() onLoadEventMessage = new EventEmitter<string>();

  // Control size of thumbnail and loading spinner
  imgStyles = {
    width: `${this.width}`,
    height: `${this.height}`,
    transform: this.getSurveyScaleTransform(),
  };

  constructor(
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Update the size of the thumbnail
    const trans = this.getSurveyScaleTransform();
    this.imgStyles = {
      //
      ...this.imgStyles,
      width: this.width,
      height: this.height,
      transform: this.getSurveyScaleTransform(),
    };

    // Repeat request to image queue if isPriority changes
    if (changes['isPriority']?.currentValue) {
      this.isImageInQueue = false;
      if (this.apiDatum) this.loadImage(this.apiDatum);
    }

    // On component initialization, load the image
    if (changes['apiDatum']?.currentValue) {
      // if (this.label.includes('T1')) console.log(changes);
      this.isImageLoaded = false;
      this.isImageInQueue = false;
      this.loadImage(changes['apiDatum'].currentValue);
    }
  }

  private loadImage(apiDatum: IApiDatum): void {
    //

    // Prevent multiple calls to fetchImage
    if (this.isImageLoaded) return;
    if (this.isImageInQueue) return;
    this.isImageInQueue = true;

    const { product_id, ra, dec, preview_url } = apiDatum;
    const catalinaUrl =
      // `https://5ub5yo2kmj.execute-api.us-east-1.amazonaws.com/api/images/` +
      `https://uxzqjwo0ye.execute-api.us-west-1.amazonaws.com/api/images/` +
      // `https://ik6nf5q3ybiigiqe3kxo2iz7pi0dzoxe.lambda-url.us-west-1.on.aws/api/images/` +
      `${product_id}?dec=${dec}&ra=${ra}&size=5arcmin&format=jpeg`;
    const url = preview_url || catalinaUrl;

    this.imageFetchService
      .fetchImage(url, {
        isPriority: this.isPriority,
        label: this.label,
        minProcessTimeMs: 3000,
      })
      .then(
        (objUrl) => {
          this.imageSrc = objUrl;
          this.isImageLoaded = true;
          this.isImageInQueue = false;
          this.changeDetector.detectChanges();
        },
        (error) => {
          console.error('The following image failed:', url);
          console.error(' ... due to error:', error);
          this.isImageLoaded = true;
          this.isImageInQueue = false;
          this.imageSrc = 'assets/images/pngs/sbn_logo_v0.png';
        }
      )
      .catch((_) => {
        // ...
        console.log('The following URL failed:', url);
      });
  }

  /**
   * Some surveys need to be flipped, etc. to have ra and dec increase +ve in consistent dirn
   */
  getSurveyScaleTransform() {
    // console.log('>>>', !this.apiDatum);
    if (!this.apiDatum) return 'scale(1, 1)';
    if (this.apiDatum.source === 'neat_palomar_tricam') {
      // return 'scale(1, 1)';
      return 'scale(-1, -1)';
      // return 'rotate(-90deg)';
    }
    if (this.apiDatum.source === 'neat_maui_geodss') {
      return 'scale(1, -1)';
      // return 'rotate(90deg)';
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
      return 'scale(-1, 1)';
      // return 'rotate(180deg)';
    }

    return 'scale(1, 1)';
  }
}
