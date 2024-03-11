import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, interval, map, Subscription, take } from 'rxjs';

import { IApiDatum } from 'src/app/models/IApiDatum';
import { ApiSetSelectedDatum } from 'src/app/ngrx/actions/api.actions';
import { IAppState } from 'src/app/ngrx/reducers';
import {
  selectApiData,
  selectApiSelectedDatum,
} from 'src/app/ngrx/selectors/api.selectors';

const placeholderUrl = 'assets/images/pngs/sbn_logo_v0.png';

@Component({
  selector: 'app-image-wheel',
  templateUrl: './image-wheel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./image-wheel.component.scss'],
})
export class ImageWheelComponent implements OnInit {
  // --->>>

  @ViewChild('imageWheelContainer')
  imageWheelContainerDiv?: ElementRef<HTMLDivElement>;

  apiData?: IApiDatum[];
  apiSelectedDatum?: IApiDatum;
  subscriptions = new Subscription();

  height = 100;
  width = 100;
  imageWheelMarginRightPxl = 5;

  constructor(
    private store$: Store<IAppState>,
    private changeDetector: ChangeDetectorRef
  ) {
    // --->>

    this.subscriptions.add(
      this.store$.select(selectApiData).subscribe((apiData) => {
        this.apiData = apiData;
      })
    );

    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedDatum)
        .subscribe((apiSelectedDatum) => {
          this.apiSelectedDatum = apiSelectedDatum;
          if (!this.apiData || !apiSelectedDatum) return;
          const rowOfApiSelectedDatum: number = this.apiData
            .map((apiDatum) => apiDatum.product_id)
            .indexOf(apiSelectedDatum.product_id);
          if (this.imageWheelContainerDiv) {
            this.imageWheelContainerDiv.nativeElement.scrollTo({
              top: 0,
              left:
                rowOfApiSelectedDatum *
                (this.width + this.imageWheelMarginRightPxl),
              behavior: 'smooth',
            });
          }
          this.changeDetector.detectChanges();
        })
    );

    this.subscriptions.add(
      interval(1000)
        .pipe(
          map((_) => ({
            height: this.imageWheelContainerDiv
              ? this.imageWheelContainerDiv.nativeElement.clientHeight
              : 100,
          })),
          distinctUntilChanged()
        )
        .subscribe(({ height }) => {
          this.width = height;
          this.height = height;
        })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getImageUrls() {
    if (!this.apiData) return [];
    const imageUrls = this.apiData.map(
      (el) => el.preview_url || placeholderUrl
    );
    return imageUrls;
  }

  getStyleObject(apiDatum: IApiDatum) {
    const imageUrl = apiDatum.preview_url || placeholderUrl;
    return {
      // backgroundImage: `url('${imageUrl || placeholderUrl}')`,
      width: this.width + 'px',
      marginRight: this.imageWheelMarginRightPxl + 'px',
    };
  }

  isImageSelected(apiDatum: IApiDatum) {
    if (!apiDatum || !this.apiSelectedDatum) return false;
    return apiDatum.product_id === this.apiSelectedDatum.product_id;
  }

  setSelectedDatum(apiDatum: IApiDatum) {
    this.store$.dispatch(new ApiSetSelectedDatum({ apiDatum }));
    this.changeDetector.detectChanges();
  }

  rerenderWheel($event: string) {
    // this.message = $event;
    // console.log('>>> ', $event);
    this.changeDetector.detectChanges();
  }
}
