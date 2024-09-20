import { createEffect } from '@ngrx/effects';
import { of, BehaviorSubject, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { IScreenDevice } from '../../../models/IScreenDevice';
import { getDevice } from '../../../utils/get-device';
import {
  ScreenDeviceAction_SetDevice,
  ScreenDeviceAction_SetScreenWidth,
  ScreenDeviceAction_SetScreenHeight,
} from '../actions/screen-device.actions';

const resizeEvent$ = new BehaviorSubject<Partial<IScreenDevice>>({
  device: getDevice(),
  screenWidthPxls: window.innerWidth,
  screenHeightPxls: window.innerHeight,
});

const handleResize = () => {
  console.log('Resize!!!');
  setTimeout(() => {
    resizeEvent$.next({
      device: getDevice(),
      screenWidthPxls: window.innerWidth,
      screenHeightPxls: window.innerHeight,
    });
  }, 500);
};

window.addEventListener('resize', handleResize);

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
