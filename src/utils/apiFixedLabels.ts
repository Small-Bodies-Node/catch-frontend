import { TApiFixedLabels } from '../models/TApiFixedLabels';

/**
 * Info needed to label/annotate table
 */
export const apiFixedLabels: Readonly<TApiFixedLabels> = {
  airmass: {
    description: 'Observation airmass',
    fractionSize: 1,
    label: 'Airmass',
  },
  archive_url: {
    description: 'Full frame image from data archive',
    label: 'Archive URL',
  },
  cutout_url: {
    description: 'Cutout image around target ephemeris',
    label: 'Cutout URL',
  },
  //
  date: {
    description: 'Date at which ephemeris is calculated, UTC',
    label: 'Date',
  },
  //
  exposure: {
    description: 'Exposure time (s)',
    fractionSize: 0,
    label: 'Exp',
  },
  filter: {
    description: 'Filter name',
    label: 'Filter',
  },
  maglimit: {
    description: 'Detection limit (mag. Definition varies by survey.',
    label: 'magLimit',
  },
  mjd_start: {
    description: 'Exposure start time, modified Julian date',
    label: 'MJD Start',
  },
  mjd_stop: {
    description: 'Exposure stop time, modified Julian date',
    label: 'MJD STOP',
  },
  preview_url: {
    description:
      'Preview cutout image around target ephemeris in a web image format',
    label: 'Preview URL',
  },
  product_id: {
    description: 'Unique data product identifier, format varies by data source',
    label: 'Product ID',
  },
  seeing: {
    description: 'Point source FWHM (arcsec)',
    fractionSize: 0,
    label: 'Seeing',
  },
  source: {
    description: 'Observational data source key',
    label: 'Source',
  },
  source_name: {
    description: 'Observational data source name',
    label: 'Source Name',
  },
};
