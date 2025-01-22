import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription, take } from 'rxjs';

import { saveAs } from 'file-saver';
// import { parse } from 'json2csv';
import { Parser } from '@json2csv/plainjs';

import JSZip from 'jszip';

import { IAppState } from '../../ngrx/reducers';
import { apiBaseUrl } from '../../../utils/constants';
import { selectScreenDeviceEffectiveDevice } from '../../ngrx/selectors/screen-device.selectors';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { IApiFixedStatus } from '../../../models/IApiFixedStatus';
import { IApiFixum } from '../../../models/IApiFixum';
import { apiFixedLabels } from '../../../utils/apiFixedLabels';
import { TApiFixedLabels } from '../../../models/TApiFixedLabels';
import {
  selectApiFixed,
  selectApiFixedDownloadRowState,
  selectApiFixedStatus,
} from '../../ngrx/selectors/api-fixed.selectors';
import { getFixedTargetUrl } from '../../../utils/getFixedTargetUrl';

@Component({
  selector: 'app-title-fixed',
  templateUrl: './title-fixed.component.html',
  styleUrls: ['./title-fixed.component.scss'],
  standalone: false,
})
export class TitleFixedComponent implements OnInit {
  // --->>>

  ra = '';
  dec = '';
  raDec = '';

  subscriptions = new Subscription();
  queryStatus?: IApiFixedStatus;
  apiFixed?: IApiFixum[];
  fixedLink?: string;
  apiFixedForDownload?: IApiFixum[];
  apiFixedLabels: TApiFixedLabels = apiFixedLabels;
  fixedDownloadRowState?: TDownloadRowsState;
  rowsInTable?: number;

  isMobile = false;

  jpgUrlsForDownload?: string[];
  fitsUrlsForDownload?: string[];
  isDownloadButtonShown = true;

  constructor(private route: ActivatedRoute, private store$: Store<IAppState>) {
    // this.subscriptions.add(
    //   this.route.queryParams.subscribe((params) => {
    //     this.target = params['target'];
    //   })
    // );

    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiFixedStatus).pipe(take(1)),
        this.store$.select(selectApiFixed).pipe(take(1)),
        this.store$.select(selectApiFixedDownloadRowState),
        this.store$.select(selectScreenDeviceEffectiveDevice),
      ]).subscribe(([status, apiFixed, fixedDownloadRowState, device]) => {
        // --->>

        this.isMobile = device === 'mobile';

        if (!status.query) return;
        const {
          ra,
          dec,
          intersectionType,
          radius,
          startTime,
          stopTime,
          sources,
        } = status.query;

        this.ra = ra;
        this.dec = dec;
        this.raDec = ra + '_' + dec;
        this.queryStatus = status;
        this.fixedDownloadRowState = fixedDownloadRowState;
        this.apiFixed = apiFixed;

        const catchFixedUrl = getFixedTargetUrl(
          ra,
          dec,
          sources,
          intersectionType,
          radius,
          startTime,
          stopTime
        );
        this.fixedLink = catchFixedUrl;

        if (!this.apiFixed || !this.fixedDownloadRowState) return;
        if (!this.fixedDownloadRowState) return;

        //
        this.rowsInTable = this.apiFixed.length;

        // Filter fixed to be downloaded:
        this.apiFixedForDownload = this.apiFixed.filter((apiFixum) => {
          if (!this.fixedDownloadRowState) return false;
          return this.fixedDownloadRowState[apiFixum.product_id];
        });

        // Choose image urls for download
        this.jpgUrlsForDownload = this.apiFixedForDownload
          .map((apiFixum) => apiFixum.preview_url || '')
          .filter(Boolean);
        this.fitsUrlsForDownload = this.apiFixedForDownload
          .map((apiFixum) => apiFixum.cutout_url || '')
          .filter(Boolean);
      })
    );
  }

  ngOnInit(): void {}

  async downloadFixed() {
    // --->>

    // Preliminaries
    if (
      !this.jpgUrlsForDownload ||
      !this.apiFixedForDownload ||
      !this.queryStatus?.query?.ra ||
      !this.queryStatus?.query?.dec
    ) {
      return;
    }
    this.isDownloadButtonShown = false;
    const raDec = this.queryStatus.query.ra + '_' + this.queryStatus.query.dec;

    const jpgUrls: { url: string; product_id: string }[] =
      this.apiFixedForDownload
        .map((apiFixum) => {
          const url = apiFixum.preview_url || '';
          if (!url) return null;
          const { product_id } = apiFixum;
          return { url, product_id };
        })
        .filter(Boolean) as any;

    const fitsUrls: { url: string; product_id: string }[] =
      this.apiFixedForDownload
        .map((apiFixum) => {
          const url = apiFixum.cutout_url || '';
          if (!url) return undefined;
          const { product_id } = apiFixum;
          return { url, product_id };
        })
        .filter(Boolean) as any;

    // Convert urls to "image blobs"
    const jpgImageBlobs = await Promise.all(
      jpgUrls.map(async ({ url, product_id }) => ({
        url,
        product_id,
        blob: await fetch(url).then((response) => response.blob()),
      }))
    );

    const fitsImageBlobs = await Promise.all(
      fitsUrls.map(async ({ url, product_id }) => ({
        url,
        product_id,
        blob: await fetch(url).then((response) => response.blob()),
      }))
    );

    // Convert blobs to 'File's with productid as name
    const jpgImageFiles = jpgImageBlobs.map(
      ({ blob, product_id, url }, ind) => ({
        file: new File([blob], this.jpgUrlsForDownload![ind]),
        product_id,
        url,
      })
    );
    const fitsImageFiles = fitsImageBlobs.map(
      ({ blob, product_id, url }, ind) => ({
        file: new File([blob], this.fitsUrlsForDownload![ind]),
        product_id,
        url,
      })
    );

    // Begin packaging products using JSZip library
    const zip = new JSZip();

    // Save JSON fixed
    zip.file(
      `${raDec}_data.json`,
      JSON.stringify(this.apiFixedForDownload, null, 2)
    );

    // Convert JSON to CSV
    try {
      console.log('==========');
      console.log(this.apiFixedForDownload);
      console.log(Parser);
      const parser = new Parser();
      const csv2 = parser.parse(this.apiFixedForDownload);
      zip.file(`${raDec}_data.csv`, csv2);
    } catch (err) {
      console.log(err);
    }

    // Create folders for images
    const jpgs = zip.folder('jpgs');
    const fits = zip.folder('fits');

    // Place images in respective folders
    jpgImageFiles.map(({ file, product_id }) => {
      jpgs?.file(product_id + '.jpg', file, { base64: true });
    });

    fitsImageFiles.map(({ file, product_id }) => {
      fits?.file(product_id + '.fit', file, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content: any) => {
      saveAs(content, `catch-fixed-${raDec}.zip`);
      this.isDownloadButtonShown = true;
    });
  }

  isDownloadButtonDisabled() {
    //
  }
}
