import { INeatObjectQueryResultLabels } from '../models/neat-object-query-result-labels.model';

import apiLabels from '../../assets/json/catch-data-labels.json';

export const neatObjectQueryResultLabels: INeatObjectQueryResultLabels = {
  ...apiLabels,
  raDec: {
    label: 'RA/Dec',
    description: 'RA/Dec',
    fractionSize: 4
  }
};
