import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { TApiStatusCode } from '../../../models/TApiStatusCode';
import { IAppState } from '../../ngrx/reducers';
import { selectApiDataStatus } from '../../ngrx/selectors/api-data.selectors';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TApiDataSetStatus } from '../../../models/TApiDataSetStatus';
import {
  IApiFixedSearch,
  IApiMovingSearch,
} from '../../../models/TApiDataSearch';
import { controlLabelsDictForSources } from '../../../models/TControlKeyForSources';

@Component({
  selector: 'app-streaming-messages',
  templateUrl: './streaming-messages.component.html',
  styleUrls: ['./streaming-messages.component.scss'],
  imports: [CommonModule, MatProgressBarModule],
})
export class StreamingMessagesComponent implements OnDestroy {
  streamingCode: TApiStatusCode | 'unset' = 'unset';
  streamingMessage = '';
  target = '';
  isCached = true;
  isUncertaintyEllipse = false;
  padding = 0;
  sources?: string[] = [];

  msgs: string[] = [];

  subscriptions: Subscription = new Subscription();

  constructor(
    private store$: Store<IAppState>,
    private cdr: ChangeDetectorRef
  ) {
    this.subscriptions.add(
      this.store$.select(selectApiDataStatus).subscribe((status) => {
        this.updateStreamingMessage(status);
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 200);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateStreamingMessage(status: TApiDataSetStatus): void {
    const { search, code, message } = status;
    this.streamingMessage = message;
    this.streamingCode = code;
    if (!search) return;
    if (search.searchType === 'moving') {
      this.updateMovingStreamingMessage(search);
    } else {
      this.updateFixedStreamingMessage(search);
    }
  }

  private updateMovingStreamingMessage({
    searchParams,
  }: IApiMovingSearch): void {
    const {
      target,
      cached,
      uncertainty_ellipse,
      padding,
      sources,
      start_date,
      stop_date,
    } = searchParams;

    this.msgs = [
      `Target: ` + target,
      `Cached: ` + cached,
      `Uncertainty Ellipse: ` + uncertainty_ellipse,
      `Padding: ` + padding,
      `Start Date: ` + (start_date || 'null'),
      `Stop Date: ` + (stop_date || 'null'),
    ];
    this.sources = sources?.map(
      (source) => controlLabelsDictForSources[source]
    );
  }

  private updateFixedStreamingMessage({ searchParams }: IApiFixedSearch): void {
    const {
      ra,
      dec,
      intersection_type,
      radius,
      sources,
      start_date,
      stop_date,
    } = searchParams;

    this.msgs = [
      `ra: ` + ra,
      `dec: ` + dec,
      `Intersection Type: ` + intersection_type,
      `Radius: ` + radius,
      `Start Date: ` + (start_date || 'N/A'),
      `Stop Date: ` + (stop_date || 'N/A'),
    ];
    this.sources = sources?.map(
      (source) => controlLabelsDictForSources[source]
    );
  }
}
