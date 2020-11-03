import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AppState } from '@client/app/ngrx/reducers';
import { simpleUid } from '@client/app/utils/simple-uid';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  selectScreenDeviceSubstate
  // selectScreenDeviceEffectiveDevice
} from '../../../ngrx/selectors/screen-device.selectors';

@Component({
  selector: 'app-comet-animations-css',
  templateUrl: './comet-animations-css.component.html',
  styleUrls: ['./comet-animations-css.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CometAnimationsCssComponent implements OnInit, AfterViewInit, OnDestroy {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  @ViewChild('cometContainer')
  cometContainer!: ElementRef<HTMLDivElement>;

  interval: number = -1;

  comets: string[] = [];

  observer!: MutationObserver;

  screenWidthPxls!: number;
  screenHeightPxls!: number;

  subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {
    this.subscriptions.add(
      this.store.select(selectScreenDeviceSubstate).subscribe(device => {
        this.screenWidthPxls = device.screenWidthPxls;
        this.screenHeightPxls = device.screenHeightPxls;
      })
    );
  }

  ngOnInit() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          const el: HTMLDivElement = node as any;
          //
          const dx = 200;
          let x1 = 0 - dx;
          let x2 = this.screenWidthPxls + dx;
          let y1 = Math.round(this.screenHeightPxls * 0.5 * Math.random());
          let y2 = Math.round(this.screenHeightPxls * 0.5 * Math.random());

          let angle = (1 / Math.PI) * 180 * Math.atan((y2 - y1) / (x2 - x1)) + 180;

          if (Math.random() < 0.5) {
            let temp = y1;
            y1 = y2;
            y2 = temp;

            temp = x1;
            x1 = x2;
            x2 = temp;

            angle += 180;
          }
          //
          el.animate(
            [
              { transform: `translateX(${x1}px) translateY(${y1}px) rotate(${angle}deg)` },
              { transform: `translateX(${x2}px) translateY(${y2}px) rotate(${angle}deg)` }
            ],
            { duration: 15000, fill: 'forwards', easing: 'linear' }
          );
        });
      });
    });
  }

  ngAfterViewInit() {
    this.observer.observe(this.cometContainer.nativeElement, {
      attributes: true,
      childList: true,
      characterData: true
    });
    setTimeout(() => {
      this.interval = this.mySetInterval(this.updateComets, 5000);
    }, 100);
  }

  ngOnDestroy() {
    this.observer.disconnect();
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
    return (setInterval(callback, timeMs) as any) as number;
  }

  start() {
    //
  }
  stop() {
    //
  }
}
