import { createEffect } from '@ngrx/effects';
import { of, BehaviorSubject, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { IScreenDevice } from '../../../models/IScreenDevice';
import { getDevice } from '../../../utils/getDevice';
import {
  ScreenDeviceAction_SetDevice,
  ScreenDeviceAction_SetScreenWidth,
  ScreenDeviceAction_SetScreenHeight,
} from '../actions/screen-device.actions';
import { winHeight, winWidth } from '../../../utils/animation-constants';

const resizeEvent$ = new BehaviorSubject<Partial<IScreenDevice>>({
  device: getDevice(),
  screenWidthPxls: winWidth,
  screenHeightPxls: winHeight,
});

const handleResize = () => {
  console.log('Screen Resize!!!');
  setTimeout(() => {
    resizeEvent$.next({
      device: getDevice(),
      screenWidthPxls: winWidth,
      screenHeightPxls: winHeight,
    });
  }, 500);
};

try {
  window.addEventListener('resize', handleResize);
} catch (err) {
  console.log('Nope: window aint here');
}

export const checkScreen$ = createEffect(
  () => {
    return resizeEvent$.asObservable().pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((screenDevice) => {
        return concat(
          of(ScreenDeviceAction_SetDevice({ device: screenDevice.device! })),
          of(
            ScreenDeviceAction_SetScreenWidth({
              width: screenDevice.screenWidthPxls!,
            })
          ),
          of(
            ScreenDeviceAction_SetScreenHeight({
              height: screenDevice.screenHeightPxls!,
            })
          )
        );
      })
    );
  },
  { functional: true }
);
