import { Component } from '@angular/core';
import { NgxJs9Module } from '../../../../../projects/ngx-js9/src/public-api';

@Component({
  selector: 'app-js9-dev',
  templateUrl: './js9-dev.component.html',
  styleUrl: './js9-dev.component.scss',
  imports: [NgxJs9Module],
  standalone: true,
})
export class Js9DevComponent {
  fitsUrl =
    'https://sbnsurveys.astro.umd.edu/api/images/urn%3Anasa%3Apds%3Agbo.ast.neat.survey%3Adata_geodss%3Ag19971029_obsdata_971029073726a?format=fits&size=5.00arcmin&ra=3.89483&dec=-11.18291';

  onFitsLoadStatusUpdate(_: any) {
    console.log('FITS LOADED');
  }
}
