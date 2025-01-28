import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, interval, map, Subscription } from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import { IApiMovum } from '../../../models/IApiMovum';
import {
  selectApiData,
  selectApiSelectedDatum,
} from '../../ngrx/selectors/api-data.selectors';
import { ITableThumbnailInput } from '../table-thumbnail/table-thumbnail.component';
import { IApiFixum } from '../../../models/IApiFixum';

const placeholderUrl = 'assets/images/pngs/sbn_logo_v0.png';

@Component({
  selector: 'app-fits-jpg-toggler',
  templateUrl: './fits-jpg-toggler.component.html',
  styleUrls: ['./fits-jpg-toggler.component.scss'],
  standalone: false,
})
export class FitsJpgTogglerComponent implements OnInit {
  // --->>>

  subscriptions = new Subscription();
  apiData?: IApiMovum[] | IApiFixum[];
  // apiSelectedDatum?: IApiDatum;
  apiSelectedDatum?: any;
  // isFitsButtonDisabled = false;
  isButtonRaised = false;
  isFits = false;
  fitsUrl = '';
  widthPxls = 0;
  heightPxls = 0;
  isFitsLoaded = false;
  apiDataWithProblematicFitsUrls: string[] = [];

  @ViewChild('FitsJpgTogglerContainer')
  carouselContainerDiv?: ElementRef<HTMLDivElement>;

  @ViewChild('mainImage')
  mainImageDiv?: ElementRef<HTMLDivElement>;

  constructor(private store$: Store<IAppState>) {
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
          this.isFits = false;
          this.isButtonRaised = false;
          this.apiSelectedDatum = apiSelectedDatum;
          this.fitsUrl = this.apiSelectedDatum?.cutout_url || '';
          // console.log('fitsUrl', this.fitsUrl, ' <----> ', apiSelectedDatum);
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
    return this.apiSelectedDatum?.preview_url || placeholderUrl;
  }

  getTableThumbnailInput(): ITableThumbnailInput | undefined {
    return this.apiSelectedDatum;
    // console.log('>>>>> ????');
    if (!this.apiSelectedDatum) return;

    const { ra, dec, preview_url, source, product_id } = this.apiSelectedDatum;
    return {
      ra,
      dec,
      preview_url: preview_url || placeholderUrl,
      source,
      product_id,
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
      const product_id = this.apiSelectedDatum?.product_id;
      if (product_id) this.apiDataWithProblematicFitsUrls.push(product_id);
    } else if (event === 'success') {
      this.isButtonRaised = true;
    } else {
      // this.isFits = false;
      this.isButtonRaised = false;
    }
  }

  isFitsButtonDisabled() {
    if (!this.fitsUrl) return true;
    return this.apiDataWithProblematicFitsUrls.includes(
      this.apiSelectedDatum?.product_id || ''
    );
  }

  getLabel() {
    // Create a label for this image from the carousel
    this.apiSelectedDatum;
    const i = this.apiData
      ?.map((apiDatum) => apiDatum.product_id)
      .indexOf(this.apiSelectedDatum?.product_id || '');
    return '*C' + i;
  }
}
