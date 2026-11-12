import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TMenuBarEntries } from './models/TMenuBarEntries';
import { degToHms } from './utils/degToHms';
import { menuBarEntries } from './utils/menuBarEntries';
import { IPreviewWcs, previewFitsHeader } from './utils/previewFitsHeader';
import { reprojectDisplay } from './utils/reprojectDisplay';
import { previewPixelToWorld } from './utils/previewPixelToWorld';
import { previewViewTransform } from './utils/previewViewTransform';
import { observeJs9View } from './utils/observeJs9View';

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

let js9ViewerIdCounter = 0;
let isJs9Initialized = false;
let isJs9ErrorPatched = false;
let originalJs9Error: ((...args: any[]) => void) | undefined;
let activeFitsErrorHandler: ((err: string) => void) | undefined;

const getJs9 = (): any | null => {
  if (typeof JS9 === 'undefined') {
    return null;
  }

  return JS9;
};

const createDefaultViewerId = (): string => {
  js9ViewerIdCounter += 1;
  return `JS9Viewer${js9ViewerIdCounter}`;
};

const ensureJs9ErrorPatched = (): void => {
  const js9 = getJs9();
  if (!js9 || isJs9ErrorPatched) {
    syncJs9FitsErrorHandler(js9);
    return;
  }

  originalJs9Error = typeof js9.error === 'function' ? js9.error.bind(js9) : undefined;
  js9.error = (...args: any[]) => {
    const err = args.toString();

    if (err.includes('datatype conversion overflow')) {
      return;
    }

    activeFitsErrorHandler?.(err);
    originalJs9Error?.(...args);
  };
  isJs9ErrorPatched = true;
  syncJs9FitsErrorHandler(js9);
};

const syncJs9FitsErrorHandler = (js9: any): void => {
  if (js9?.fits?.options) {
    js9.fits.options.error = js9.error;
  }
};

interface IGlobalOpts {
  menuBar: TMenuBarEntries[];
  alerts?: boolean;
  mouseActions?: string[];
  touchActions?: string[];
  resizeHandle?: boolean;
}

const defaultMouseActions = ['display value/position', 'pan the image', 'change contrast/bias'];

const defaultTouchActions = ['pan the image', 'display value/position', 'change contrast/bias'];

const fallbackMenubarHeightPixels = 32;
const fallbackColorbarHeightPixels = 40;
const minimumImageHeightPixels = 10;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const finiteNumberOrDefault = (value: unknown, defaultValue: number): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : defaultValue;
};

interface IColorbarDragState {
  pointerId: number;
  image: any;
  startClientX: number;
  startClientY: number;
  startBias: number;
  startContrast: number;
  displayWidth: number;
  displayHeight: number;
}

export interface IJs9ImageClickCoordinates {
  displayX: number;
  displayY: number;
  imageX: number;
  imageY: number;
  imageFrameX?: number;
  imageFrameY?: number;
  physicalX?: number;
  physicalY?: number;
  ra?: number;
  dec?: number;
  wcsSystem?: string;
  wcsString?: string;
}

export interface IJs9ImageCoordinates {
  imageX: number;
  imageY: number;
  wcsPixelX?: number;
  wcsPixelY?: number;
  wcsPixelAsPhysicalX?: number;
  wcsPixelAsPhysicalY?: number;
  wcsPixelAsImageX?: number;
  wcsPixelAsImageY?: number;
  wcsString?: string;
}

export interface IJs9WorldCoordinates {
  ra: number;
  dec: number;
  wcsSystem?: string;
  wcsString?: string;
}

