import { Store } from '@ngrx/store';
import { AppState } from '@client/app/ngrx/reducers';
import { Component, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';

import {
  selectNeatObjectQueryResults,
  selectNeatObjectQuerySelectedResultIndex
} from '@client/app/ngrx/selectors/neat-object-query.selectors';
import { combineLatest, Observable, interval, from } from 'rxjs';
import { map, distinctUntilChanged, delay, switchMap } from 'rxjs/operators';
import { INeatObjectQueryResult } from '@client/app/models/neat-object-query-result.model';

interface ILatestData {
  selectedResultIndex: number;
  width: number;
  height: number;
  thumbUrl: string | null;
  fullUrl: string | null;
  fitsUrl: string | null;
}

@Component({
  selector: 'app-neat-data-main-image',
  templateUrl: './neat-data-main-image.component.html',
  styleUrls: ['./neat-data-main-image.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeatDataMainImageComponent {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  @ViewChild('imagesWrapper')
  imageWrapperDiv!: ElementRef<HTMLDivElement>;

  @Input()
  objid!: string;

  isFits = false;

  isButtonRaised = false;

  latestData$: Observable<ILatestData>;

  isFitsButtonDisabled = false;

  constructor(private store: Store<AppState>) {
    // ------------------------------------->>>

    // todo: fix this sh***y-interval approach to checking width changes!
    this.latestData$ = combineLatest([
      interval(1000).pipe(
        map(_ => (this.imageWrapperDiv ? this.imageWrapperDiv.nativeElement.offsetWidth : 100)),
        distinctUntilChanged()
      ),
      interval(1000).pipe(
        map(_ => (this.imageWrapperDiv ? this.imageWrapperDiv.nativeElement.offsetHeight : 100)),
        distinctUntilChanged()
      ),
      this.store.select(selectNeatObjectQueryResults),
      this.store.select(selectNeatObjectQuerySelectedResultIndex)
    ]).pipe(
      delay(100),
      switchMap(([width, height, results, selectedResultIndex]) => {
        return from(this.chooseFullImageUrl([width, height, results, selectedResultIndex]));
      })
    );
  }

  /**
   * If preview_url exists, use that for main image, else use thumbnail
   */
  async chooseFullImageUrl([width, height, results, selectedResultIndex]: [
    number,
    number,
    INeatObjectQueryResult[] | undefined,
    number
  ]): Promise<ILatestData> {
    return new Promise(resolve => {
      // ----------------------->>>

      // Always reset fits button to show jpg first
      this.isFits = false;
      this.isButtonRaised = false;

      // Determine best image for thumbnail display; ensure type safety around null cases:
      const fitsUrl =
        results && results[selectedResultIndex] ? results[selectedResultIndex].cutout_url : null;
      const thumbUrl =
        results && results[selectedResultIndex] ? results[selectedResultIndex].thumbnail_url : null;
      const previewUrl =
        results && results[selectedResultIndex]
          ? results && results[selectedResultIndex].preview_url
          : null;
      const fullUrl = previewUrl || thumbUrl || null;

      // Finalize the image to be displayed
      const result = {
        width,
        height,
        selectedResultIndex,
        fitsUrl,
        thumbUrl,
        fullUrl
      };

      // TEMPORARY: disable fits button if skymapper
      // const source = results?.[selectedResultIndex]?.source;
      // this.isFitsButtonDisabled = !!source && source.toLowerCase() === 'skymapper';

      // TEMPORARY: rename url resources to point to catch instead of catchsandbox
      /*       result.fitsUrl && result.fitsUrl.replace('catchsandbox', 'catch');
      result.thumbUrl && result.thumbUrl.replace('catchsandbox', 'catch');
      result.fullUrl && result.fullUrl.replace('catchsandbox', 'catch'); */

      // Pre-download image
      const img = new Image();
      img.src = result.fullUrl || '';
      img.onload = () => {
        try {
          resolve(result);
        } catch (err) {
          console.log('>>>', err);
        }
      };
      img.onerror = () => {
        result.fullUrl = result.thumbUrl;
        resolve(result);
      };
    });
  }

  toggleFits() {
    this.isFits = !this.isFits;
    if (!this.isFits) this.isButtonRaised = false;
  }

  raiseButton() {
    this.isButtonRaised = true;
  }

  chooseImage(url: string | null) {
    // Decide whether to use thumbnail or not
    // console.log('url', url);
    return url && url.replace('_thumb', '');
  }
}
