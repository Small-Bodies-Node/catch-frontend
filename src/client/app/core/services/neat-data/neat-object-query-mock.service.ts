import { Injectable } from '@angular/core';
import { neatObjectQueryResultLabels } from '@client/app/utils/neatObjectQueryResultLabels';

import { Observable, of } from 'rxjs';
import { TQueryNeatObject } from './neat-object-query.service';

@Injectable({
  providedIn: 'root'
})
export class NeatObjectQueryMockService {
  constructor() {}

  /**
   * Ping initial route to determine if data for object is cached or queued
   */
  queryNeatObject(): Observable<TQueryNeatObject> {
    return of({
      status: 'success',
      results: mockResults.filter((_, ind) => ind < 300)
    });
  }

  getNeatResultLabels() {
    return of(neatObjectQueryResultLabels);
  }
}

const mockResults = [
  {
    airmass: 1.055449,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/tricam/data/p20020121/obsdata/20020121132624c.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_P20020121_OBSDATA_20020121132624C_ra177.51011_dec+15.25013_5arcmin.fits',
    ddec: 9.813682,
    dec: 15.25013,
    delta: 2.83330835777693,
    designation: '65P',
    dra: -2.64437,
    exposure: 60.0,
    filter: 'NONE',
    instrument: 'NEAT PALOMAR TRI-CAMERA',
    jd: 2452296.06034722,
    phase: 12.5942,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020121_OBSDATA_20020121132624C_ra177.51011_dec+15.25013_5arcmin.jpg',
    productid: 'P20020121_OBSDATA_20020121132624C',
    ra: 177.51011,
    rdot: -5.0789549,
    rh: 3.53153502803,
    sangle: 103.483,
    selong: 128.5424,
    source: 'neat_palomar',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020121_OBSDATA_20020121132624C_ra177.51011_dec+15.25013_5arcmin_thumb.jpg',
    tmtp: -475.346711511724,
    trueanomaly: 254.187062443957,
    unc_a: 4.967,
    unc_b: 0.359,
    unc_theta: 115.651,
    vangle: 116.105,
    vmag: 17.36
  },
  {
    airmass: 1.055584,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/tricam/data/p20020121/obsdata/20020121134124c.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_P20020121_OBSDATA_20020121134124C_ra177.50992_dec+15.25081_5arcmin.fits',
    ddec: 9.806215,
    dec: 15.25081,
    delta: 2.83316207913418,
    designation: '65P',
    dra: -2.62949,
    exposure: 60.0,
    filter: 'NONE',
    instrument: 'NEAT PALOMAR TRI-CAMERA',
    jd: 2452296.07076389,
    phase: 12.5924,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020121_OBSDATA_20020121134124C_ra177.50992_dec+15.25081_5arcmin.jpg',
    productid: 'P20020121_OBSDATA_20020121134124C',
    ra: 177.50992,
    rdot: -5.0789921,
    rh: 3.531504469794,
    sangle: 103.479,
    selong: 128.5529,
    source: 'neat_palomar',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020121_OBSDATA_20020121134124C_ra177.50992_dec+15.25081_5arcmin_thumb.jpg',
    tmtp: -475.336293843109,
    trueanomaly: 254.188539366141,
    unc_a: 4.967,
    unc_b: 0.359,
    unc_theta: 115.65,
    vangle: 116.105,
    vmag: 17.36
  },
  {
    airmass: 1.038482,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/tricam/data/p20020222/obsdata/20020222120052c.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_P20020222_OBSDATA_20020222120052C_ra174.62244_dec+17.97594_5arcmin.fits',
    ddec: 13.76413,
    dec: 17.97594,
    delta: 2.49069893970197,
    designation: '65P',
    dra: -23.1946,
    exposure: 60.0,
    filter: 'NONE',
    instrument: 'NEAT PALOMAR TRI-CAMERA',
    jd: 2452328.00094907,
    phase: 5.6655,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020222_OBSDATA_20020222120052C_ra174.62244_dec+17.97594_5arcmin.jpg',
    productid: 'P20020222_OBSDATA_20020222120052C',
    ra: 174.62244,
    rdot: -5.1794841,
    rh: 3.436865451122,
    sangle: 69.623,
    selong: 159.9563,
    source: 'neat_palomar',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020222_OBSDATA_20020222120052C_ra174.62244_dec+17.97594_5arcmin_thumb.jpg',
    tmtp: -443.404247904662,
    trueanomaly: 258.840241865385,
    unc_a: 5.65,
    unc_b: 0.393,
    unc_theta: 114.108,
    vangle: 114.761,
    vmag: 17.001
  },
  {
    airmass: 1.038667,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/tricam/data/p20020222/obsdata/20020222121552c.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_P20020222_OBSDATA_20020222121552C_ra174.62074_dec+17.97690_5arcmin.fits',
    ddec: 13.75189,
    dec: 17.9769,
    delta: 2.49063085033132,
    designation: '65P',
    dra: -23.1647,
    exposure: 60.0,
    filter: 'NONE',
    instrument: 'NEAT PALOMAR TRI-CAMERA',
    jd: 2452328.01136574,
    phase: 5.6632,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020222_OBSDATA_20020222121552C_ra174.62074_dec+17.97690_5arcmin.jpg',
    productid: 'P20020222_OBSDATA_20020222121552C',
    ra: 174.62074,
    rdot: -5.179512,
    rh: 3.436834289426,
    sangle: 69.596,
    selong: 159.9648,
    source: 'neat_palomar',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020222_OBSDATA_20020222121552C_ra174.62074_dec+17.97690_5arcmin_thumb.jpg',
    tmtp: -443.393830808811,
    trueanomaly: 258.841801513641,
    unc_a: 5.65,
    unc_b: 0.393,
    unc_theta: 114.107,
    vangle: 114.76,
    vmag: 17.001
  },
  {
    airmass: 1.038863,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/tricam/data/p20020222/obsdata/20020222123100c.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_P20020222_OBSDATA_20020222123100C_ra174.61904_dec+17.97786_5arcmin.fits',
    ddec: 13.74028,
    dec: 17.97786,
    delta: 2.49056229182259,
    designation: '65P',
    dra: -23.1321,
    exposure: 60.0,
    filter: 'NONE',
    instrument: 'NEAT PALOMAR TRI-CAMERA',
    jd: 2452328.021875,
    phase: 5.6609,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020222_OBSDATA_20020222123100C_ra174.61904_dec+17.97786_5arcmin.jpg',
    productid: 'P20020222_OBSDATA_20020222123100C',
    ra: 174.61904,
    rdot: -5.1795403,
    rh: 3.436802850562,
    sangle: 69.569,
    selong: 159.9733,
    source: 'neat_palomar',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_P20020222_OBSDATA_20020222123100C_ra174.61904_dec+17.97786_5arcmin_thumb.jpg',
    tmtp: -443.383321113419,
    trueanomaly: 258.843375054611,
    unc_a: 5.65,
    unc_b: 0.393,
    unc_theta: 114.107,
    vangle: 114.76,
    vmag: 17.001
  },
  {
    airmass: 1.170283,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971002/obsdata/971002110736a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971002_OBSDATA_971002110736A_ra008.14763_dec-10.75019_5arcmin.fits',
    ddec: -6.94458,
    dec: -10.75019,
    delta: 2.43843648768196,
    designation: '65P',
    dra: -28.3707,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450723.96372685,
    phase: 4.1893,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971002_OBSDATA_971002110736A_ra008.14763_dec-10.75019_5arcmin.jpg',
    productid: 'G19971002_OBSDATA_971002110736A',
    ra: 8.14763,
    rdot: 5.1629701,
    rh: 3.416742577247,
    sangle: 181.7,
    selong: 165.55,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971002_OBSDATA_971002110736A_ra008.14763_dec-10.75019_5arcmin_thumb.jpg',
    tmtp: 435.936404454987,
    trueanomaly: 99.5402284444635,
    unc_a: 0.457,
    unc_b: 0.358,
    unc_theta: 61.675,
    vangle: 60.777,
    vmag: 16.937
  },
  {
    airmass: 1.170389,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971002/obsdata/971002112309a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971002_OBSDATA_971002112309A_ra008.14556_dec-10.75069_5arcmin.fits',
    ddec: -6.9305,
    dec: -10.75069,
    delta: 2.43848825593616,
    designation: '65P',
    dra: -28.3531,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450723.97452546,
    phase: 4.1907,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971002_OBSDATA_971002112309A_ra008.14556_dec-10.75069_5arcmin.jpg',
    productid: 'G19971002_OBSDATA_971002112309A',
    ra: 8.14556,
    rdot: 5.1629451,
    rh: 3.416774776266,
    sangle: 181.747,
    selong: 165.545,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971002_OBSDATA_971002112309A_ra008.14556_dec-10.75069_5arcmin_thumb.jpg',
    tmtp: 435.947222992778,
    trueanomaly: 99.5418746695262,
    unc_a: 0.457,
    unc_b: 0.358,
    unc_theta: 61.676,
    vangle: 60.778,
    vmag: 16.938
  },
  {
    airmass: 1.170443,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971002/obsdata/971002113659a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971002_OBSDATA_971002113659A_ra008.14371_dec-10.75114_5arcmin.fits',
    ddec: -6.91818,
    dec: -10.75114,
    delta: 2.43853448306396,
    designation: '65P',
    dra: -28.3341,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450723.98413195,
    phase: 4.1919,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971002_OBSDATA_971002113659A_ra008.14371_dec-10.75114_5arcmin.jpg',
    productid: 'G19971002_OBSDATA_971002113659A',
    ra: 8.14371,
    rdot: 5.1629229,
    rh: 3.416803420508,
    sangle: 181.789,
    selong: 165.5405,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971002_OBSDATA_971002113659A_ra008.14371_dec-10.75114_5arcmin_thumb.jpg',
    tmtp: 435.956847205292,
    trueanomaly: 99.5433391316038,
    unc_a: 0.457,
    unc_b: 0.358,
    unc_theta: 61.677,
    vangle: 60.779,
    vmag: 16.938
  },
  {
    airmass: 1.302671,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971029/obsdata/971029072300a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971029_OBSDATA_971029072300A_ra003.89604_dec-11.18307_5arcmin.fits',
    ddec: 2.36028,
    dec: -11.18307,
    delta: 2.66347304574407,
    designation: '65P',
    dra: -17.718,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450750.80775463,
    phase: 10.1718,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029072300A_ra003.89604_dec-11.18307_5arcmin.jpg',
    productid: 'G19971029_OBSDATA_971029072300A',
    ra: 3.89604,
    rdot: 5.0898035,
    rh: 3.496244736359,
    sangle: 230.838,
    selong: 141.5449,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029072300A_ra003.89604_dec-11.18307_5arcmin_thumb.jpg',
    tmtp: 462.830078808591,
    trueanomaly: 103.539389967642,
    unc_a: 0.424,
    unc_b: 0.327,
    unc_theta: 63.427,
    vangle: 62.138,
    vmag: 17.197
  },
  {
    airmass: 1.281664,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971029/obsdata/971029072537a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971029_OBSDATA_971029072537A_ra003.89582_dec-11.18304_5arcmin.fits',
    ddec: 2.362701,
    dec: -11.18304,
    delta: 2.66349429827879,
    designation: '65P',
    dra: -17.7187,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450750.80957176,
    phase: 10.1722,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029072537A_ra003.89582_dec-11.18304_5arcmin.jpg',
    productid: 'G19971029_OBSDATA_971029072537A',
    ra: 3.89582,
    rdot: 5.0897978,
    rh: 3.496250077643,
    sangle: 230.839,
    selong: 141.543,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029072537A_ra003.89582_dec-11.18304_5arcmin_thumb.jpg',
    tmtp: 462.831899340264,
    trueanomaly: 103.539654557312,
    unc_a: 0.424,
    unc_b: 0.327,
    unc_theta: 63.427,
    vangle: 62.138,
    vmag: 17.197
  },
  {
    airmass: 1.305257,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971029/obsdata/971029073726a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971029_OBSDATA_971029073726A_ra003.89483_dec-11.18291_5arcmin.fits',
    ddec: 2.37368,
    dec: -11.18291,
    delta: 2.66359034523139,
    designation: '65P',
    dra: -17.7206,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450750.81777778,
    phase: 10.1741,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029073726A_ra003.89483_dec-11.18291_5arcmin.jpg',
    productid: 'G19971029_OBSDATA_971029073726A',
    ra: 3.89483,
    rdot: 5.0897723,
    rh: 3.496274198402,
    sangle: 230.844,
    selong: 141.5345,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029073726A_ra003.89483_dec-11.18291_5arcmin_thumb.jpg',
    tmtp: 462.840120723005,
    trueanomaly: 103.5408494143,
    unc_a: 0.424,
    unc_b: 0.327,
    unc_theta: 63.427,
    vangle: 62.138,
    vmag: 17.197
  },
  {
    airmass: 1.28431,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971029/obsdata/971029074044a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971029_OBSDATA_971029074044A_ra003.89455_dec-11.18287_5arcmin.fits',
    ddec: 2.376757,
    dec: -11.18287,
    delta: 2.66361718908494,
    designation: '65P',
    dra: -17.7208,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450750.82006945,
    phase: 10.1746,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029074044A_ra003.89455_dec-11.18287_5arcmin.jpg',
    productid: 'G19971029_OBSDATA_971029074044A',
    ra: 3.89455,
    rdot: 5.0897651,
    rh: 3.496280934497,
    sangle: 230.846,
    selong: 141.5322,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029074044A_ra003.89455_dec-11.18287_5arcmin_thumb.jpg',
    tmtp: 462.842416679487,
    trueanomaly: 103.541183094738,
    unc_a: 0.424,
    unc_b: 0.327,
    unc_theta: 63.427,
    vangle: 62.138,
    vmag: 17.197
  },
  {
    airmass: 1.307821,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971029/obsdata/971029075156a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971029_OBSDATA_971029075156A_ra003.89362_dec-11.18275_5arcmin.fits',
    ddec: 2.387228,
    dec: -11.18275,
    delta: 2.66370836474123,
    designation: '65P',
    dra: -17.72,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450750.82784722,
    phase: 10.1763,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029075156A_ra003.89362_dec-11.18275_5arcmin.jpg',
    productid: 'G19971029_OBSDATA_971029075156A',
    ra: 3.89362,
    rdot: 5.0897409,
    rh: 3.496303796326,
    sangle: 230.851,
    selong: 141.5241,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029075156A_ra003.89362_dec-11.18275_5arcmin_thumb.jpg',
    tmtp: 462.850209016353,
    trueanomaly: 103.542315576549,
    unc_a: 0.424,
    unc_b: 0.327,
    unc_theta: 63.428,
    vangle: 62.139,
    vmag: 17.197
  },
  {
    airmass: 1.286419,
    archive_url:
      'https://catchstage.astro.umd.edu/catch-images/archive/neat/geodss/data/g19971029/obsdata/971029075300a.fits',
    cutout_url:
      'https://catchstage.astro.umd.edu/catch-images/cutout/65P_G19971029_OBSDATA_971029075300A_ra003.89353_dec-11.18274_5arcmin.fits',
    ddec: 2.388227,
    dec: -11.18274,
    delta: 2.66371705372097,
    designation: '65P',
    dra: -17.7199,
    exposure: 20.0,
    filter: 'NONE',
    instrument: 'NEAT-MAUI CAMERA',
    jd: 2450750.82858796,
    phase: 10.1765,
    preview_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029075300A_ra003.89353_dec-11.18274_5arcmin.jpg',
    productid: 'G19971029_OBSDATA_971029075300A',
    ra: 3.89353,
    rdot: 5.0897386,
    rh: 3.496305973636,
    sangle: 230.852,
    selong: 141.5234,
    source: 'neat_maui_geodss',
    thumbnail_url:
      'https://catchstage.astro.umd.edu/catch-images/thumbnails/65P_G19971029_OBSDATA_971029075300A_ra003.89353_dec-11.18274_5arcmin_thumb.jpg',
    tmtp: 462.850951143075,
    trueanomaly: 103.542423431123,
    unc_a: 0.424,
    unc_b: 0.327,
    unc_theta: 63.428,
    vangle: 62.139,
    vmag: 17.197
  },
  {
    airmass: 1.04074,
    archive_url: null,
    cutout_url:
      'http://api.skymapper.nci.org.au/public/siap/dr2/get_image?IMAGE=20170806095706-22&SIZE=0.08333333333333333&POS=237.22443,-23.40756&FORMAT=fits',
    ddec: -7.3703,
    dec: -23.40756,
    delta: 2.48214777939122,
    designation: '65P',
    dra: 17.43615,
    exposure: 100.0,
    filter: 'i',
    instrument: null,
    jd: 2457971.91524305,
    phase: 19.3915,
    preview_url:
      'http://api.skymapper.nci.org.au/public/siap/dr2/get_image?IMAGE=20170806095706-22&SIZE=0.08333333333333333&POS=237.22443,-23.40756&FORMAT=png',
    productid: '20170806095706-22',
    ra: 237.22443,
    rdot: -1.0607036,
    rh: 2.93213028535,
    sangle: 281.493,
    selong: 106.2424,
    source: 'skymapper',
    thumbnail_url: null,
    tmtp: -71.3395705223083,
    trueanomaly: 344.243630055269,
    unc_a: 0.131,
    unc_b: 0.115,
    unc_theta: 94.415,
    vangle: 113.105,
    vmag: 16.528
  }
];
