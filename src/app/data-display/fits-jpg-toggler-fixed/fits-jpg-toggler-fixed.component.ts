import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, interval, map, Subscription } from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import { IApiFixum } from '../../../models/IApiFixum';
import {
  selectApiFixed,
  selectApiFixedStatus,
  selectApiSelectedFixum,
} from '../../ngrx/selectors/api-fixed.selectors';
import { ITableThumbnailInput } from '../table-thumbnail/table-thumbnail.component';

const placeholderUrl = 'assets/images/pngs/sbn_logo_v0.png';

@Component({
  selector: 'app-fits-jpg-toggler-fixed',
  templateUrl: './fits-jpg-toggler-fixed.component.html',
  styleUrls: ['./fits-jpg-toggler-fixed.component.scss'],
  standalone: false,
})
export class FitsJpgTogglerFixedComponent implements OnInit {
  // --->>>

  subscriptions = new Subscription();
  apiFixed?: IApiFixum[];
  apiSelectedFixum?: IApiFixum;
  // isFitsButtonDisabled = false;
  isButtonRaised = false;
  isFits = false;
  fitsUrl = '';
  widthPxls = 0;
  heightPxls = 0;
  isFitsLoaded = false;
  apiFixedWithProblematicFitsUrls: string[] = [];

  ra?: string;
  dec?: string;

  @ViewChild('FitsJpgTogglerContainer')
  carouselContainerDiv?: ElementRef<HTMLDivElement>;

  @ViewChild('mainImage')
  mainImageDiv?: ElementRef<HTMLDivElement>;

  constructor(private store$: Store<IAppState>) {
    // --->>

    this.subscriptions.add(
      this.store$.select(selectApiFixed).subscribe((apiFixed) => {
        this.apiFixed = apiFixed;
      })
    );

    this.subscriptions.add(
      this.store$
        .select(selectApiSelectedFixum)
        .subscribe((apiSelectedFixum) => {
          this.isFits = false;
          this.isButtonRaised = false;
          this.apiSelectedFixum = apiSelectedFixum;
          this.fitsUrl = this.apiSelectedFixum?.cutout_url || '';
        })
    );

    this.subscriptions.add(
      this.store$
        .select(selectApiFixedStatus)
        .pipe(distinctUntilChanged())
        .subscribe((apiFixedStatus) => {
          const { code, message, query } = apiFixedStatus;
          if (code === 'found') {
            const { ra, dec } = query!;
            this.ra = ra;
            this.dec = dec;
          }
        })
    );

    if (!false)
      this.subscriptions.add(
        interval(1000)
          .pipe(
            map((_) => ({
              width: this.mainImageDiv
                ? this.mainImageDiv.nativeElement.clientWidth
                : 100,
              height: this.mainImageDiv
                ? this.mainImageDiv.nativeElement.clientHeight
                : 100,
            })),
            distinctUntilChanged()
          )
          .subscribe(({ width, height }) => {
            this.widthPxls = width;
            this.heightPxls = height;
          })
      );
  }

  ngOnChanges() {
    //
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  chooseImage() {
    return this.apiSelectedFixum?.preview_url || placeholderUrl;
  }

  getThumbnailInput(): ITableThumbnailInput | undefined {
    // console.log('>>>', this.apiSelectedFixum, this.ra, this.dec);
    if (!this.apiSelectedFixum || !this.ra || !this.dec) return;

    const { preview_url, source, product_id } = this.apiSelectedFixum;

    return {
      ra: this.ra,
      dec: this.dec,
      product_id,
      preview_url: preview_url || placeholderUrl,
      source,
    };
  }

  toggleFits() {
    this.isFits = !this.isFits;
    if (!this.isFits) this.isButtonRaised = false;
  }

  onFitsLoadStatusUpdate(event: any) {
    console.log('event', event);
    if (event === 'error') {
      this.isFits = false;
      this.isButtonRaised = false;
      const product_id = this.apiSelectedFixum?.product_id;
      if (product_id) this.apiFixedWithProblematicFitsUrls.push(product_id);
    } else if (event === 'success') {
      this.isButtonRaised = true;
    } else {
      // this.isFits = false;
      this.isButtonRaised = false;
    }
  }

  isFitsButtonDisabled() {
    if (!this.fitsUrl) return true;
    return this.apiFixedWithProblematicFitsUrls.includes(
      this.apiSelectedFixum?.product_id || ''
    );
  }

  getLabel() {
    // Create a label for this image from the carousel
    this.apiSelectedFixum;
    const i = this.apiFixed
      ?.map((apiFixum) => apiFixum.product_id)
      .indexOf(this.apiSelectedFixum?.product_id || '');
    return '*C' + i;
  }
}
