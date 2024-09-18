export interface IPlotlyPayLoad {
  xData: number[];
  yData?: number[];
  tooltipInfo?: string[];
  type: 'histogram' | 'scatter';
  xAxisTitle: string;
  yAxisTitle: string;
  plotTitle: string;
  description: string;
}
