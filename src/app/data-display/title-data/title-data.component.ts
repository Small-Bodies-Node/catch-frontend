import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription, take } from 'rxjs';

import { saveAs } from 'file-saver';
import { Parser } from '@json2csv/plainjs';
import JSZip from 'jszip';

import { IAppState } from '../../ngrx/reducers';
import { selectScreenDeviceEffectiveDevice } from '../../ngrx/selectors/screen-device.selectors';
import { IApiDataFetchStatus } from '../../../models/IApiDataStatus';
import { IApiMovum } from '../../../models/IApiMovum';
import { TApiDataLabels } from '../../../models/TApiDataLabels';
import { apiDataLabels } from '../../../utils/apiDataLabels';
import { TDownloadRowsState } from '../../../models/TDownloadRowsState';
import { IApiFixum } from '../../../models/IApiFixum';
import { getUrlForCatchOrFixedRoute } from '../../../utils/getUrlForCatchOrFixedRoute';
import { getSearchDescriptor } from '../../../utils/getSearchDescriptor';
import {
  selectApiData,
  selectApiDataDownloadRowState,
  selectApiDataJobId,
  selectApiDataStatus,
} from '../../ngrx/selectors/api-data.selectors';

@Component({
  selector: 'app-title-data',
  templateUrl: './title-data.component.html',
  styleUrls: ['./title-data.component.scss'],
  standalone: false,
})
export class TitleDataComponent implements OnInit {
  // --->>>

  searchDescriptor = '';
  subscriptions = new Subscription();
  queryStatus?: IApiDataFetchStatus;
  apiData?: IApiMovum[] | IApiFixum[];
  jobId?: string;
  dataLink?: string;
  apiDataForDownload?: IApiMovum[] | IApiFixum[];
  apiDataLabels: TApiDataLabels = apiDataLabels;
  dataDownloadRowState?: TDownloadRowsState;
  rowsInTable?: number;

  isMobile = false;
  isMoving = true;

  jpgUrlsForDownload?: string[];
  fitsUrlsForDownload?: string[];
  isDownloadButtonShown = true;

  constructor(private store$: Store<IAppState>) {
    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiDataStatus).pipe(take(1)),
        this.store$.select(selectApiData).pipe(take(1)),
        this.store$.select(selectApiDataDownloadRowState),
        this.store$.select(selectApiDataJobId),
        this.store$.select(selectScreenDeviceEffectiveDevice),
      ]).subscribe(
        ([apiStatus, apiData, dataDownloadRowState, jobId, device]) => {
          // --->>

          if (!apiStatus.search || !apiData) return;

          const { search } = apiStatus;
          this.isMoving = search.searchType === 'moving';

          this.apiData = apiData;
          this.rowsInTable = apiData.length;
          this.isMobile = device === 'mobile';
          this.jobId = this.isMoving ? jobId : 'API Link';
          this.queryStatus = apiStatus;
          this.dataDownloadRowState = dataDownloadRowState;
          this.dataLink = getUrlForCatchOrFixedRoute(search);
          this.searchDescriptor = getSearchDescriptor(search);

          if (!this.apiData) return;
          if (!this.dataDownloadRowState) return;

          this.rowsInTable = this.apiData.length;

          // Filter data to be downloaded:
          this.apiDataForDownload = this.apiData.filter((apiDatum) => {
            if (!this.dataDownloadRowState) return false;
            return this.dataDownloadRowState[apiDatum.product_id];
          });

          // Choose image urls for download
          this.jpgUrlsForDownload = this.apiDataForDownload
            .map((apiDatum) => apiDatum.preview_url || '')
            .filter(Boolean);
          this.fitsUrlsForDownload = this.apiDataForDownload
            .map((apiDatum) => apiDatum.cutout_url || '')
            .filter(Boolean);
        }
      )
    );
  }

  ngOnInit(): void {}

  async downloadData() {
    // --->>

    // Preliminaries
    if (
      !this.jpgUrlsForDownload ||
      !this.apiDataForDownload ||
      !this.queryStatus?.search
    ) {
      return;
    }
    this.isDownloadButtonShown = false;

    const { searchType, searchParams } = this.queryStatus.search;
    const target =
      searchType === 'moving'
        ? searchParams.target
        : `${searchParams.ra} ${searchParams.dec}`.replace(
            /[\s!@#$%^&*()+={}\[\]|\\:;"'<>?,./`~]/g,
            '_'
          );

    const jpgUrls: { url: string; product_id: string }[] =
      this.apiDataForDownload
        .map((apiDatum) => {
          const url = apiDatum.preview_url || '';
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
      console.log('==========');
      console.log(this.apiDataForDownload);
      console.log(Parser);
      const parser = new Parser();
      const csv2 = parser.parse(this.apiDataForDownload);
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
