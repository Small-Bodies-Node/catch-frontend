import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TDevices } from '../../models/TDevices';
import { IAppState } from '../ngrx/reducers';
import { selectScreenDeviceEffectiveDevice } from '../ngrx/selectors/screen-device.selectors';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'],
})
export class DataDisplayComponent implements OnInit {
  // --->>>

  device: TDevices = 'desktop';

  constructor(private store$: Store<IAppState>) {
    // --->

    const x = store$
      .select(selectScreenDeviceEffectiveDevice)
      .subscribe((device) => {
        // this.device = device;
      });
  }

  ngOnInit(): void {}
}