@Component({
  selector: 'lib-ngx-js9',
  templateUrl: './ngx-js9.component.html',
  styleUrls: ['./ngx-js9.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NgxJs9Component implements AfterViewInit, OnDestroy, OnChanges {
  @Output() viewChanged = new EventEmitter<void>();
  @Output() imageViewport = new EventEmitter<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>();
  private viewportSignature = '';
  private stopObservingView?: () => void;
  private chromeObserver?: ResizeObserver;
  private viewChangeTimeout?: ReturnType<typeof setTimeout>;
  // --->>

  @Input()
  uid: string = createDefaultViewerId();

  @Input()
  widthPxls: number = 0;

  @Input()
  heightPxls: number = 0;

  @Input()
  fitsUrl = '';

  @Input() fitsBlob?: Blob;
  @Input() previewWcs?: IPreviewWcs;

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
    mouseActions: [...defaultMouseActions],
    touchActions: [...defaultTouchActions],
  };

  @Output()
  fitsLoadStatus: EventEmitter<'pending' | 'success' | 'error'> = new EventEmitter();

  @Output()
  imageClickCoordinates = new EventEmitter<IJs9ImageClickCoordinates>();

  private isViewReady = false;
  private isDisplayReady = false;
  private isClickListenerBound = false;
  private isColorbarDragListenerBound = false;
  private colorbarDragState?: IColorbarDragState;
  private latestRequestedFitsUrl = '';
  private loadVersion = 0;
  private readonly onFitsErrorBound = this.onFitsError.bind(this);
  private readonly onDisplayMouseUpBound = this.onDisplayMouseUp.bind(this);
  private readonly onColorbarPointerDownBound = this.onColorbarPointerDown.bind(this);
  private readonly onColorbarPointerMoveBound = this.onColorbarPointerMove.bind(this);
  private readonly onColorbarPointerEndBound = this.onColorbarPointerEnd.bind(this);

  constructor(private snackBar: MatSnackBar) {
    this.adjustColorbarColoring = this.adjustColorbarColoring.bind(this);
  }

  get menubarId(): string {
    return `${this.uid}Menubar`;
  }

  get colorbarId(): string {
    return `${this.uid}Colorbar`;
  }

  ngAfterViewInit(): void {
    this.isViewReady = true;
    this.syncDisplayState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }

    this.syncDisplayState();
  }

  ngOnDestroy(): void {
    this.loadVersion++;
    this.latestRequestedFitsUrl = '';
    this.removeDisplayClickListener();
    this.removeColorbarDragListener();
    this.stopObservingView?.();
    this.chromeObserver?.disconnect();
    clearTimeout(this.viewChangeTimeout);

    const js9 = getJs9();
    if (!js9) {
      return;
    }

    if (activeFitsErrorHandler === this.onFitsErrorBound) {
      activeFitsErrorHandler = undefined;
    }

    js9.CloseDisplay(this.uid);
    if (Array.isArray(js9.displays)) {
      js9.displays = js9.displays.filter((display: any) => display?.id !== this.uid);
    }
  }

  onFitsError(err: string) {
    const message = err.includes('no file specified for image load') ? 'Invalid FITS url' : err;
    this.snackBar.open(message, 'Close', { duration: 5000 });
    this.fitsLoadStatus.emit('error');
  }

  private syncDisplayState(): void {
    if (!this.isViewReady || this.widthPxls <= 0 || this.heightPxls <= 0) {
      return;
    }

    const js9 = getJs9();
    if (!js9) {
      return;
    }

    ensureJs9ErrorPatched();
    const globalOpts = this.getGlobalOpts();
    js9.globalOpts = { ...js9.globalOpts, ...globalOpts };
    if (!isJs9Initialized) {
      js9.init();
      isJs9Initialized = true;
    }
    syncJs9FitsErrorHandler(js9);

    js9.globalOpts = { ...js9.globalOpts, ...globalOpts };
    this.ensureDisplayReady(js9);
    this.applyDisplayMouseTouchActions(js9, globalOpts);
    this.resizeDisplay(js9);
    this.adjustColorbarColoring();

    if (!this.fitsUrl) {
      if (this.latestRequestedFitsUrl) this.loadVersion++;
      if (this.latestRequestedFitsUrl) js9.CloseDisplay(this.uid);
      this.latestRequestedFitsUrl = '';
      return;
    }
    if (this.fitsUrl === this.latestRequestedFitsUrl) {
      return;
    }

    this.loadFitsUrl(js9, this.fitsUrl);
  }

  private ensureDisplayReady(js9: any): void {
    if (this.isDisplayReady) {
      return;
    }

    this.stopObservingView = observeJs9View(js9, this.uid, () => this.scheduleViewChange(js9));
    if (typeof ResizeObserver !== 'undefined') {
      this.chromeObserver = new ResizeObserver(() => this.resizeDisplay(js9));
      for (const id of [this.menubarId, this.colorbarId]) {
        const element = document.getElementById(id);
        if (element) this.chromeObserver.observe(element);
      }
    }

    const existingDisplay = js9.lookupDisplay?.(this.uid, false);
    if (existingDisplay) {
      this.isDisplayReady = true;
      this.addDisplayClickListener();
      this.addColorbarDragListener();
      return;
    }

    js9.AddDivs(this.uid);
    this.isDisplayReady = true;
    this.addDisplayClickListener();
    this.addColorbarDragListener();
  }

  private getGlobalOpts(): IGlobalOpts {
    return {
      ...this.globalOpts,
      mouseActions: [...(this.globalOpts.mouseActions ?? defaultMouseActions)],
      touchActions: [...(this.globalOpts.touchActions ?? defaultTouchActions)],
    };
  }

  private applyDisplayMouseTouchActions(js9: any, globalOpts: IGlobalOpts): void {
    const display = js9.lookupDisplay?.(this.uid, false);
    if (!display) {
      return;
    }

    display.mouseActions = [...(globalOpts.mouseActions ?? defaultMouseActions)];
    display.touchActions = [...(globalOpts.touchActions ?? defaultTouchActions)];
  }

  private addDisplayClickListener(): void {
    if (this.isClickListenerBound) {
      return;
    }

    const displayElement = document.getElementById(this.uid);
    if (!displayElement) {
      return;
    }

    displayElement.addEventListener('mouseup', this.onDisplayMouseUpBound);
    this.isClickListenerBound = true;
  }

  private removeDisplayClickListener(): void {
    if (!this.isClickListenerBound) {
      return;
    }

    const displayElement = document.getElementById(this.uid);
    displayElement?.removeEventListener('mouseup', this.onDisplayMouseUpBound);
    this.isClickListenerBound = false;
  }

  private addColorbarDragListener(): void {
    if (this.isColorbarDragListenerBound) {
      return;
    }

    const colorbarElement = document.getElementById(this.colorbarId);
    if (!colorbarElement) {
      return;
    }

    colorbarElement.addEventListener('pointerdown', this.onColorbarPointerDownBound);
    this.isColorbarDragListenerBound = true;
  }

  private removeColorbarDragListener(): void {
    if (this.isColorbarDragListenerBound) {
      const colorbarElement = document.getElementById(this.colorbarId);
      colorbarElement?.removeEventListener('pointerdown', this.onColorbarPointerDownBound);
      this.isColorbarDragListenerBound = false;
    }

    this.removeColorbarDocumentListeners();
    this.colorbarDragState = undefined;
  }

  private addColorbarDocumentListeners(): void {
    document.addEventListener('pointermove', this.onColorbarPointerMoveBound);
    document.addEventListener('pointerup', this.onColorbarPointerEndBound);
    document.addEventListener('pointercancel', this.onColorbarPointerEndBound);
  }

  private removeColorbarDocumentListeners(): void {
    document.removeEventListener('pointermove', this.onColorbarPointerMoveBound);
    document.removeEventListener('pointerup', this.onColorbarPointerEndBound);
    document.removeEventListener('pointercancel', this.onColorbarPointerEndBound);
  }

  private onColorbarPointerDown(evt: PointerEvent): void {
    if (evt.pointerType === 'mouse' && evt.button !== 0) {
      return;
    }

    const image = this.getActiveImage();
    const colorMap = image?.getColormap?.();
    if (!image || !colorMap || image.cmapObj?.type === 'static' || image.useOffScreenCanvas?.()) {
      return;
    }

    const displayCanvas = image.display?.canvas as HTMLCanvasElement | undefined;
    this.removeColorbarDocumentListeners();
    this.colorbarDragState = {
      pointerId: evt.pointerId,
      image,
      startClientX: evt.clientX,
      startClientY: evt.clientY,
      startBias: finiteNumberOrDefault(colorMap.bias, 0),
      startContrast: finiteNumberOrDefault(colorMap.contrast, 1),
      displayWidth: displayCanvas?.width || image.display?.width || this.widthPxls || 1,
      displayHeight: displayCanvas?.height || image.display?.height || this.getImageHeightPixels(),
    };

    this.addColorbarDocumentListeners();
    evt.preventDefault();
    evt.stopPropagation();
  }

  private onColorbarPointerMove(evt: PointerEvent): void {
    const dragState = this.colorbarDragState;
    if (!dragState || evt.pointerId !== dragState.pointerId) {
      return;
    }

    const bias = clamp(
      dragState.startBias + (evt.clientX - dragState.startClientX) / dragState.displayWidth,
      0,
      1,
    );
    const contrast = clamp(
      dragState.startContrast -
        ((evt.clientY - dragState.startClientY) / dragState.displayHeight) * 10,
      0,
      10,
    );

    this.applyColorbarContrastBias(dragState.image, contrast, bias);
    evt.preventDefault();
    evt.stopPropagation();
  }

  private onColorbarPointerEnd(evt: PointerEvent): void {
    const dragState = this.colorbarDragState;
    if (!dragState || evt.pointerId !== dragState.pointerId) {
      return;
    }

    if (dragState.image?.display?.blendMode) {
      dragState.image.displayImage?.('rgb');
    }

    this.colorbarDragState = undefined;
    this.removeColorbarDocumentListeners();
    window.setTimeout(() => this.adjustColorbarColoring(), 0);
    evt.preventDefault();
    evt.stopPropagation();
  }

  private applyColorbarContrastBias(image: any, contrast: number, bias: number): void {
    if (!Number.isFinite(contrast) || !Number.isFinite(bias) || image.cmapObj?.type === 'static') {
      return;
    }

    const js9 = getJs9();
    image.params.bias = bias;
    image.params.contrast = contrast;

    if (typeof image.displayImage === 'function') {
      if (js9?.bugs?.firefox_linux) {
        window.setTimeout(() => image.displayImage('scaled', { blendMode: false }), 0);
      } else {
        image.displayImage('scaled', { blendMode: false });
      }

      image.xeqStashDiscard?.('filterRGBImage');
      if (js9?.globalOpts?.extendedPlugins) {
        image.xeqPlugins?.('image', 'onchangecontrastbias');
      }
      return;
    }

    image.setColormap?.(contrast, bias);
  }

  private getActiveImage(): any | null {
    const js9 = getJs9();
    return js9?.GetImage?.({ display: this.uid }) ?? null;
  }

  private onDisplayMouseUp(evt: MouseEvent): void {
    if (evt.button !== 0) {
      return;
    }

    setTimeout(() => this.emitClickCoordinates(evt), 0);
  }

  private emitClickCoordinates(evt: MouseEvent): void {
    const js9 = getJs9();
    const image = js9?.GetImage?.({ display: this.uid });
    if (!js9 || !image) {
      return;
    }

    const displayPosition = js9.EventToDisplayPos?.(evt);
    const imagePosition = displayPosition
      ? js9.DisplayToImagePos?.(displayPosition, { display: this.uid })
      : null;

    if (!displayPosition || !imagePosition) {
      return;
    }

    const native = image.raws?.[0] ?? image.raw;
    const physicalPosition =
      image.raw === native ? image.imageToLogicalPos?.(imagePosition, 'physical') : undefined;

    const wcsPosition =
      this.previewWcs && image.raw?.id === 'catch-display'
        ? (() => {
            const [ra, dec] = previewPixelToWorld(
              this.previewWcs!,
              imagePosition.x - 1,
              imagePosition.y - 1,
            );
            return { ra, dec, sys: 'ICRS', str: `${ra} ${dec}` };
          })()
        : js9.PixToWCS?.(imagePosition.x, imagePosition.y, { display: image });
    this.imageClickCoordinates.emit({
      displayX: displayPosition.x,
      displayY: displayPosition.y,
      // CAT centroid/photometry routes expect pixels in the loaded image array.
      // Keep detector-frame physical coordinates separate; SkyMapper physical Y
      // can be negative because of CCDSEC/LTV metadata.
      imageX:
        this.getImageCoordinatesFromWorld(wcsPosition?.ra, wcsPosition?.dec)?.imageX ??
        imagePosition.x - 1,
      imageY:
        this.getImageCoordinatesFromWorld(wcsPosition?.ra, wcsPosition?.dec)?.imageY ??
        imagePosition.y - 1,
      imageFrameX: imagePosition.x - 1,
      imageFrameY: imagePosition.y - 1,
      physicalX: physicalPosition?.x,
      physicalY: physicalPosition?.y,
      ra: wcsPosition?.ra,
      dec: wcsPosition?.dec,
      wcsSystem: wcsPosition?.sys,
      wcsString: wcsPosition?.str,
    });
  }

  getImageCoordinatesFromWorld(ra: number, dec: number): IJs9ImageCoordinates | null {
    const js9 = getJs9();
    const image = js9?.GetImage?.({ display: this.uid });
    if (!js9 || !image || !Number.isFinite(ra) || !Number.isFinite(dec)) {
      return null;
    }

    // The reprojected raw layer is only for display. CAT accepts zero-based
    // pixels in the untouched scientific array, retained as raws[0].
    const native = image.raws?.[0] ?? image.raw;
    const values = native?.wcs
      ? js9.wcs2pix(native.wcs, ra, dec).trim().split(/\s+/).map(Number)
      : [];
    const imagePosition = { x: values[0], y: values[1] };
    if (!imagePosition || !Number.isFinite(imagePosition.x) || !Number.isFinite(imagePosition.y)) {
      return null;
    }

    const physicalPosition =
      image.raw === native ? image.imageToLogicalPos?.(imagePosition, 'physical') : undefined;

    return {
      imageX: imagePosition.x - 1,
      imageY: imagePosition.y - 1,
      wcsPixelX: imagePosition.x,
      wcsPixelY: imagePosition.y,
      wcsPixelAsPhysicalX: physicalPosition?.x,
      wcsPixelAsPhysicalY: physicalPosition?.y,
      wcsPixelAsImageX: imagePosition.x - 1,
      wcsPixelAsImageY: imagePosition.y - 1,
      wcsString: values.join(' '),
    };
  }

  getWorldCoordinatesFromImage(imageX: number, imageY: number): IJs9WorldCoordinates | null {
    const js9 = getJs9();
    const image = js9?.GetImage?.({ display: this.uid });
    if (!js9 || !image || !Number.isFinite(imageX) || !Number.isFinite(imageY)) {
      return null;
    }

    const native = image.raws?.[0] ?? image.raw;
    const values = native?.wcs
      ? js9
          .pix2wcs(native.wcs, imageX + 1, imageY + 1)
          .trim()
          .split(/\s+/)
      : [];
    const ra = Number(values[0]),
      dec = Number(values[1]);
    if (!Number.isFinite(ra) || !Number.isFinite(dec)) return null;
    return { ra, dec, wcsSystem: values[2], wcsString: values.join(' ') };
  }

  /** Map the full-panel preview onto JS9's relative magnification, pan, rotation and flip. */
  getPreviewTransform(previewSize?: { width: number; height: number }): string {
    const js9 = getJs9();
    const image = js9?.GetImage?.({ display: this.uid });
    if (!image || !this.previewWcs || image.raw?.id !== 'catch-display') return 'none';
    const [width, height] = this.previewWcs.size;
    return previewViewTransform(
      { width, height },
      image.display,
      previewSize ?? image.display,
      (point) => image.imageToDisplayPos(point),
    );
  }

  /** Use the active raw WCS and actual display transform, including manual flips/rotation. */
  getNorthAngle(): number | null {
    const js9 = getJs9();
    const image = js9?.GetImage?.({ display: this.uid });
    if (!image?.raw?.wcs) return null;
    const pixel = image.displayToImagePos({
      x: image.display.width / 2,
      y: image.display.height / 2,
    });
    const world = js9.pix2wcs(image.raw.wcs, pixel.x, pixel.y).trim().split(/\s+/).map(Number);
    const [ra, dec] = world;
    if (!Number.isFinite(ra) || !Number.isFinite(dec) || Math.abs(dec) >= 89.999999) return null;
    const north = js9
      .wcs2pix(image.raw.wcs, ra, dec + Math.min(0.001, (90 - dec) / 2))
      .trim()
      .split(/\s+/)
      .map(Number);
    const centerDisplay = image.imageToDisplayPos(pixel);
    const northDisplay = image.imageToDisplayPos({ x: north[0], y: north[1] });
    const dx = northDisplay.x - centerDisplay.x,
      dy = northDisplay.y - centerDisplay.y;
    return Number.isFinite(dx) && Number.isFinite(dy) && Math.hypot(dx, dy) > 0
      ? (Math.atan2(dx, -dy) * 180) / Math.PI
      : null;
  }

  private normalizeOrientation(js9: any): void {
    const display = { display: this.uid };
    js9.SetRotate('reset', display);
    js9.SetRot90('reset', display);
    js9.SetFlip('reset', display);
    js9.SetWCSSys('ICRS', display);
    js9.SetWCSUnits('degrees', display);
    const image = js9.GetImage(display);
    if (image?.raw?.wcs > 0) js9.SetRotate('northisup', display);
  }

  adjustColorbarColoring() {
    const js9 = getJs9();
    const image = js9?.GetImage?.({ display: this.uid });
    const colorbar = image?.display?.pluginInstances?.JS9Colorbar;
    if (!colorbar?.textctx) return;
    // Set drawing colours rather than inverting pixels: JS9 redraws ticks on every view change.
    colorbar.textctx.globalCompositeOperation = 'source-over';
    colorbar.textctx.fillStyle = '#fff';
    colorbar.textctx.strokeStyle = '#fff';
    js9.Colorbar.display.call(colorbar, image);
  }

  private loadFitsUrl(js9: any, fitsUrl: string): void {
    const version = ++this.loadVersion;
    this.latestRequestedFitsUrl = fitsUrl;
    activeFitsErrorHandler = this.onFitsErrorBound;
    syncJs9FitsErrorHandler(js9);
    this.fitsLoadStatus.emit('pending');

    js9.CloseDisplay(this.uid);
    js9.Load(
      // A named File is essential: JS9/Montage adds .fits to unnamed Blob
      // output paths, then attempts to open a different virtual filename.
      this.fitsBlob
        ? new File([this.fitsBlob], `catch-${this.uid}.fits`, { type: 'application/fits' })
        : fitsUrl,
      {
        filename: fitsUrl,
        scale: 'linear',
        colormap: 'cool',
        onload: (image: any) => {
          // JS9 displays an image before invoking onload. Remove an obsolete
          // completion so it cannot replace the newer selection or its WCS.
          if (version !== this.loadVersion || fitsUrl !== this.latestRequestedFitsUrl) {
            image.close?.();
            return;
          }
          this.onLoadSuccess(js9, fitsUrl, version);
        },
      },
      { display: this.uid },
    );
  }

  private onLoadSuccess(js9: any, fitsUrl: string, version: number): void {
    if (this.latestRequestedFitsUrl !== fitsUrl || this.loadVersion !== version) {
      return;
    }

    this.normalizeOrientation(js9);
    if (this.previewWcs) {
      const image = js9.GetImage({ display: this.uid });
      const native = image.raws[0];
      const preview = this.previewWcs;
      const isCurrent = () =>
        this.loadVersion === version &&
        this.latestRequestedFitsUrl === fitsUrl &&
        js9.GetImage({ display: this.uid }) === image;
      void reprojectDisplay(
        native,
        preview,
        (ra, dec) => {
          const values = js9.wcs2pix(native.wcs, ra, dec).trim().split(/\s+/).map(Number);
          return [values[0] - 1, values[1] - 1];
        },
        isCurrent,
      )
        .then((data) => {
          if (!isCurrent()) return;
          js9.RefreshImage(
            {
              data,
              naxis1: preview.size[0],
              naxis2: preview.size[1],
              bitpix: -32,
              head: previewFitsHeader(preview),
            },
            { rawid: 'catch-display', resetSection: true },
            { display: this.uid },
          );
          // JS9 frees the previous raw layer's WCS even when adding a new layer.
          // Restore its owned WCS so native pixel mappings and layer switching
          // stay valid; closeImage will free both layers normally.
          const displayed = image.raw;
          try {
            image.raw = native;
            image.initWCS(native.header);
            js9.wcssys(native.wcs, 'ICRS');
            js9.wcsunits(native.wcs, 'degrees');
          } finally {
            image.raw = displayed;
          }
          this.finishLoad(js9);
        })
        .catch((error) => {
          if (isCurrent()) this.onFitsError(error.message ?? 'Could not align FITS display');
        });
      return;
    }
    this.finishLoad(js9);
  }

  private finishLoad(js9: any): void {
    this.normalizeOrientation(js9);
    this.resizeDisplay(js9);
    js9.SetScale('zscale', { display: this.uid });
    js9.SetZoom('toFit', { display: this.uid });
    this.addRegionOverlay(js9);
    this.adjustColorbarColoring();
    this.fitsLoadStatus.emit('success');
  }

  private addRegionOverlay(js9: any): void {
    const ra = this.plotData?.ra;
    const dec = this.plotData?.dec;
    const uncA = this.plotData?.unc_a;
    const uncB = this.plotData?.unc_b;
    const uncTheta = this.plotData?.unc_theta;

    if (
      ra === undefined ||
      dec === undefined ||
      uncA === undefined ||
      uncB === undefined ||
      uncTheta === undefined
    ) {
      return;
    }

    const [raHms, decDms] = degToHms(ra, dec);
    const js9DrawEllipseCmd = `ellipse(${raHms}, ${decDms}, ${uncA}", ${uncB}", ${uncTheta}) {"color": "violet"}`;
    js9.AddRegions(js9DrawEllipseCmd, { changeable: false }, { display: this.uid });
  }

  private resizeDisplay(js9: any): void {
    if (!this.isDisplayReady) {
      return;
    }

    const image = js9.GetImage?.({ display: this.uid });
    const width = this.widthPxls,
      height = this.getImageHeightPixels();
    const previousFit = image
      ? Math.min(image.display.width / image.raw.width, image.display.height / image.raw.height)
      : 0;
    const nextFit = image ? Math.min(width / image.raw.width, height / image.raw.height) : 0;
    const zoom = image ? Number(js9.GetZoom({ display: this.uid })) : 0;
    js9.ResizeDisplay(this.uid, width, height);
    if (previousFit > 0 && nextFit > 0 && previousFit !== nextFit && zoom > 0) {
      // Keep a fitted image fitted, and retain a user's magnification relative to fit.
      js9.SetZoom((zoom * nextFit) / previousFit, { display: this.uid });
    }
    this.scheduleViewChange(js9);
  }

  private scheduleViewChange(js9: any): void {
    if (this.viewChangeTimeout !== undefined) return;
    this.viewChangeTimeout = setTimeout(() => {
      this.viewChangeTimeout = undefined;
      const canvas: HTMLCanvasElement | undefined = js9.GetImage?.({ display: this.uid })?.display
        ?.canvas;
      const display = document.getElementById(this.uid),
        host = display?.closest('.ngx-js9-host');
      if (!display || !host) return;
      const rect = (canvas ?? display).getBoundingClientRect(),
        parent = host.getBoundingClientRect();
      const viewport = {
        top: rect.top - parent.top,
        left: rect.left - parent.left,
        width: rect.width,
        height: rect.height,
      };
      const signature = JSON.stringify(viewport);
      if (signature !== this.viewportSignature) {
        this.viewportSignature = signature;
        this.imageViewport.emit(viewport);
      }
      this.viewChanged.emit();
      this.adjustColorbarColoring();
    });
  }

  getHeight() {
    return `${this.getImageHeightPixels()}px`;
  }

  private getImageHeightPixels(): number {
    if (!this.heightPxls) {
      return minimumImageHeightPixels;
    }

    return Math.max(this.heightPxls - this.getViewerChromeHeightPixels(), minimumImageHeightPixels);
  }

  private getViewerChromeHeightPixels(): number {
    const menuBarHeight =
      this.getRenderedElementHeight(this.menubarId) ?? fallbackMenubarHeightPixels;
    const colorbarHeight =
      this.getRenderedElementHeight(this.colorbarId) ?? fallbackColorbarHeightPixels;
    return menuBarHeight + colorbarHeight;
  }

  private getRenderedElementHeight(elementId: string): number | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const element = document.getElementById(elementId);
    const height = element?.getBoundingClientRect().height;
    return typeof height === 'number' && Number.isFinite(height) && height > 0
      ? Math.ceil(height)
      : null;
  }
}
