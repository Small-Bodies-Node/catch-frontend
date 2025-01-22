import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { TApiStatusCode } from '../../../models/TApiStatusCode';
import { IAppState } from '../../ngrx/reducers';
import { selectApiDataStatus } from '../../ngrx/selectors/api-data.selectors';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IApiDataStatus } from '../../../models/IApiDataStatus';
import { controlLabelsDictForSources } from '../../../models/TControlKeyForSources';
import { IApiFixedStatus } from '../../../models/IApiFixedStatus';
import { selectApiFixedStatus } from '../../ngrx/selectors/api-fixed.selectors';

@Component({
  selector: 'app-streaming-messages',
  templateUrl: './streaming-messages.component.html',
  styleUrls: ['./streaming-messages.component.scss'],
  imports: [CommonModule, MatProgressBarModule],
})
export class StreamingMessagesComponent implements OnInit, OnDestroy {
  streamingCode: TApiStatusCode = 'unknown';
  streamingMessage = '';
  target = '';
  isCached = true;
  isUncertaintyEllipse = false;
  padding = 0;
  sources: string[] = [];

  msgs: string[] = [];

  subscriptions: Subscription = new Subscription();

  constructor(
    private store$: Store<IAppState>,
    private cdr: ChangeDetectorRef
  ) {
    this.subscriptions.add(
      this.store$.select(selectApiDataStatus).subscribe((status) => {
        this.updateMovingStreamingMessage(status);
      })
    );

    this.subscriptions.add(
      this.store$.select(selectApiFixedStatus).subscribe((status) => {
        this.updateFixedStreamingMessage(status);
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateMovingStreamingMessage(status: IApiDataStatus): void {
    this.streamingMessage = status.message || '';
    this.streamingCode = status.code;

    if (!status.query) return;

    const { target, isCached, isUncertaintyEllipse, padding, sources } =
      status.query;

    this.msgs = [
      `Target: ` + target,
      `Cached: ` + isCached,
      `Uncertainty ellipse: ` + isUncertaintyEllipse,
      `Padding: ` + padding,
      `Sources: ` +
        sources.map((source) => controlLabelsDictForSources[source]),
    ];
    this.sources = sources.map((source) => controlLabelsDictForSources[source]);

    // Explicitly trigger change detection
    this.cdr.detectChanges();
  }

  private updateFixedStreamingMessage(status: IApiFixedStatus): void {
    this.streamingMessage = status.message || '';
    this.streamingCode = status.code;
    if (!status.query) return;

    const { ra, dec, intersectionType, radius, startTime, stopTime, sources } =
      status.query;

    this.msgs = [
      `ra: ` + ra,
      `dec: ` + dec,
      `IntersectionType: ` + intersectionType,
      `Radius: ` + radius,
      `StartTime: ` + (startTime || 'N/A'),
      `StopTime: ` + (stopTime || 'N/A'),
    ];
    this.sources = sources.map((source) => controlLabelsDictForSources[source]);

    // Explicitly trigger change detection
    this.cdr.detectChanges();
  }
}
