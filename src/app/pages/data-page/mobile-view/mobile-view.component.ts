import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TitleDataComponent } from '../title-data/title-data.component';
import { TableDataComponent } from '../table-data/table-data.component';
import { FitsJpgTogglerComponent } from '../fits-jpg-toggler/fits-jpg-toggler.component';
import { SolarViewerComponent } from '../solar-viewer/solar-viewer.component';

@Component({
  selector: 'app-mobile-view',
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.scss'],
  imports: [TitleDataComponent, TableDataComponent, FitsJpgTogglerComponent, SolarViewerComponent],
  standalone: true,
})
export class MobileViewComponent implements OnInit {
  // --->>>

  subscriptions = new Subscription();

  constructor() {
    // --->

    this.subscriptions.add();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
