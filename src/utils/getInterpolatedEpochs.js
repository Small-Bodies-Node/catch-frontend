'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getInterpolatedEpochs = getInterpolatedEpochs;
const sbn_solar_viewer_1 = require('sbn-solar-viewer');
const jd1994 = (0, sbn_solar_viewer_1.dateToJulianDay)(new Date('1994-01-01T00:00:00Z'));
const jd2074 = (0, sbn_solar_viewer_1.dateToJulianDay)(new Date('2074-01-01T00:00:00Z'));
/**
 * Receive a start date and end date and return an array of julian days for years
 * between the start and end date.
 */
function getInterpolatedEpochs(startDate = jd1994, endDate = jd2074) {
  // console.log('startDate', startDate);
  // console.log('endDate', endDate);
  if (startDate === endDate) {
    return [startDate];
  }
  if (startDate > endDate) {
    // throw new Error('Start date must be before end date');
    console.error('Start date must be before end date');
    alert('Start date must be before end date');
    return [startDate];
  }
  const year = 365.25;
  const stepsPerYear = 1;
  const totalYears = Math.ceil((endDate - startDate) / year);
  const totalEpochs = totalYears * stepsPerYear;
  const stepSize = year / stepsPerYear;
  const epochs = Array.from({ length: totalEpochs }, (_, i) => startDate + i * stepSize);
  return epochs;
}
