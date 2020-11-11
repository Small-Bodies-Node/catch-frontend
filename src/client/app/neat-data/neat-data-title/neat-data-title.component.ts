import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ScreenDeviceSetLayout } from '../../ngrx/actions/screen-device.actions';
import { AppState } from '@client/app/ngrx/reducers';
import { IScreenDevice } from 'src/client/app/models/screen-device.model';
import { Observable, interval, combineLatest, Subscription } from 'rxjs';
import { map, distinctUntilChanged, delay, take } from 'rxjs/operators';
import { selectScreenDeviceSubstate } from '../../ngrx/selectors/screen-device.selectors';
import {
  selectNeatObjectQueryResultLabels,
  selectNeatObjectQueryResults,
  selectNeatObjectQueryStatus
} from '@client/app/ngrx/selectors/neat-object-query.selectors';
import { INeatObjectQueryResult } from '@client/app/models/neat-object-query-result.model';
import {
  INeatObjectQueryResultLabels,
  INeatObjectQueryStatus
} from '@client/app/models/neat-object-query-result-labels.model';

import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { environment } from '@client/environments/environment';

// const noCorsIssueImage = // const imageUrl =
'https://images.unsplash.com/photo-1576328842079-95ef7deedc89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80.jpg';

@Component({
  selector: 'app-neat-data-title',
  templateUrl: './neat-data-title.component.html',
  styleUrls: ['./neat-data-title.component.scss']
})
export class NeatDataTitleComponent implements OnInit {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  @ViewChild('titleContainer')
  titleContainer!: ElementRef<HTMLDivElement>;

  @Output()
  refresh = new EventEmitter<void>();

  objid?: string;
  toggleValue?: IScreenDevice['layout'];
  device?: IScreenDevice['device'];
  divWidth$: Observable<any>;
  subscriptions = new Subscription();
  queryStatus?: INeatObjectQueryStatus;
  results?: INeatObjectQueryResult[];
  resultLabels?: INeatObjectQueryResultLabels;
  jpgUrls?: string[];
  fitsUrls?: string[];
  isDownloadButtonShown = true;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        this.objid = params.objid;
      })
    );

    this.subscriptions.add(
      this.store
        .select(selectScreenDeviceSubstate)
        .pipe(take(1))
        .subscribe(_ => {
          this.toggleValue = _.layout;
          this.device = _.device;
          if (this.device === 'tablet') this.device = 'desktop';
        })
    );

    this.subscriptions.add(
      combineLatest([
        this.store.select(selectNeatObjectQueryStatus).pipe(take(1)),
        this.store.select(selectNeatObjectQueryResults).pipe(take(1)),
        this.store.select(selectNeatObjectQueryResultLabels).pipe(take(1))
      ]).subscribe(([status, results, labels]) => {
        this.queryStatus = status;
        this.results = results;
        this.resultLabels = labels;
        // Extract images
        if (!results) return;
        this.jpgUrls = results.map(result => result.preview_url || result.thumbnail_url);
        this.fitsUrls = results.map(result => result.cutout_url);
      })
    );

    this.divWidth$ = combineLatest([
      interval(100).pipe(
        map(_ => (this.titleContainer ? this.titleContainer.nativeElement.offsetWidth : 100)),
        distinctUntilChanged()
      )
    ]).pipe(
      delay(10),
      map(([width]) => width)
    );
  }

  ngOnInit() {}

  refreshScreen() {
    this.refresh.emit();
  }

  setToggleValue(e: IScreenDevice['layout']) {
    this.toggleValue = e;
    this.store.dispatch(new ScreenDeviceSetLayout({ layout: this.toggleValue }));
  }

  async downloadData() {
    // -------------->>>

    if (!this.jpgUrls || !this.results || !this.queryStatus) return;

    this.isDownloadButtonShown = false;

    const target = this.queryStatus.objid;

    // Only allow https
    let jpgUrls = this.jpgUrls!.filter(url => url.includes('https'));
    let fitsUrls = this.fitsUrls!.filter(url => url.includes('https'));

    if (!environment.production) {
      jpgUrls = jpgUrls.map(url =>
        url.replace('https://catch.astro.umd.edu', 'http://localhost:8010/proxy')
      );
      fitsUrls = fitsUrls.map(url =>
        url.replace('https://catch.astro.umd.edu', 'http://localhost:8010/proxy')
      );
    }

    const jpgImageBlobs = await Promise.all(
      jpgUrls!.map(imageUrl => fetch(imageUrl).then(response => response.blob()))
    );

    const fitsImageBlobs = await Promise.all(
      fitsUrls!.map(imageUrl => fetch(imageUrl).then(response => response.blob()))
    );

    const jpgImageFiles = jpgImageBlobs.map(
      (imageBlob, ind) => new File([imageBlob], this.results![ind].productid)
    );

    const fitsImageFiles = fitsImageBlobs.map(
      (imageBlob, ind) => new File([imageBlob], this.results![ind].productid)
    );

    const zip = new JSZip();

    zip.file(`${target}_data.json`, JSON.stringify(this.results, null, 2));

    const jpgs = zip.folder('jpgs');
    const fits = zip.folder('fits');

    jpgImageFiles.map(file => {
      jpgs?.file(file.name + '.jpg', file, { base64: true });
    });

    fitsImageFiles.map(file => {
      fits?.file(file.name + '.fit', file, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `catch-data-${target}.zip`);
      this.isDownloadButtonShown = true;
    });
  }
}
