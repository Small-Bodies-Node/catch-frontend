import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, interval, map, Subscription } from 'rxjs';

import { IAppState } from 'src/app/ngrx/reducers';
import { IApiDatum } from 'src/app/models/IApiDatum';
import {
  selectApiData,
  selectApiSelectedDatum,
} from 'src/app/ngrx/selectors/api.selectors';

const placeholderUrl = 'assets/images/pngs/sbn_logo_v0.png';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  // --->>>

  subscriptions = new Subscription();
  apiData?: IApiDatum[];
  apiSelectedDatum?: IApiDatum;
  // isFitsButtonDisabled = false;
  isButtonRaised = false;
  isFits = false;
  fitsUrl = '';
  // 'http://localhost:4200/assets/fits/65P_P20020121_OBSDATA_20020121132624C_ra177.51011_dec+15.25013_5arcmin.fits';
  width = 0;
  height = 0;
  isFitsLoaded = false;
  apiDataWithProblematicFitsUrls: string[] = [];

  @ViewChild('carouselContainer')
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
          this.width = width;
          this.height = height;
          // console.log('width height', this.width, this.height);
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

  toggleFits() {
    this.isFits = !this.isFits;
    if (!this.isFits) this.isButtonRaised = false;
  }

  onFitsLoadStatusUpdate(event: string) {
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
}
