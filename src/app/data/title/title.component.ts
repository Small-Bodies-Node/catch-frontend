import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription, take } from 'rxjs';
import { saveAs } from 'file-saver';
import { Store } from '@ngrx/store';
import { parse } from 'json2csv';
import * as JSZip from 'jszip';

import { TDownloadRowsState } from 'src/app/models/TDownloadRowsState';
import { TApiDataLabels } from 'src/app/models/TApiDataLabels';
import { apiDataLabels } from 'src/app/utils/apiDataLabels';
import { IApiStatus } from 'src/app/models/IApiStatus';
import { IApiDatum } from 'src/app/models/IApiDatum';
import { IAppState } from 'src/app/ngrx/reducers';
import {
  selectApiData,
  selectApiDataDownloadRowState,
  selectApiJobId,
  selectApiStatus,
} from 'src/app/ngrx/selectors/api.selectors';
import { apiBaseUrl } from 'src/app/utils/constants';
import { selectScreenDeviceEffectiveDevice } from 'src/app/ngrx/selectors/screen-device.selectors';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit {
  // --->>>

  target = '';
  subscriptions = new Subscription();
  queryStatus?: IApiStatus;
  apiData?: IApiDatum[];
  jobId?: string;
  dataLink?: string;
  apiDataForDownload?: IApiDatum[];
  apiDataLabels: TApiDataLabels = apiDataLabels;
  dataDownloadRowState?: TDownloadRowsState;
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
        this.store$.select(selectApiStatus).pipe(take(1)),
        this.store$.select(selectApiData).pipe(take(1)),
        this.store$.select(selectApiDataDownloadRowState),
        this.store$.select(selectApiJobId),
        this.store$.select(selectScreenDeviceEffectiveDevice),
      ]).subscribe(([status, apiData, dataDownloadRowState, jobId, device]) => {
        // --->>

        this.isMobile = device === 'mobile';

        if (!status.query) return;
        const {
          //
          target,
          isCached,
          isUncertaintyEllipse,
          padding,
          sources,
        } = status.query;

        this.target = target;
        this.queryStatus = status;
        this.dataDownloadRowState = dataDownloadRowState;
        this.apiData = apiData;
        this.jobId = jobId;
        this.dataLink = apiBaseUrl + '/caught/' + jobId;

        if (!this.apiData || !this.dataDownloadRowState) return;
        if (!this.dataDownloadRowState) return;

        //
        this.rowsInTable = this.apiData.length;

        // Filter data to be downloaded:
        this.apiDataForDownload = this.apiData.filter((apiDatum) => {
          if (!this.dataDownloadRowState) return false;
          return this.dataDownloadRowState[apiDatum.product_id];
        });

        // Choose image urls for download
        this.jpgUrlsForDownload = this.apiDataForDownload
          .map(
            (apiDatum) => apiDatum.preview_url || apiDatum.thumbnail_url || ''
          )
          .filter(Boolean);
        this.fitsUrlsForDownload = this.apiDataForDownload
          .map((apiDatum) => apiDatum.cutout_url || '')
          .filter(Boolean);
      })
    );
  }

  ngOnInit(): void {}

  async downloadData() {
    // --->>

    // Preliminaries
    if (
      !this.jpgUrlsForDownload ||
      !this.apiDataForDownload ||
      !this.queryStatus?.query?.target
    ) {
      return;
    }
    this.isDownloadButtonShown = false;
    const target = this.queryStatus.query.target;

    const jpgUrls: { url: string; product_id: string }[] =
      this.apiDataForDownload
        .map((apiDatum) => {
          const url = apiDatum.preview_url || apiDatum.thumbnail_url || '';
          if (!url) return null;
          const { product_id } = apiDatum;
          return { url, product_id };
        })
        .filter(Boolean) as any;

    const fitsUrls: { url: string; product_id: string }[] =
      this.apiDataForDownload
        .map((apiDatum) => {
          const url = apiDatum.cutout_url || '';
          if (!url) return undefined;
          const { product_id } = apiDatum;
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

    // Save JSON data
    zip.file(
      `${target}_data.json`,
      JSON.stringify(this.apiDataForDownload, null, 2)
    );

    // Convert JSON to CSV
    try {
      const csv2 = parse(this.apiDataForDownload);
      zip.file(`${target}_data.csv`, csv2);
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
      saveAs(content, `catch-data-${target}.zip`);
      this.isDownloadButtonShown = true;
    });
  }

  isDownloadButtonDisabled() {
    //
  }

  getJobId() {
    if (!this.jobId) return '';
    return this.jobId.substring(0, 8).toUpperCase();
  }
}
