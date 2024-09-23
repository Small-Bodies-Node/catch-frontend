import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, fromEvent, debounceTime } from 'rxjs';

import { IAppState } from '../../ngrx/reducers';
import { selectScreenDeviceSubstate } from '../../ngrx/selectors/screen-device.selectors';
import { selectSiteSettingsTheme } from '../../ngrx/selectors/site-settings.selectors';
import { simpleUid } from '../../../utils/simple-uid';

@Component({
  selector: 'app-comet-animations',
  templateUrl: './comet-animations.component.html',
  styleUrls: ['./comet-animations.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CometAnimationsComponent implements OnInit, AfterViewInit {
  // --->>>

  @ViewChild('cometContainer')
  cometContainer!: ElementRef<HTMLDivElement>;

  comets: string[] = [];
  interval: number = -1;
  screenWidthPxls!: number;
  screenHeightPxls!: number;
  observer?: MutationObserver;
  subscriptions = new Subscription();
  resize$ = fromEvent(window, 'resize');

  backgroundImage = 'url("../../../assets/images/pngs/dark_comet_v1.png")';

  constructor(private store$: Store<IAppState>) {
    this.subscriptions.add(
      this.store$.select(selectScreenDeviceSubstate).subscribe((device) => {
        this.screenWidthPxls = device.screenWidthPxls;
        this.screenHeightPxls = device.screenHeightPxls;
      })
    );

    this.subscriptions.add(
      this.store$.select(selectSiteSettingsTheme).subscribe((siteTheme) => {
        this.backgroundImage = `url("../../../assets/images/pngs/${
          siteTheme === 'DARK-THEME' ? 'dark' : 'light'
        }_comet_v1.png")`;
      })
    );
    this.subscriptions.add(
      this.resize$
        .pipe(
          debounceTime(500) // He waits > 0.5s between 2 events emitted before running the next.
        )
        .subscribe((_) => {
          this.comets = [];
        })
    );
  }

  ngOnInit() {
    // --->>

    /**
     * MutationObserver is a browser API
     * Here, we're creating an observer to emit events detailing changes to the DOM
     */
    this.observer = new MutationObserver((mutations, xxx) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // --->>

          // Isolate newly div added
          const newDiv: HTMLDivElement = node as any;

          // Compute initial and final positions of comet
          const offscreenDisplacementPxls = 200;
          let x1 = 0 - offscreenDisplacementPxls;
          let x2 = this.screenWidthPxls + offscreenDisplacementPxls;
          let y1 = Math.round(this.screenHeightPxls * 0.5 * Math.random());
          let y2 = Math.round(this.screenHeightPxls * 0.5 * Math.random());

          // Compute initial angle
          let angle =
            (1 / Math.PI) * 180 * Math.atan((y2 - y1) / (x2 - x1)) + 180;

          // Randomly swap direction/angle of travel
          if (Math.random() < 0.5) {
            let temp = y1;
            y1 = y2;
            y2 = temp;
            temp = x1;
            x1 = x2;
            x2 = temp;
            angle += 180;
          }

          // Set animation CSS
          newDiv.animate(
            [
              {
                transform: `translateX(${x1}px) translateY(${y1}px) rotate(${angle}deg)`,
              },
              {
                transform: `translateX(${x2}px) translateY(${y2}px) rotate(${angle}deg)`,
              },
            ],
            { duration: 15000, fill: 'forwards', easing: 'linear' }
          );
        });
      });
    });
  }

  ngAfterViewInit() {
    /**
     * Start observing DOM changes within the 'cometContainer' div
     */
    if (this.observer) {
      this.observer.observe(this.cometContainer.nativeElement, {
        attributes: true,
        childList: true,
        characterData: true,
      });
    }

    /**
     * Start adding/removing strings to array that ng will
     * convert to DOM nodes
     */
    setTimeout(() => {
      this.interval = this.mySetInterval(this.updateComets, 5000);
    }, 100);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    clearInterval(this.interval);
    this.subscriptions.unsubscribe();
  }

  updateComets = () => {
    this.comets = [...this.comets, 'comet-id-' + simpleUid()];
    // Limit comet elements in DOM
    if (this.comets.length > 10) this.comets = this.comets.slice(1);
  };

  mySetInterval(callback: () => void, timeMs: number): number {
    callback();
    return setInterval(callback, timeMs) as any as number;
  }
}
