import { convertToDecimal } from './convertToDecimal';
import { IPanstarrsApiResponse } from '../models/IPanstarrsApiResponse';

export const distToPanstarrsCenter = (
  panstarrsApidatum: IPanstarrsApiResponse['data'][number],
  ra0: number | string,
  dec0: number | string
) => {
  //
  ra0 = convertToDecimal(ra0) || 0;
  dec0 = convertToDecimal(dec0) || 0;
  if (!ra0 || !dec0) return 0;

  const ra = +panstarrsApidatum.raMean;
  const dec = +panstarrsApidatum.decMean;
  const dist = Math.sqrt((ra - ra0) ** 2 + (dec - dec0) ** 2);
  return dist;
};
