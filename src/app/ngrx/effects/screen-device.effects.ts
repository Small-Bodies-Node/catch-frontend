import { Injectable } from '@angular/core';
import { createEffect, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, BehaviorSubject, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { IScreenDevice } from 'src/app/models/IScreenDevice';
import { getDevice } from 'src/app/utils/get-device';

import {
  ScreenDeviceSetDevice,
  ScreenDeviceSetScreenWidth,
  ScreenDeviceActions,
  ScreenDeviceSetScreenHeight,
} from '../actions/screen-device.actions';

@Injectable()
export class ScreenDeviceEffects {
  // --->>>

  resizeEvent$ = new BehaviorSubject<Partial<IScreenDevice>>({
    device: getDevice(),
    screenWidthPxls: window.innerWidth,
    screenHeightPxls: window.innerHeight,
  });

  constructor() {
    window.addEventListener('resize', () => {
      console.log('Resize!!!');
      setTimeout(() => {
        this.resizeEvent$.next({
          device: getDevice(),
          screenWidthPxls: window.innerWidth,
          screenHeightPxls: window.innerHeight,
        });
      }, 500);
    });
  }

  checkScreen$: Observable<ScreenDeviceActions> = createEffect(() => {
    return this.resizeEvent$.asObservable().pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((_) => {
        return concat(
          of(new ScreenDeviceSetDevice({ device: _.device! })),
          of(new ScreenDeviceSetScreenWidth({ width: _.screenWidthPxls! })),
          of(new ScreenDeviceSetScreenHeight({ height: _.screenHeightPxls! }))
        );
      })
    );
  });
}
