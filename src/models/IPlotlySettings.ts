// import { Layout, Config, Data } from 'node_modules/@types/plotly.js';

import { Config, Data, Layout } from 'plotly.js-dist-min';

export interface IPlotlySettings {
  isMiniMode: boolean;
  layout: Partial<Layout>;
  config: Partial<Config>;
  data: Data[];
}
