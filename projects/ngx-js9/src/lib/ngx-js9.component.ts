import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TMenuBarEntries } from './models/TMenuBarEntries';
import { degToHms } from './utils/degToHms';
import { menuBarEntries } from './utils/menuBarEntries';

/**
 * JS9 scripts will sometimes launch async callbacks that trigger JS9.error
 * Sometimes you can catch those errors by wrapping e.g. `JS9.Load()` with
 * a try-catch block; but sometimes you can only catch those errors by overriding
 * JS9.error. Moreover, for reasons unknown at this time, you have to perform
 * the override of JS9.error in the global space; any action you might want to take
 * within an angular class in reaction to such an error event might require the
 * declaration and re-setting of a handle onto e.g. the snackBar
 */
declare const JS9: any;
let _originalJS9Error: any;

try {
  _originalJS9Error = JS9.error;
} catch (e) {}

let _onFitsError: (err: string) => void = () => {};
if (true) {
  JS9.error = function (...args: any[]) {
    // --->>

    if (false) console.log('JS9.error is overridden');
    if (false) args.forEach((el, ind) => console.log(ind, ':', el));
    const err = args.toString();

    /* Exclude the throwing of certain errors */
    // ERROR from astroem/cfitsio: datatype conversion overflow
    if (err.includes('datatype conversion overflow')) return;

    /* Act on errors */
    _onFitsError(err);

    /* Finally, run default behavior */
    _originalJS9Error(...args);
  };
}

interface IGlobalOpts {
  menuBar: TMenuBarEntries[];
  alerts?: boolean;
}

