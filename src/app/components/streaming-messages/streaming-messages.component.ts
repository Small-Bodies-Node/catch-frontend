import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TApiStatusCode } from '../../../models/TApiStatusCode';
import { IAppState } from '../../ngrx/reducers';
import { selectApiStatus } from '../../ngrx/selectors/api-data.selectors';
import { sourcesNamesDict } from '../../../utils/sourcesNamesDict';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-streaming-messages',
  templateUrl: './streaming-messages.component.html',
  styleUrls: ['./streaming-messages.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    //
    MatProgressBarModule,
  ],
})
export class StreamingMessagesComponent implements OnInit {
  // --->>>

  streamingCode: TApiStatusCode = 'unknown';
  streamingMessage = '';
  target = '';
  isCached = true;
  isUncertaintyEllipse = false;
  padding = 0;
  sources: string[] = [];

  constructor(private store$: Store<IAppState>) {
    //--->>

    this.store$.select(selectApiStatus).subscribe((status) => {
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
      this.sources = sources.map((source) => sourcesNamesDict[source]);
    });
  }

  ngOnInit(): void {}
}
