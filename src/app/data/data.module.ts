import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxJs9Module } from 'projects/ngx-js9/src/public-api';

// See: https://www.npmjs.com/package/angular-plotly.js
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { DataComponent } from './data.component';
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
import { SearchFieldComponent } from '../components/search-field/search-field.component';
import { MobileViewComponent } from './mobile-view/mobile-view.component';
import { DesktopViewComponent } from './desktop-view/desktop-view.component';
import { TableThumbnailComponent } from './table-thumbnail/table-thumbnail.component';
import { StarOverlayComponent } from './star-overlay/star-overlay.component';
import { SolarViewerComponent } from './solar-viewer/solar-viewer.component';

const routes: Routes = [{ path: '', component: DataComponent }];

@NgModule({
  declarations: [
    DataComponent,
    TempComponent,
    TableComponent,
    CarouselComponent,
    ImageWheelComponent,
    TableCheckboxesComponent,
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
    NgxJs9Module,
    PlotlyModule,
  ],
})
export class DataModule {}
