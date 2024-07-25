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
import { IApiDatum } from 'src/app/models/IApiDatum';
import { ImageFetchService } from 'src/app/core/services/fetch-image/fetch-image.service';

@Component({
  selector: 'app-table-thumbnail',
  templateUrl: './table-thumbnail.component.html',
  styleUrls: ['./table-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableThumbnailComponent implements OnChanges {
  // --->>>

  @Input() element?: IApiDatum;
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
    // padding: '5px',
  };

  constructor(
    private imageFetchService: ImageFetchService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Update the size of the thumbnail
    this.imgStyles = {
      //
      ...this.imgStyles,
      width: this.width,
      height: this.height,
    };

    // Repeat request to image queue if isPriority changes
    if (changes['isPriority']?.currentValue) {
      this.isImageInQueue = false;
      if (this.element) this.loadImage(this.element);
    }

    // On component initialization, load the image
    if (changes['element']?.currentValue) {
      // if (this.label.includes('T1')) console.log(changes);
      this.isImageLoaded = false;
      this.isImageInQueue = false;
      this.loadImage(changes['element'].currentValue);
    }
  }

  private loadImage(element: IApiDatum): void {
    //

    // Prevent multiple calls to fetchImage
    if (this.isImageLoaded) return;
    if (this.isImageInQueue) return;
    this.isImageInQueue = true;

    const { product_id, ra, dec, preview_url } = element;
    const catalinaUrl =
      `https://5ub5yo2kmj.execute-api.us-east-1.amazonaws.com/api/images/` +
      // `https://uxzqjwo0ye.execute-api.us-west-1.amazonaws.com/api/images/` +
      // `https://ik6nf5q3ybiigiqe3kxo2iz7pi0dzoxe.lambda-url.us-west-1.on.aws/api/images/` +
      `${product_id}?dec=${dec}&ra=${ra}&size=5arcmin&format=jpeg`;
    const url = preview_url || catalinaUrl;

    this.imageFetchService
      .fetchImage(url, {
        isPriority: this.isPriority,
        label: this.label,
        minProcessTimeMs: 100,
      })
      .then(
        (img) => {
          this.imageSrc = img.src;
          this.isImageLoaded = true;
          this.isImageInQueue = false;
          // this.onLoadEventMessage.emit((element as any).num + '');
          // console.log('>> ', (element as any).num);
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
}
