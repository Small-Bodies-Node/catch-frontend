import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TDevices } from '../../models/TDevices';
import { IAppState } from '../ngrx/reducers';
import { selectScreenDeviceEffectiveDevice } from '../ngrx/selectors/screen-device.selectors';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'],
  standalone: false,
})
export class DataDisplayComponent implements OnInit, OnDestroy {
  device: TDevices = 'desktop';
  subscriptions = new Subscription();
  isMovingRoute = false;
  isDataReady = false;

  constructor(private router: Router) {
    this.isMovingRoute = this.router.url.includes('/data');

    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.isMovingRoute = event.url.includes('/data');
        })
    );

    setTimeout(() => {
      this.isDataReady = true;
    }, 1000);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
