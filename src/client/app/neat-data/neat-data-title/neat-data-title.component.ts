import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
// const { parse } = require('json2csv');
import { parse } from 'json2csv';

import { ScreenDeviceSetLayout } from '../../ngrx/actions/screen-device.actions';
import { AppState } from '@client/app/ngrx/reducers';
import { IScreenDevice } from 'src/client/app/models/screen-device.model';
import { Observable, interval, combineLatest, Subscription } from 'rxjs';
import { map, distinctUntilChanged, delay, take } from 'rxjs/operators';
import { selectScreenDeviceSubstate } from '../../ngrx/selectors/screen-device.selectors';
import {
  selectNeatObjectQueryResultLabels,
  selectNeatObjectQueryResults,
  selectNeatObjectQueryStatus,
  selectNeatObjectDownloadRowState
} from '@client/app/ngrx/selectors/neat-object-query.selectors';
import { INeatObjectQueryResult } from '@client/app/models/neat-object-query-result.model';
import {
  INeatObjectQueryResultLabels,
  INeatObjectQueryStatus
} from '@client/app/models/neat-object-query-result-labels.model';

import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { environment } from '@client/environments/environment';
import { DEPLOYMENT_ROOT_URL, PROXY_ROOT_URL } from '@client/app/utils/constants';

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
  resultsForDownload?: INeatObjectQueryResult[];
  jpgUrlsForDownload?: string[];
  fitsUrlsForDownload?: string[];
  isDownloadButtonShown = true;
  downloadRowState?: boolean[];

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
        this.store.select(selectNeatObjectQueryResultLabels).pipe(take(1)),
        this.store.select(selectNeatObjectDownloadRowState)
      ]).subscribe(([status, results, labels, downloadRowState]) => {
        this.queryStatus = status;
        this.results = results;
        this.resultLabels = labels;
        this.downloadRowState = downloadRowState;

        if (!results || !downloadRowState) return;

        // Filter data to be downloaded:
        this.resultsForDownload = results.filter((_, ind) => this.downloadRowState?.[ind]);
        // Choose image urls for download
        this.jpgUrlsForDownload = this.resultsForDownload.map(
          result => result.preview_url || result.thumbnail_url || ''
        );
        this.fitsUrlsForDownload = this.resultsForDownload.map(result => result.cutout_url);
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

    // Preliminaries
    if (!this.jpgUrlsForDownload || !this.resultsForDownload || !this.queryStatus) return;
    this.isDownloadButtonShown = false;
    const target = this.queryStatus.objid;

    // Only allow https and items included in downloadRowState
    let jpgUrls = this.jpgUrlsForDownload!.map((url, ind) => ({
      url,
      productid: this.resultsForDownload![ind].productid
    })).filter(({ url }) => url.includes('https'));
    let fitsUrls = this.fitsUrlsForDownload!.map((url, ind) => ({
      url,
      productid: this.resultsForDownload![ind].productid
    })).filter(({ url }) => url.includes('https'));

    // Fix image urls in development
    if (!environment.production) {
      jpgUrls = jpgUrls.map(({ productid, url }) => ({
        productid,
        url: url.replace(DEPLOYMENT_ROOT_URL, PROXY_ROOT_URL + '/')
      }));
      fitsUrls = fitsUrls.map(({ url, productid }) => ({
        productid,
        url: url.replace(DEPLOYMENT_ROOT_URL, PROXY_ROOT_URL + '/')
      }));
    }

    // Convert urls to "image blobs"
    const jpgImageBlobs = await Promise.all(
      jpgUrls!.map(({ url }) => fetch(url).then(response => response.blob()))
    );
    const fitsImageBlobs = await Promise.all(
      fitsUrls!.map(({ url }) => fetch(url).then(response => response.blob()))
    );

    // Convert blobs to 'File's with productid as name
    const jpgImageFiles = jpgImageBlobs.map(
      (imageBlob, ind) => new File([imageBlob], jpgUrls[ind].productid)
    );
    const fitsImageFiles = fitsImageBlobs.map(
      (imageBlob, ind) => new File([imageBlob], fitsUrls![ind].productid)
    );

    // Begin packaging products using JSZip library
    const zip = new JSZip();

    // Save JSON data
    zip.file(`${target}_data.json`, JSON.stringify(this.resultsForDownload, null, 2));

    // Convert JSON to CSV
    try {
      const csv2 = parse(this.resultsForDownload);
      console.log(csv2);
      zip.file(`${target}_data.csv`, csv2);
    } catch (err) {
      console.log(err);
    }

    // Create folders for images
    const jpgs = zip.folder('jpgs');
    const fits = zip.folder('fits');

    // Place images in respective folders
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

  isDownloadButtonDisabled() {
    const test1 = !this.downloadRowState;
    const test2 = !this.downloadRowState!.some(Boolean);
    const test3 = !this.isDownloadButtonShown;
    return test1 || test2 || test3;
  }
}
