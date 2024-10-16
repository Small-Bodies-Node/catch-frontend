import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxJs9Module } from '../../../projects/ngx-js9/src/public-api';

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

const routes: Routes = [{ path: '', component: DataDisplayComponent }];

@NgModule({
  declarations: [
    DataDisplayComponent,
    TempComponent,
    TableComponent,
    CarouselComponent,
    ImageWheelComponent,
    TableCheckboxesComponent,
    PanstarrsOverlayComponent,
    PlotlyGraphComponent,
    PlotlyGraphWrapperComponent,
    TitleComponent,
    MobileViewComponent,
    DesktopViewComponent,
    TableThumbnailComponent,
    StarOverlayComponent,
    SolarViewerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    // NgxJs9Module,
    PlotlyModule,
  ],
})
export class DataDisplayModule {}
