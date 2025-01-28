import { IApiMovum } from '../models/IApiMovum';

import { decimalToSexagesimal } from 'geolib';

/**
 * ...
 */
export const cutoutUrlBuilder = (apiDatum: IApiMovum) => {
  //

  const { product_id, ra, dec } = apiDatum;

  // console.log('>>>>', decimalToSexagesimal(ra), '<<<');

  const raSexagesimal = decimalToSexagesimal(ra)
    .replace('° ', ':')
    .replace("' ", ':')
    .replace('"', '')
    .trim();
  const decSexagesimal = decimalToSexagesimal(dec)
    .replace('° ', ':')
    .replace("' ", ':')
    .replace('"', '')
    .trim();

  const cutoutUrlBase = 'https://d1cqmi7e27sab9.cloudfront.net/api/images/';
  const url =
    cutoutUrlBase +
    product_id +
    '?ra=' +
    raSexagesimal +
    '&dec=' +
    decSexagesimal +
    '&size=5arcmin&format=jpeg';

  console.log(url);

  return '';
  return url;

  // product_id: 'urn:nasa:pds:gbo.ast.catalina.survey:data_calibrated:703_20211011_2b_n28024_01_0004.arch',
  // https://d1cqmi7e27sab9.cloudfront.net/api/images/urn:nasa:pds:gbo.ast.catalina.survey:data_calibrated:703_20220206_2b_n28014_01_0002.arch?ra=4:15:42.6264&dec=29:46:45.732&size=5arcmin&format=jpeg
};
