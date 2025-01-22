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

  private apiStatusSubscription?: Subscription;

  constructor(
    private store$: Store<IAppState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.apiStatusSubscription = this.store$
      .select(selectApiDataStatus)
      .subscribe((status) => {
        // Use runOutsideAngular if the updates are extremely frequent
        this.updateStreamingMessage(status);
      });
  }

  private updateStreamingMessage(status: IApiDataStatus): void {
    this.streamingMessage = status.message || '';
    this.streamingCode = status.code;

    if (!status.query) return;

    const { target, isCached, isUncertaintyEllipse, padding, sources } =
      status.query;

    this.target = target;
    this.isCached = isCached;
    this.isUncertaintyEllipse = isUncertaintyEllipse;
    this.padding = padding;

    // Convert sources to user-presentable names
    this.sources = sources.map((source) => controlLabelsDictForSources[source]);

    // Explicitly trigger change detection
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Properly unsubscribe to prevent memory leaks
    this.apiStatusSubscription?.unsubscribe();
  }
}
