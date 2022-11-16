import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TApiStatusCode } from 'src/app/models/TApiStatusCode';
import { IAppState } from 'src/app/ngrx/reducers';
import { selectApiStatus } from 'src/app/ngrx/selectors/api.selectors';
import { sourcesNamesDict } from 'src/app/utils/sourcesNamesDict';

@Component({
  selector: 'app-streaming-messages',
  templateUrl: './streaming-messages.component.html',
  styleUrls: ['./streaming-messages.component.scss'],
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
