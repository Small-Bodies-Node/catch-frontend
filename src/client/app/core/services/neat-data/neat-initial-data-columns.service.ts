import { Injectable } from '@angular/core';

export const initialColumnState = {
  source: true,
  raDec: true,
  delta: true,
  rh: true,
  tmtp: true,
  designation: true,
  dra: true,
  vmag: true,
  //
  airmass: false,
  archive_url: false,
  cutout_url: false,
  ddec: false,
  exposure: false,
  filter: false,
  instrument: false,
  jd: false,
  phase: false,
  preview_url: false,
  productid: false,
  rdot: false,
  sangle: false,
  selong: false,
  trueanomaly: false,
  unc_a: false,
  unc_b: false,
  unc_theta: false,
  vangle: false
};

export type TColName = keyof typeof initialColumnState;

export type TColInitState = typeof initialColumnState;
// export type TColInitState = { [TColName]: boolean };

@Injectable({
  providedIn: 'root'
})
export class NeatInitialDataColumnsService {
  constructor() {}

  getOrderedColNames(): TColName[] {
    return Object.keys(initialColumnState) as any;
  }

  getInitColumnState(): TColInitState {
    return { ...initialColumnState };
  }
}
