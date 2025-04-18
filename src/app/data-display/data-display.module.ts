import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// See: https://www.npmjs.com/package/angular-plotly.js
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { DataDisplayComponent } from './data-display.component';
import { TempComponent } from './temp/temp.component';
import { TableComponent } from './table/table.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselComponent } from './carousel/carousel.component';
import { ImageWheelComponent } from './image-wheel/image-wheel.component';
import { TableCheckboxesComponent } from './table-checkboxes/table-checkboxes.component';
import {
  PlotlyGraphComponent,
  PlotlyGraphWrapperComponent,
} from './plotly-graph/plotly-graph.component';
import { TitleComponent } from './title/title.component';
import { MobileViewComponent } from './mobile-view/mobile-view.component';
import { DesktopViewComponent } from './desktop-view/desktop-view.component';
import { TableThumbnailComponent } from './table-thumbnail/table-thumbnail.component';
import { StarOverlayComponent } from './star-overlay/star-overlay.component';
import { SolarViewerComponent } from './solar-viewer/solar-viewer.component';
import { PanstarrsOverlayComponent } from './panstarrs-overlay/panstarrs-overlay.component';
import { DesktopView1Component } from './desktop-view-1/desktop-view-1.component';
import { FitsJpgTogglerComponent } from './fits-jpg-toggler/fits-jpg-toggler.component';
import { NgxJs9Module } from '../../../projects/ngx-js9/src/public-api';
import { DesktopView2Component } from './desktop-view-2/desktop-view-2.component';
import { Table1Component } from './table-1/table-1.component';
import { Js9DevComponent } from './js9-dev/js9-dev.component';

const routes: Routes = [
  { path: '', component: DataDisplayComponent },
  //
  {
    path: 'js9',
    component: Js9DevComponent,
    // pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    CarouselComponent,
    DataDisplayComponent,
    DesktopViewComponent,
    DesktopView1Component,
    DesktopView2Component,
    FitsJpgTogglerComponent,
    ImageWheelComponent,
    Js9DevComponent,
    MobileViewComponent,
    PanstarrsOverlayComponent,
    PlotlyGraphComponent,
    PlotlyGraphWrapperComponent,
    SolarViewerComponent,
    StarOverlayComponent,
    TableCheckboxesComponent,
    TableComponent,
    Table1Component,
    TableThumbnailComponent,
    TempComponent,
    TitleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxJs9Module,
    PlotlyModule,
  ],
})
export class DataDisplayModule {}
