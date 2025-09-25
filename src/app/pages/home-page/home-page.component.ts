import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TApiStatusCode } from '../../../models/TApiStatusCode';
import { IAppState } from '../../ngrx/reducers';
import { selectApiDataStatus } from '../../ngrx/selectors/api-data.selectors';
import { footerHeightPx, headerHeightPx } from '../../../utils/constants';
import { SearchFieldComponent } from '../../components/search-field/search-field.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [CommonModule, SearchFieldComponent],
})
export class HomePageComponent implements OnInit {
  //--->>>

  streamingCode: TApiStatusCode | 'unset' = 'unset';
  streamingMessage = '';
  isStreamingMessage = false;

  // Params for sizing stuff:
  titleHeightPx = 120;
  searchFieldHeightPx = `calc(100vh - ${headerHeightPx}px - ${footerHeightPx}px - ${this.titleHeightPx}px)`;

  constructor(private store$: Store<IAppState>) {
    //--->>

    this.store$.select(selectApiDataStatus).subscribe((status) => {
      this.streamingMessage = status.message || '';
      this.streamingCode = status.code;
      this.isStreamingMessage = this.streamingCode === 'searching';
    });
  }

  ngOnInit(): void {}
}
