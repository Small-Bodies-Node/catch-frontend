import { Store } from '@ngrx/store';
import { Color } from 'plotly.js';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';

// PlotlyJS is registered globally via PlotlyService in app.config.ts
// import { PlotlyModule } from 'angular-plotly.js';

import { IApiMovum } from '../../../../models/IApiMovum';
import { IPlotlyGraphInput } from '../../../../models/IPlotlyGraphInput';
import { IPlotlySettings } from '../../../../models/IPlotlySettings';
import { IAppState } from '../../../ngrx/reducers';
import { selectApiData, selectApiDataStatus } from '../../../ngrx/selectors/api-data.selectors';
import { apiDataLabels } from '../../../../utils/apiDataLabels';
import { julianToDate } from '../../../../utils/julianToDate';
import { IApiFixum } from '../../../../models/IApiFixum';
import { AsyncPipe, NgClass } from '@angular/common';
import { ThemeService } from '../../../core/services/theme/theme.service';

import { PlotlyComponent, PlotlyService } from 'angular-plotly.js';
import Plotly, { Data, Layout, Margin } from 'plotly.js-dist-min';

@Component({
  selector: 'app-plotly-graph',
  templateUrl: './plotly-graph.component.html',
  styleUrls: ['./plotly-graph.component.scss'],
  imports: [
    //
    // PlotlyModule,
    NgClass,
    AsyncPipe,
    PlotlyComponent,
  ],
  providers: [PlotlyService],
  standalone: true,
})
export class PlotlyGraphComponent implements OnInit {
  // --->>>

  // Plotly instance is provided at application startup; no local binding needed

  @Input()
  inputPlotlyParams?: IPlotlyGraphInput = undefined;

  inputPlotlyParam$ = new BehaviorSubject<IPlotlyGraphInput | undefined>(this.inputPlotlyParams);

  public plotlySetting$!: Observable<IPlotlySettings>;

