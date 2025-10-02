import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription, take } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { saveAs } from 'file-saver';
import { Parser } from '@json2csv/plainjs';
import JSZip from 'jszip';

import { IAppState } from '../../../ngrx/reducers';
import { selectScreenDeviceEffectiveDevice } from '../../../ngrx/selectors/screen-device.selectors';
import { IApiDataStatus } from '../../../../models/TApiDataStatus';
import { IApiMovum } from '../../../../models/IApiMovum';
import { TApiDataLabels } from '../../../../models/TApiDataLabels';
import { apiDataLabels } from '../../../../utils/apiDataLabels';
import { TDownloadRowsState } from '../../../../models/TDownloadRowsState';
import { IApiFixum } from '../../../../models/IApiFixum';
import { getUrlForCaughtOrFixedRoute } from '../../../../utils/getUrlForCaughtOrFixedRoute';
import { getSearchDescriptor } from '../../../../utils/getSearchDescriptor';
import {
  selectApiData,
  selectApiDataDownloadRowState,
  selectApiDataJobId,
  selectApiDataStatus,
} from '../../../ngrx/selectors/api-data.selectors';
import { ImageFetchService } from '../../../core/services/fetch-image/fetch-image.service';

@Component({
  selector: 'app-title-data',
  templateUrl: './title-data.component.html',
  styleUrls: ['./title-data.component.scss'],
  imports: [
    //
    NgClass,
    MatProgressSpinner,
    MatTooltip,
    MatInputModule,
    MatButtonModule,
    MatIcon,
  ],
  standalone: true,
})
export class TitleDataComponent implements OnInit {
  // --->>>

  searchDescriptor = '';
  subscriptions = new Subscription();
  queryStatus?: IApiDataStatus;
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

  constructor(private store$: Store<IAppState>, private imageFetchService: ImageFetchService) {
    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiDataStatus).pipe(take(1)),
        this.store$.select(selectApiData).pipe(take(1)),
        this.store$.select(selectApiDataDownloadRowState),
        this.store$.select(selectApiDataJobId),
        this.store$.select(selectScreenDeviceEffectiveDevice),
      ]).subscribe(([apiStatus, apiData, dataDownloadRowState, job_id, device]) => {
        // --->>

        if (!apiStatus.search || !apiData) return;

        const { search } = apiStatus;
        this.isMoving = search.searchType === 'moving';

        this.apiData = apiData;
        this.rowsInTable = apiData.length;
        this.isMobile = device === 'mobile';
        this.jobId = this.isMoving ? job_id : 'API Link';
        this.queryStatus = apiStatus;
        this.dataDownloadRowState = dataDownloadRowState;
        this.dataLink = job_id ? getUrlForCaughtOrFixedRoute(search, job_id) : undefined;
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
      })
    );
  }

  ngOnInit(): void {}

  async downloadData() {
    // --->>

    // Preliminaries
    if (!this.jpgUrlsForDownload || !this.apiDataForDownload || !this.queryStatus?.search) {
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

    const jpegUrls: { url: string; product_id: string }[] = this.apiDataForDownload
      .map((apiDatum) => {
        const url = apiDatum.preview_url || '';
        if (!url) return null;
        const { product_id } = apiDatum;
        return { url, product_id };
      })
      .filter(Boolean) as any;

    const fitsUrls: { url: string; product_id: string }[] = this.apiDataForDownload
      .map((apiDatum) => {
        const url = apiDatum.cutout_url || '';
        if (!url) return undefined;
        const { product_id } = apiDatum;
        return { url, product_id };
      })
      .filter(Boolean) as any;

    // Convert urls to "image blobs"
    const jpegImageBlobs = await Promise.all(
      jpegUrls.map(async ({ url, product_id }) => {
        const blob = await this.imageFetchService
          .fetchImage(url, { isPriority: false, label: url })
          .then((objectUrl) => {
            if (!objectUrl) return null;
            return fetch(objectUrl)
              .then((r) => r.blob())
              .catch((_) => null);
          });
        return { url, product_id, blob } as const;
      })
    );

    // Convert FITS urls to blobs directly (avoid service which adds '&align=true')
    const fitsImageBlobs = await Promise.all(
      fitsUrls.map(async ({ url, product_id }) => {
        const cleanUrl = url.replace(/[?&]align=true/, '');
        try {
          const res = await fetch(cleanUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          return { url: cleanUrl, product_id, blob };
        } catch (e) {
          console.error('Error fetching FITS', cleanUrl, e);
          return { url: cleanUrl, product_id, blob: null as any };
        }
      })
    );

    // Convert blobs to 'File's with productid as name
    const jpgImageFiles = jpegImageBlobs
      .filter(({ blob }) => blob) // Juzstifies ! below
      .map(({ blob, product_id, url }, ind) => ({
        file: new File([blob!], this.jpgUrlsForDownload![ind]),
        product_id,
        url,
      }));
    const fitsImageFiles = fitsImageBlobs
      .filter(({ blob }) => blob)
      .map(({ blob, product_id, url }, ind) => ({
        file: new File([blob!], this.fitsUrlsForDownload![ind]),
        product_id,
        url,
      }));

    // Begin packaging products using JSZip library
    const zip = new JSZip();

    // Save JSON data
    zip.file(`${target}_data.json`, JSON.stringify(this.apiDataForDownload, null, 2));

    // Convert JSON to CSV
    try {
      const parser = new Parser();
      const csv2 = parser.parse(this.apiDataForDownload);
      zip.file(`${target}_data.csv`, csv2);
    } catch (err) {
      console.error(err);
    }

    // Create folders for images
    const jpgs = zip.folder('jpgs');
    const fits = zip.folder('fits');

    // Place images in respective folders
    jpgImageFiles.map(({ file, product_id }) => {
      jpgs?.file(product_id + '.jpg', file);
    });

    fitsImageFiles.map(({ file, product_id }) => {
      fits?.file(product_id + '.fits', file);
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
