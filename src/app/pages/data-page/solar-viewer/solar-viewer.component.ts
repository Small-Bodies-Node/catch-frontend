import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription, take } from 'rxjs';

import { SbnSolarViewer, dateToJulianDay } from 'sbn-solar-viewer';
import { IApiMovum } from '../../../../models/IApiMovum';
import { IAppState } from '../../../ngrx/reducers';
import {
  selectApiActiveDatum,
  selectApiData,
  selectApiDataStatus,
  selectApiSmallBodyType,
} from '../../../ngrx/selectors/api-data.selectors';
import { IApiFixum } from '../../../../models/IApiFixum';

let solarViewerIdCounter = 0;

const createSolarViewerId = (): string => {
  solarViewerIdCounter += 1;
  return `sbn-solar-viewer-id-${solarViewerIdCounter}`;
};

@Component({
  selector: 'app-solar-viewer',
  templateUrl: './solar-viewer.component.html',
  styleUrls: ['./solar-viewer.component.scss'],
  standalone: true,
})
export class SolarViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  // --->>>

  @ViewChild('solarViewerContainer')
  solarViewerContainer?: ElementRef<HTMLDivElement>;

  sbnSolarViewerId = createSolarViewerId();
  solarViewer?: SbnSolarViewer;
  apiData?: IApiMovum[] | IApiFixum[];
  apiActiveDatum?: IApiMovum | IApiFixum;
  subscriptions = new Subscription();

  target?: string;
  private isViewReady = false;
  private isInitQueued = false;
  private isDestroyed = false;
  private initAttempts = 0;
  private readonly maxInitAttempts = 30;
  private smallBodyType?: 'asteroid' | 'comet';
  private timeStamps: string[] = [];
  private timeStampsJds: number[] = [];

  constructor(private store$: Store<IAppState>) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiDataStatus).pipe(take(1)),
        this.store$.select(selectApiData).pipe(take(1)),
        this.store$.select(selectApiSmallBodyType).pipe(take(1)),
      ]).subscribe(([status, apiData, smallBodyType]) => {
        if (!status || !status.search) return;
        if (status.search.searchType === 'fixed') return;
        if (!smallBodyType) return;

        this.target = status.search.searchParams.target;

        this.apiData = apiData;
        if (apiData && this.target) {
          this.timeStamps = apiData.map((data) => data.date);
          this.timeStampsJds = this.timeStamps.map((date) => dateToJulianDay(new Date(date)));
          this.smallBodyType = smallBodyType;
          this.queueSolarViewerInit();
        }
      }),
    );

    this.subscriptions.add(
      this.store$.select(selectApiActiveDatum).subscribe((apiActiveDatum) => {
        this.apiActiveDatum = apiActiveDatum;
        if (!this.apiActiveDatum) return;
        const timeStamp = this.apiActiveDatum.date;
        if (this.solarViewer) {
          this.solarViewer.setTargetTime(timeStamp);
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    this.isViewReady = true;
    this.queueSolarViewerInit();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.subscriptions.unsubscribe();
    this.solarViewer?.destroy();
    this.solarViewer = undefined;
  }

  private queueSolarViewerInit(): void {
    if (
      this.isDestroyed ||
      this.isInitQueued ||
      this.solarViewer ||
      !this.isViewReady ||
      !this.target ||
      !this.smallBodyType ||
      this.timeStamps.length === 0 ||
      typeof window === 'undefined'
    ) {
      return;
    }

    this.isInitQueued = true;
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => this.initializeSolarViewerWhenContainerIsReady());
    } else {
      window.setTimeout(() => this.initializeSolarViewerWhenContainerIsReady(), 0);
    }
  }

  private initializeSolarViewerWhenContainerIsReady(): void {
    this.isInitQueued = false;

    if (this.isDestroyed || this.solarViewer) {
      return;
    }

    const container = this.solarViewerContainer?.nativeElement;
    const isContainerReady =
      !!container &&
      container.isConnected &&
      container.offsetWidth > 0 &&
      container.offsetHeight > 0;

    if (!isContainerReady) {
      this.initAttempts += 1;
      if (this.initAttempts <= this.maxInitAttempts) {
        window.setTimeout(() => this.queueSolarViewerInit(), 100);
      }
      return;
    }

    this.initAttempts = 0;

    try {
      this.solarViewer = new SbnSolarViewer({
        containerId: this.sbnSolarViewerId,
        smallBody: {
          target: this.target!,
          data: this.timeStampsJds,
          bodyType: this.smallBodyType!,
        },
        horizonsBaseUrl: '/api/horizons/',

        isControlsShown: !true,
        logScaleZoomingPositionAus: { x: 3, y: 0, z: 1 },
        nonLogScaleZoomingPositionAus: { x: 0, y: 0, z: 10 },
        // planetOpacity: 0.9,
        isStarField: true,
      });
      this.solarViewer.setTargetTime(this.apiActiveDatum?.date || this.timeStamps[0]);
      this.solarViewer.begin().catch((error) => {
        console.error('Solar viewer failed to begin', error);
      });
    } catch (error) {
      console.error('Solar viewer failed to initialize', error);
    }
  }
}
