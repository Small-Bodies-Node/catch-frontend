import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// See: https://www.npmjs.com/package/angular-plotly.js
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { DataDisplayComponent } from './data-display.component';
import { TempComponent } from './temp/temp.component';
import { SharedModule } from '../shared/shared.module';
// import { CarouselComponent } from './carousel/carousel.component';
import { TableDataCheckboxesComponent } from './table-data-checkboxes/table-data-checkboxes.component';
import {
  PlotlyGraphComponent,
  PlotlyGraphWrapperComponent,
} from './plotly-graph/plotly-graph.component';
import { MobileViewComponent } from './mobile-view/mobile-view.component';
import { TableThumbnailComponent } from './table-thumbnail/table-thumbnail.component';
import { StarOverlayComponent } from './star-overlay/star-overlay.component';
import { SolarViewerComponent } from './solar-viewer/solar-viewer.component';
import { PanstarrsOverlayComponent } from './panstarrs-overlay/panstarrs-overlay.component';
import { FitsJpgTogglerComponent } from './fits-jpg-toggler/fits-jpg-toggler.component';
import { NgxJs9Module } from '../../../projects/ngx-js9/src/public-api';
import { DesktopView2Component } from './desktop-view-2/desktop-view-2.component';
import { TableMovingComponent } from './table-moving/table-moving.component';
import { TableFixedComponent } from './table-fixed/table-fixed.component';
import { Js9DevComponent } from './js9-dev/js9-dev.component';
import { MovingViewComponent } from './moving-view/moving-view.component';
import { FixedViewComponent } from './fixed-view/fixed-view.component';
import { TitleDataComponent } from './title-data/title-data.component';
import { TitleFixedComponent } from './title-fixed/title-fixed.component';
import { FitsJpgTogglerFixedComponent } from './fits-jpg-toggler-fixed/fits-jpg-toggler-fixed.component';

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
    // CarouselComponent,
    DataDisplayComponent,
    DesktopView2Component,
    FitsJpgTogglerComponent,
    FitsJpgTogglerFixedComponent,
    FixedViewComponent,
    // ImageWheelComponent,
    Js9DevComponent,
    MobileViewComponent,
    MovingViewComponent,
    PanstarrsOverlayComponent,
    PlotlyGraphComponent,
    PlotlyGraphWrapperComponent,
    SolarViewerComponent,
    StarOverlayComponent,
    TableDataCheckboxesComponent,
    TableFixedComponent,
    TableMovingComponent,
    TableThumbnailComponent,
    TempComponent,
    TitleDataComponent,
    TitleFixedComponent,
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
