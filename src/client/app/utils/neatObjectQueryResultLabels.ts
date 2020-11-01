import { INeatObjectQueryResultLabels } from '../models/neat-object-query-result-labels.model';

export const neatObjectQueryResultLabels: INeatObjectQueryResultLabels = {
  airmass: { description: 'Observation airmass', fractionSize: 1, label: 'Airmass' },
  archive_url: { description: 'Full frame image from data archive', label: 'Archive URL' },
  cutout_url: { description: 'Cutout image around target ephemeris', label: 'Cutout URL' },
  ddec: {
    description: 'Declination rate of change: dDec/dt (arcsec/hr)',
    fractionSize: 2,
    label: 'd[Dec]/dt'
  },
  dec: { description: 'Object Declination (deg)', fractionSize: 4, label: 'Dec' },
  delta: { description: 'Observer-target distance (au)', fractionSize: 3, label: '\u0394' },
  designation: { description: 'Object designation', label: 'Designation' },
  dra: {
    description: 'Right Ascension rate of change: dRA/dt cos(Dec) (arcsec/hr)',
    fractionSize: 2,
    label: 'd[RA]/dt'
  },
  exposure: { description: 'Exposure time', fractionSize: 0, label: 'Exp' },
  filter: { description: 'Filter name', label: 'Filter' },
  instrument: { description: 'NEAT instrument name', label: 'Instrument' },
  jd: {
    description: 'Mid-time of the observation as a Julian Date (UT)',
    fractionSize: 4,
    label: 'Date'
  },
  phase: { description: 'Sun-observer-target angle (deg)', fractionSize: 1, label: 'Phase' },
  productid: { description: 'Unique NEAT product ID', label: 'Product ID' },
  ra: { description: 'Object Right Ascension (deg)', fractionSize: 4, label: 'RA' },
  rdot: {
    description: 'Heliocentric radial velocity (km/s)',
    fractionSize: 1,
    label: 'd[rh]/dt'
  },
  rh: { description: 'Heliocentric distance (au)', fractionSize: 3, label: 'rh' },
  sangle: {
    description: 'Position angle of projected target-Sun vector, east of Celestial north (deg)',
    fractionSize: 0,
    label: 'PA(\u2299)'
  },
  selong: { description: 'Solar elongation (deg)', fractionSize: 0, label: 'E(\u2299)' },
  tmtp: {
    description: 'Time to nearest perihelion based on osculating orbital elements (days)',
    fractionSize: 1,
    label: 'T-T\u209a'
  },
  trueanomaly: {
    description: 'True anomaly based on osculating orbital elements (deg)',
    fractionSize: 1,
    label: '\u03bd'
  },
  unc_a: {
    description: 'Error ellipse semi-major axis (arcsec)',
    fractionSize: 2,
    label: '\u03c3(a)'
  },
  unc_b: {
    description: 'Error ellipse semi-minor axis (arcsec)',
    fractionSize: 2,
    label: '\u03c3(b)'
  },
  unc_theta: {
    description: 'Error ellipse position angle (deg)',
    fractionSize: 0,
    label: '\u03c3(\u03b8)'
  },
  vangle: {
    description:
      'Position angle of projected target velocity   vector, east of Celestial north (deg)',
    fractionSize: 0,
    label: 'PA(v)'
  },
  vmag: {
    description:
      'Predicted V-band brightness (mag); For comet ephemerides from JPL, this value is T-mag, if available, otherwise N-mag',
    fractionSize: 1,
    label: 'V'
  }
};