@Component({
  selector: 'lib-ngx-js9',
  templateUrl: './ngx-js9.component.html',
  styleUrls: ['./ngx-js9.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NgxJs9Component implements OnInit, OnDestroy, OnChanges {
  // --->>

  @ViewChild('js9MenubarRef')
  js9MenubarDiv!: ElementRef<HTMLDivElement>;

  @ViewChild('js9MainRef')
  js9MainDiv!: ElementRef<HTMLDivElement>;

  @ViewChild('js9ColorbarRef')
  js9ColorbarDiv!: ElementRef<HTMLDivElement>;

  @Input()
  uid: string = 'JS9';

  @Input()
  widthPxls: number = 0;

  @Input()
  heightPxls: number = 0;

  @Input()
  fitsUrl = '';

  @Input()
  siteTheme: 'DARK-THEME' | 'LIGHT-THEME' = 'DARK-THEME';

  @Input()
  plotData = {
    fitsUrl: undefined,
    ra: undefined,
    dec: undefined,
    unc_a: undefined,
    unc_b: undefined,
    unc_theta: undefined,
  };

  @Input()
  globalOpts: IGlobalOpts = {
    menuBar: [...menuBarEntries],
    alerts: false,
  };

  @Output()
  fitsLoadStatus: EventEmitter<'pending' | 'success' | 'error'> =
    new EventEmitter();

  isShown = true;
  isLoaded = false;
  isJS9Initiated = false;

  constructor(private snackBar: MatSnackBar) {
    this.resetJS9Display = this.resetJS9Display.bind(this);
    this.adjustColorbarColoring = this.adjustColorbarColoring.bind(this);

    // ...
    _onFitsError = this.onFitsError;
  }

  ngOnInit(): void {
    // Set JS9 Params
    this.fitsLoadStatus.emit('pending');
    JS9.globalOpts = { ...JS9.globalOpts, ...this.globalOpts };
    JS9.init();
    setTimeout(() => {
      this.resetJS9Display();
      this.isJS9Initiated = true;
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      //
      !!changes &&
      !!this.widthPxls &&
      !!this.heightPxls &&
      !!this.isJS9Initiated
    ) {
      JS9.CloseImage(); // See here: https://github.com/ericmandel/js9/issues/60#issuecomment-506104711

      /**
       * When changes are made to input fitsUrl or width or height we crudely
       * unmount-then-mount the entire component using sequential
       * setTimeouts to toggle an ngIf as the easiest way to reset
       * the divs that JS9 needs to act on from the convoluted
       * structure that JS9 may have wrought previously by so-acting.
       */
      this.isShown = false;
      const crudeDelay = 500;
      setTimeout(() => {
        this.isShown = true;
        setTimeout(() => this.resetJS9Display(), crudeDelay);
      }, crudeDelay);
    }
  }

  ngOnDestroy(): void {
    JS9.CloseImage();
  }

  onFitsError(err: string) {
    const message = err.includes('no file specified for image load')
      ? 'Invalid FITS url'
      : err;
    this.snackBar.open(message, 'Close', { duration: 5000 });
    this.fitsLoadStatus.emit('error');
  }

  adjustColorbarColoring() {
    // Logic to invert the color-scale color (for sake of theme color)
    if (this.siteTheme?.includes('DARK')) {
      const canvases: HTMLCanvasElement[] = document.getElementsByClassName(
        'JS9ColorbarTextCanvas'
      ) as any;
      try {
        const canvas = canvases[0];
        const ctx = !!canvas ? canvas.getContext('2d') : null;
        if (!!ctx) {
          ctx.globalCompositeOperation = 'difference';
          ctx.fillStyle = 'rgba(0,0,0,0)';
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
          canvas.style.backgroundColor = 'rgba(0,0,0,0)';
        } else {
          throw new Error('This logic sucks!');
        }
      } catch (err) {
        console.log('CANVAS NOT FOUND');
      }
    }
  }

  async resetJS9Display() {
    return new Promise<void>((resolve) => {
      // Begin JS9 load sequence
      setTimeout(async () => {
        // Reset JS9 divs and then add our ID
        JS9.displays = [];
        JS9.AddDivs('JS9');

        // You need to adjust color-scale coloring BEFORE loading FITS image
        this.adjustColorbarColoring();

        try {
          // Load external fits file to our div
          JS9.Load(this.fitsUrl, {
            display: 'JS9',
            scale: 'linear',
            colormap: 'cool',
            onload: () => {
              setTimeout(() => {
                JS9.SetScale('zscale', { display: 'JS9' });
                JS9.SetZoom('toFit', { display: 'JS9' });

                // Draw Ellipse
                if (true) {
                  const ra = this.plotData?.ra;
                  const dec = this.plotData?.dec;
                  const UNC_A = this.plotData?.unc_a;
                  const UNC_B = this.plotData?.unc_b;
                  const UNC_THETA = this.plotData?.unc_theta;

                  const [ra4, dec4] = degToHms(ra, dec);
                  const js9DrawEllipseCmd =
                    `ellipse(${ra4}, ${dec4}, ${UNC_A}", ${UNC_B}", ${UNC_THETA})` +
                    ` {"color": "violet"}`;
                  JS9.AddRegions(js9DrawEllipseCmd, {
                    changeable: false,
                  });
                }

                /*
                // Modify styles of div containing js9-menu buttons
                setTimeout(() => {
                  const menuContainerDivs = document.getElementsByClassName(
                    'JS9MenubarContainer-flat'
                  );
                  for (let i = 0; i < menuContainerDivs.length; i++) {
                    const menuContainerDiv: HTMLDivElement =
                      menuContainerDivs.item(i) as any;
                    menuContainerDiv.style.whiteSpace = 'nowrap';
                    menuContainerDiv.style.overflowX = 'scroll';
                    menuContainerDiv.style.backgroundColor = 'transparent';
                  }
                }, 0);
                */

                this.fitsLoadStatus.emit('success');
                this.isLoaded = true;
                resolve();
              }, 100);
            },
          });
        } catch (e) {
          console.log('Caught JS9.Load >>>', e);
        }
      }, 100);
    });
  }

  getHeight() {
    const menuBarHeight = 36;
    const colorBarHeight = 42;
    const menuBarPlusColorBarHeight = menuBarHeight + colorBarHeight;
    const result = this.heightPxls
      ? this.heightPxls - menuBarPlusColorBarHeight - 12 + 'px'
      : '100px';
    return result;
  }
}
