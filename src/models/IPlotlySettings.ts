import { Layout, Config, Data } from 'node_modules/@types/plotly.js';

export interface IPlotlySettings {
  isMiniMode: boolean;
  layout: Partial<Layout>;
  config: Partial<Config>;
  data: Data[];
}