  constructor(
    private store$: Store<IAppState>,
    private themeService: ThemeService,
  ) {
    if (!PlotlyService.plotly) PlotlyService.setPlotly(Plotly);
    this.setPlotlySettings();
  }

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (!(changes.inputPlotlyParams && changes.inputPlotlyParams.currentValue)) return;
    this.inputPlotlyParam$.next(this.inputPlotlyParams);
  }

  setPlotlySettings() {
    this.plotlySetting$ = combineLatest([
      this.inputPlotlyParam$,
      this.themeService.effectiveTheme$,
      this.store$.select(selectApiData),
      this.store$.select(selectApiDataStatus),
    ]).pipe(
      map(([inputPlotlyParams, effectiveTheme, apiData, apiStatus]) => {
        //
        // Combine theme, input params, and data returned from server to
        // update `plotlySettings` that completely determines graph
        //

        if (!inputPlotlyParams || !apiData || !apiStatus?.search) return null;

        // Extract vars from observables
        const isLightTheme = effectiveTheme === 'light';
        const { xDataKey, yDataKey, isMiniMode } = inputPlotlyParams;

        // For now, we're only allowing two types of graph based on presence/absence of y data
        const plotType = yDataKey ? 'scatter' : 'histogram';
        const xAxisAutorange: true | 'reversed' = plotType === 'scatter' ? 'reversed' : true;

        // Data
        const rawXData = apiData.map((el) => el[xDataKey as keyof (IApiMovum | IApiFixum)]);
        const rawYData = !yDataKey
          ? undefined
          : apiData.map((el) => el[yDataKey as keyof (IApiMovum | IApiFixum)]);
        const dataPairs = rawYData
          ? rawXData
              .map((x, index) => ({ x, y: rawYData[index] }))
              .filter(({ x, y }) => this.isPlotlyDatum(x) && this.isPlotlyDatum(y))
          : undefined;
        const xData = dataPairs
          ? dataPairs.map(({ x }) => x)
          : rawXData.filter((datum) => this.isPlotlyDatum(datum));
        const yData = dataPairs ? dataPairs.map(({ y }) => y) : undefined;
        const tooltipInfo = apiData
          .map((el) => {
            return 'jd' in el ? el.jd : el.mjd_start;
          })
          .map((el) => 'Date: ' + julianToDate(el || -1));
        const effectivePlotTitle = isMiniMode
          ? ''
          : this.breakUpText(
              !!yDataKey
                ? `${xDataKey.toUpperCase()} vs ${yDataKey.toUpperCase()}`
                : apiDataLabels[xDataKey as keyof IApiMovum]?.description || '',
            );

        // Axes Config
        const xAxisTitle = isMiniMode ? '' : xDataKey;
        const yAxisTitle = isMiniMode ? '' : yDataKey || 'Frequency';
        const yAxisRange =
          plotType === 'scatter' && !!yData
            ? [
                0,
                Math.ceil(
                  Math.max.apply(null, yData.filter((el) => typeof el === 'number') as number[]),
                ),
              ]
            : undefined;
        const xAxisTicks: 'outside' | 'inside' | '' = !!isMiniMode ? '' : 'outside';
        const yAxisTicks: 'outside' | 'inside' | '' = !!isMiniMode ? '' : 'outside';

        const size = this.getPlotSize();

        // Colors
        const fontColor: Color = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
        const markerLineColor: Color = isLightTheme
          ? 'rgba(0, 105, 97, 0.95)'
          : 'rgba(20, 220, 220, 0.95)';
        const gridColor: Color = isLightTheme ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.22)';
        const bgColor: Color = isMiniMode
          ? 'rgba(0,0,0,0)'
          : isLightTheme
            ? 'rgba(0,0,0,0.08)'
            : 'rgba(255,255,255,0.08)';
        const markerColor = isLightTheme
          ? 'rgba(0, 105, 97, 0.75)'
          : isMiniMode
            ? 'rgba(20, 220, 220, 0.9)'
            : 'rgba(20, 184, 184, 0.8)';
        const plotData = {
          x: xData,
          type: plotType,
          ...(isMiniMode ? { hoverinfo: 'skip' as const, hovertemplate: null } : {}),
          marker: {
            color: markerColor,
            size: isMiniMode ? 3 : 18,
            line: {
              color: markerLineColor,
              width: 1,
            },
          },
          ...(yData ? { y: yData } : {}),
          ...(plotType === 'scatter' ? { mode: 'markers' as const } : {}),
        } as Data;

        // Combine
        const plotlySettings: IPlotlySettings = {
          isMiniMode: !!isMiniMode,
          config: {
            displaylogo: false,
            responsive: true,
            staticPlot: !!isMiniMode,
            displayModeBar: isMiniMode ? false : 'hover',
          },
          data: [plotData],
          layout: {
            // LABELLING
            title: {
              text: effectivePlotTitle,
              font: {
                size: 18,
                color: fontColor,
              },
            },

            // PLOT SIZING
            width: !!isMiniMode ? 30 : size.width,
            height: !!isMiniMode ? 30 : size.height,

            // margin: !!isMiniMode ? { l: 0, r: 0, b: 0, t: 0 } : undefined,
            margin: !!isMiniMode ? { l: 0, r: 0, b: 0, t: 0 } : { l: 50, r: 25, b: 50, t: 100 },

            // PLOT BACKGROUND COLOR
            plot_bgcolor: bgColor,
            paper_bgcolor: bgColor,
            hovermode: isMiniMode ? false : 'closest',

            // AXES
            xaxis: {
              title: {
                text: xAxisTitle,
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: fontColor,
                },
              },
              autorange: xAxisAutorange,
              // type === 'scatter',
              // range: !!xData ? [0, Math.ceil(Math.max.apply(null, xData))] : [0, 10],
              showgrid: !isMiniMode,
              gridcolor: gridColor,
              gridwidth: 1,
              zeroline: !isMiniMode,
              zerolinecolor: gridColor,
              zerolinewidth: 1,
              ticks: xAxisTicks,
              tick0: 0,
              // dtick: 1, // Space between ticks; undefined for auto
              ticklen: 8,
              tickwidth: 1,
              tickcolor: gridColor,
              tickfont: {
                size: 14,
                color: fontColor,
              },
              showline: !isMiniMode,
              linecolor: gridColor,
              linewidth: 1,
            },
            yaxis: {
              title: {
                text: yAxisTitle,
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: fontColor,
                },
              },
              autorange: true,
              range: yAxisRange,
              showgrid: !isMiniMode,
              zeroline: !isMiniMode,
              ticks: yAxisTicks,
              tick0: 0,
              dtick: undefined,
              ticklen: 8,
              tickwidth: 1,
              tickcolor: gridColor,
              tickfont: {
                size: 14,
                color: fontColor,
              },
              showline: !isMiniMode,
              linecolor: gridColor,
              linewidth: 1,
              gridcolor: gridColor,
              gridwidth: 1,
              zerolinecolor: gridColor,
              zerolinewidth: 1,
            },
          },
        };

        return plotlySettings;
      }),
      filter((s): s is IPlotlySettings => s !== null),
    );
  }

  /**
   * Some sh***y code golf to insert <br> into text for crude plotly wrapping
   * E.g. "Heliocentric     Distance (au)" => "Heliocentric <br> Distance (au)"
   */
  breakUpText(input: string, br = '<br>', lineMax = 20) {
    const res = input
      .split(/\s+/)
      .reduce((acc: any, el) => {
        if (!acc.length) return [el]; // First event
        const lastLength = acc
          .reduce((acc2: any, el2: any) => (el2 === br ? [] : [...acc2, el2]), [])
          .join(' ').length;
        return lastLength > lineMax ? [...acc, br, el] : [...acc, el];
      }, [])
      .join(' ');
    return res;
  }

  /**
   * Logic to prevent plotly dialog being too big or too small
   */
  getPlotSize(): { width: number; height: number } {
    return {
      // width: 0.65 * window.innerWidth,
      // width: '100%',
      width: 500,
      height: window.innerHeight * 0.65,
    };
  }

  private isPlotlyDatum(input: unknown): input is number | string {
    return typeof input === 'number' || typeof input === 'string';
  }
}

@Component({
  selector: 'app-plotly-graph-wrapper',
  template: `
    <div class="plotly-dialog-content">
      <app-plotly-graph [inputPlotlyParams]="inputPlotlyParams"></app-plotly-graph>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
      }

      .plotly-dialog-content {
        box-sizing: border-box;
        padding: 16px;
      }
    `,
  ],
  imports: [
    //

    PlotlyGraphComponent,
    // PlotlyModule,
    // NgClass,
  ],
  standalone: true,
})
export class PlotlyGraphWrapperComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public inputPlotlyParams: IPlotlyGraphInput,
  ) {}
  ngOnInit() {}
}
