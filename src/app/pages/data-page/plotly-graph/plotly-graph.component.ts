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
import { selectSiteSettingsTheme } from '../../../ngrx/selectors/site-settings.selectors';
import { apiDataLabels } from '../../../../utils/apiDataLabels';
import { julianToDate } from '../../../../utils/julianToDate';
import { IApiFixum } from '../../../../models/IApiFixum';
import { AsyncPipe, NgClass } from '@angular/common';

import { PlotlyComponent, PlotlyService } from 'angular-plotly.js';
import Plotly, { Layout, Margin } from 'plotly.js-dist-min';

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

  constructor(private store$: Store<IAppState>) {
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
      this.store$.select(selectSiteSettingsTheme),
      this.store$.select(selectApiData),
      this.store$.select(selectApiDataStatus),
    ]).pipe(
      map(([inputPlotlyParams, siteTheme, apiData, apiStatus]) => {
        //
        // Combine siteTheme, input params, and data returned from server to
        // update `plotlySettings` that completely determines graph
        //

        if (!inputPlotlyParams || !apiData || !apiStatus?.search) return null;

        // Extract vars from observables
        const isLightTheme = !!siteTheme.includes('LIGHT');
        const { xDataKey, isMiniMode } = inputPlotlyParams;
        const yDataKey = xDataKey === 'ra' ? 'dec' : undefined;

        // For now, we're only allowing two types of graph based on presence/absence of y data
        const plotType = yDataKey ? 'scatter' : 'histogram';

        // Data
        const xData = apiData.map((el) => el[xDataKey as keyof (IApiMovum | IApiFixum)]);
        const yData = !yDataKey
          ? undefined
          : apiData.map((el) => el[yDataKey as keyof (IApiMovum | IApiFixum)]);
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
        const markerLineColor: Color = 'rgba(103,169,253,1.0)';
        const gridColor: Color = 'white';
        const bgColor: Color = isLightTheme ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
        const markerColor = isLightTheme
          ? 'rgba(black,0.5)'
          : isMiniMode
          ? 'rgba(53,119,203,1.0)'
          : 'rgba(53,119,203,0.8)';

        // Combine
        const plotlySettings: IPlotlySettings = {
          isMiniMode: !!isMiniMode,
          config: {
            displaylogo: false,
            responsive: true,
            displayModeBar: 'hover',
          },
          data: [
            {
              //@ts-ignore
              x: xData,
              //@ts-ignore
              y: !!yData ? yData : undefined,
              // text: tooltipInfo,
              type: plotType,
              marker: {
                color: markerColor,
                size: isMiniMode ? 3 : 18,
                line: {
                  color: markerLineColor,
                  width: 1,
                },
              },
              mode: 'markers',
            },
          ],
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
            // height: !!isMiniMode ? 30 : size.height,

            // width: !!isMiniMode ? 30 : 500,
            height: !!isMiniMode ? 30 : undefined,

            // autosize: !isMiniMode,

            // margin: !!isMiniMode ? { l: 0, r: 0, b: 0, t: 0 } : undefined,
            margin: !!isMiniMode ? { l: 0, r: 0, b: 0, t: 0 } : { l: 50, r: 25, b: 50, t: 100 },

            // PLOT BACKGROUND COLOR
            plot_bgcolor: bgColor,
            paper_bgcolor: bgColor,

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
              autorange: 'reversed',
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
}

@Component({
  selector: 'app-plotly-graph-wrapper',
  template: ` <app-plotly-graph [inputPlotlyParams]="inputPlotlyParams"></app-plotly-graph> `,
  styles: [``],
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
