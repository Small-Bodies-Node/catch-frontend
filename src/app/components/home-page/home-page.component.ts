import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TApiStatusCode } from 'src/app/models/TApiStatusCode';
import { IAppState } from 'src/app/ngrx/reducers';
import { selectApiStatus } from 'src/app/ngrx/selectors/api.selectors';
import { footerHeightPx, headerHeightPx } from 'src/app/utils/layout-constants';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  //--->>>

  streamingCode: TApiStatusCode = 'unknown';
  streamingMessage = '';
  isStreamingMessage = false;

  // Params for sizing stuff:
  titleHeightPx = 120;
  searchFieldHeightPx = `calc(100vh - ${headerHeightPx}px - ${footerHeightPx}px - ${this.titleHeightPx}px)`;

  constructor(private store$: Store<IAppState>) {
    //--->>

    this.store$.select(selectApiStatus).subscribe((status) => {
      this.streamingMessage = status.message || '';
      this.streamingCode = status.code;
      this.isStreamingMessage = this.streamingCode === 'searching';
    });
  }

  ngOnInit(): void {}
}
