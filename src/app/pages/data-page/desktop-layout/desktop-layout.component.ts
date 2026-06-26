import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { IAppState } from '../../../ngrx/reducers';
import { selectApiData, selectApiDataStatus } from '../../../ngrx/selectors/api-data.selectors';
import { IApiMovum } from '../../../../models/IApiMovum';
import { headerHeightPx } from '../../../../utils/constants';
import { IApiFixum } from '../../../../models/IApiFixum';
import { TApiDataStatus } from '../../../../models/TApiDataStatus';
import { MatTabsModule } from '@angular/material/tabs';
import { TableDataComponent } from '../table-data/table-data.component';
import { FitsJpgTogglerComponent } from '../fits-jpg-toggler/fits-jpg-toggler.component';
import { SolarViewerComponent } from '../solar-viewer/solar-viewer.component';
import { NgClass, NgStyle } from '@angular/common';
import { TitleDataComponent } from '../title-data/title-data.component';
import { CatToolsComponent } from '../cat-tools/cat-tools.component';
import {
  compactTableWidthPx,
  dataViewLayoutMetrics,
  getDataViewLayoutCssVars,
} from '../data-view-layout.constants';
import {
  ApiDataAction_SetActiveDatum,
  ApiDataAction_SetAnalysisSelectionState,
} from '../../../ngrx/actions/api-data.actions';
import { parseCatShareIntent } from '../../../../utils/catShareLink';

type TTableDisplayMode = 'expanded' | 'compact';

@Component({
  selector: 'app-desktop-layout',
  templateUrl: './desktop-layout.component.html',
  styleUrls: ['./desktop-layout.component.scss'],
  imports: [
    MatTabsModule,
    TableDataComponent,
    TitleDataComponent,
    FitsJpgTogglerComponent,
    SolarViewerComponent,
    CatToolsComponent,
    NgClass,
    NgStyle,
  ],
  standalone: true,
})
export class DesktopLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  // --->>>

  @ViewChild('resultsStage')
  resultsStage?: ElementRef<HTMLDivElement>;

  maxHeight = `calc(100vh - ${headerHeightPx}px)`;
  readonly layoutCssVars = getDataViewLayoutCssVars();
  resultsWorkspaceStyle: Record<string, string> = {
    '--stage-cat-pane-width': '0px',
    '--stage-table-pane-width': '100%',
  };
  apiData?: IApiMovum[] | IApiFixum[];
  apiDataStatus?: TApiDataStatus;
  movingOrFixed?: 'moving' | 'fixed';
  tableDisplayMode: TTableDisplayMode = 'expanded';

  subscriptions = new Subscription();
  private resizeObserver?: ResizeObserver;
  private resultsStageWidthPx = 0;
  private lastAppliedCatShareIntentKey = '';

  constructor(
    private route: ActivatedRoute,
    private store$: Store<IAppState>,
  ) {
    //--->>

    this.subscriptions.add(
      combineLatest([
        this.store$.select(selectApiData),
        this.store$.select(selectApiDataStatus),
        this.route.queryParams,
      ])
        .pipe(distinctUntilChanged())
        .subscribe(([apiData, apiDataStatus, queryParams]) => {
          this.apiDataStatus = apiDataStatus;
          this.apiData = apiData;
          if (!apiDataStatus) return;
          const { search } = apiDataStatus;
          const { searchType } = search!;
          this.movingOrFixed = searchType;
          this.restoreCatShareIntent(apiData, queryParams);
        }),
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const stageEl = this.resultsStage?.nativeElement;
    if (!stageEl) return;

    this.updateResultsWorkspaceStyle(this.getResultsStageWidthPx());

    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? stageEl.getBoundingClientRect().width;
      this.updateResultsWorkspaceStyle(width);
    });

    this.resizeObserver.observe(stageEl);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.resizeObserver?.disconnect();
  }

  get containerStyle() {
    return {
      maxHeight: this.maxHeight,
      ...this.layoutCssVars,
    };
  }

  get isTableCompact() {
    return this.tableDisplayMode === 'compact';
  }

  toggleTableDisplayMode() {
    this.setTableDisplayMode(this.isTableCompact ? 'expanded' : 'compact');
  }

  private setTableDisplayMode(tableDisplayMode: TTableDisplayMode) {
    this.tableDisplayMode = tableDisplayMode;
    this.updateResultsWorkspaceStyle(this.getResultsStageWidthPx());
  }

  private restoreCatShareIntent(
    apiData: IApiMovum[] | IApiFixum[] | undefined,
    queryParams: Record<string, unknown>,
  ) {
    const intent = parseCatShareIntent(queryParams);
    if (!intent || !apiData?.length) {
      return;
    }

    const apiDatum = apiData.find((datum) => datum.product_id === intent.productId);
    if (!apiDatum) {
      return;
    }

    const intentKey = `${intent.productId}:${intent.view}`;
    if (intentKey === this.lastAppliedCatShareIntentKey) {
      return;
    }

    this.lastAppliedCatShareIntentKey = intentKey;
    this.setTableDisplayMode('compact');

    const newAnalysisSelectionState = apiData.reduce(
      (acc, datum) => {
        acc[datum.product_id] = datum.product_id === intent.productId;
        return acc;
      },
      {} as { [productId: string]: boolean },
    );

    this.store$.dispatch(ApiDataAction_SetActiveDatum({ apiDatum }));
    this.store$.dispatch(ApiDataAction_SetAnalysisSelectionState({ newAnalysisSelectionState }));
  }

  private getResultsStageWidthPx() {
    const measuredWidth = this.resultsStage?.nativeElement.getBoundingClientRect().width ?? 0;
    return measuredWidth > 0 ? measuredWidth : this.resultsStageWidthPx;
  }

  private updateResultsWorkspaceStyle(stageWidth: number) {
    const roundedStageWidth = Math.max(0, Math.round(stageWidth));
    this.resultsStageWidthPx = roundedStageWidth;

    if (!this.isTableCompact) {
      this.resultsWorkspaceStyle = {
        '--stage-cat-pane-width': '0px',
        '--stage-table-pane-width': roundedStageWidth > 0 ? `${roundedStageWidth}px` : '100%',
      };
      return;
    }

    const activeGapPx = dataViewLayoutMetrics.workspaceGapPx;
    const compactTablePaneWidthPx =
      roundedStageWidth > 0
        ? Math.min(compactTableWidthPx, roundedStageWidth)
        : compactTableWidthPx;
    const catPaneWidthPx = Math.max(0, roundedStageWidth - compactTablePaneWidthPx - activeGapPx);

    this.resultsWorkspaceStyle = {
      '--stage-cat-pane-width': `${catPaneWidthPx}px`,
      '--stage-table-pane-width': `${compactTablePaneWidthPx}px`,
    };
  }
}
