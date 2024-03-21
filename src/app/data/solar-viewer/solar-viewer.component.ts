import { Component, OnInit } from '@angular/core';

// import * as SolarViewer from 'sbn-solar-system-viewer';
import * as SolarViewer from 'sbn-solar-system-viewer';

@Component({
  selector: 'app-solar-viewer',
  templateUrl: './solar-viewer.component.html',
  styleUrls: ['./solar-viewer.component.scss'],
})
export class SolarViewerComponent implements OnInit {
  // --->>>

  sbnSolarViewerId = 'sbn-solar-viewer-id';

  constructor() {
    // SolarViewer
    console.log(SolarViewer);
  }

  ngOnInit(): void {
    SolarViewer.init(this.sbnSolarViewerId);
  }
}
