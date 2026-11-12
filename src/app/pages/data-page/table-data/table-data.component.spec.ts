import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { concat, defer, finalize, NEVER, of } from 'rxjs';
import { IApiFixum } from '../../../../models/IApiFixum';
import { TColStateData } from '../../../../models/TColStateData';
import { ThumbnailImageCacheService } from '../../../core/services/thumbnail-image-cache/thumbnail-image-cache.service';
import { ThumbnailImageRequest } from '../../../core/services/thumbnail-image-cache/thumbnail-image.types';
import { ApiDataAction_SetActiveDatum } from '../../../ngrx/actions/api-data.actions';
import {
  selectApiActiveDatum,
  selectApiData,
  selectApiDataAnalysisSelectionState,
  selectApiDataShownColState,
} from '../../../ngrx/selectors/api-data.selectors';
import { selectPreviewUrls } from '../../../ngrx/selectors/preview-urls.selector';
import { TableDataComponent } from './table-data.component';

describe('data table pagination and thumbnail lifetime', () => {
  const rows: IApiFixum[] = Array.from({ length: 4800 }, (_, index) => ({
    product_id: `product-${index}`,
    preview_url: `https://example.test/preview-${index}.png`,
    cutout_url: null,
    source: 'spacewatch',
    source_name: index % 2 === 0 ? 'Primary' : 'Other',
    date: new Date(Date.UTC(2020, 0, 1 + index)).toISOString(),
    airmass: null,
    archive_url: null,
    exposure: index,
    filter: null,
    maglimit: null,
    mjd_start: index,
    mjd_stop: index + 1,
    seeing: null,
  }));
  let fixture: ComponentFixture<TableDataComponent>;
  let component: TableDataComponent;
  let store: MockStore;
  let activeLoads: Map<string, number>;

  beforeEach(async () => {
    activeLoads = new Map();
    TestBed.configureTestingModule({
      imports: [TableDataComponent],
      providers: [
        provideNoopAnimations(),
        provideMockStore({
          selectors: [
            { selector: selectApiData, value: rows },
            { selector: selectApiActiveDatum, value: rows[0] },
            { selector: selectApiDataShownColState, value: {} as TColStateData },
            { selector: selectApiDataAnalysisSelectionState, value: {} },
            { selector: selectPreviewUrls, value: {} },
          ],
        }),
        {
          provide: ThumbnailImageCacheService,
          useValue: {
            loadImage$: (request: ThumbnailImageRequest) =>
              defer(() => {
                activeLoads.set(request.url, (activeLoads.get(request.url) ?? 0) + 1);
                return concat(
                  of({ status: 'loading', originalUrl: request.url, bucketId: 'test' }),
                  NEVER,
                ).pipe(
                  finalize(() => {
                    const count = activeLoads.get(request.url)! - 1;
                    if (count === 0) activeLoads.delete(request.url);
                    else activeLoads.set(request.url, count);
                  }),
                );
              }),
          },
        },
      ],
    });
    store = TestBed.inject(MockStore);
    const active = store.overrideSelector(selectApiActiveDatum, rows[0]);
    // Model the synchronous reducer update so selection can reveal its page,
    // just as it does with the application store and viewer mounted.
    spyOn(store, 'dispatch').and.callThrough();
    const actions = store.scannedActions$.subscribe((action) => {
      if (action.type === ApiDataAction_SetActiveDatum.type) {
        active.setResult((action as ReturnType<typeof ApiDataAction_SetActiveDatum>).apiDatum);
        store.refreshState();
      }
    });
    fixture = TestBed.createComponent(TableDataComponent);
    component = fixture.componentInstance;
    component.subscriptions.add(actions);
    await render();
  });

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function renderedProducts(): string[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('tr[data-product-id]'),
      (row: Element) => row.getAttribute('data-product-id')!,
    );
  }

  it('creates only the first page of thumbnails on initial load', () => {
    expect(component.pageCount).toBe(48);
    expect(renderedProducts()).toEqual(rows.slice(0, 100).map((row) => row.product_id));
    expect([...activeLoads.keys()]).toEqual(rows.slice(0, 100).map((row) => row.preview_url!));
  });

  it('waits for submission before jumping, then updates rows and selection', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.page-jump input');
    input.value = '48';
    input.dispatchEvent(new Event('input'));
    expect(component.pageIndex).toBe(0);
    fixture.nativeElement.querySelector('.page-jump').requestSubmit();
    await render();
    expect(component.pageIndex).toBe(47);
    expect(component.apiActiveDatum?.product_id).toBe(rows[4700].product_id);
    expect(renderedProducts()).toEqual(rows.slice(4700).map((row) => row.product_id));
    expect([...activeLoads.keys()]).toEqual(rows.slice(4700).map((row) => row.preview_url!));
  });

  it('uses the same selection behavior for First and Last buttons', async () => {
    fixture.nativeElement.querySelector('.mat-mdc-paginator-navigation-last').click();
    await render();
    expect(component.pageIndex).toBe(47);
    fixture.nativeElement.querySelector('.mat-mdc-paginator-navigation-first').click();
    await render();
    expect(component.pageIndex).toBe(0);
    expect(component.apiActiveDatum?.product_id).toBe(rows[99].product_id);
    expect(renderedProducts()[0]).toBe(rows[0].product_id);
  });

  it('rejects invalid page numbers and ignores the current page', () => {
    const dispatch = store.dispatch as jasmine.Spy;
    dispatch.calls.reset();
    for (const value of ['', '0', '-1', '49', '1.5', 'NaN', 'Infinity', '1']) {
      component.goToPage(value);
    }
    expect(component.pageIndex).toBe(0);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('releases skipped pages during rapid navigation', async () => {
    for (const page of ['2', '10', '30', '48', '3']) {
      component.goToPage(page);
      await render();
      expect(activeLoads.size).toBe(100);
    }
    expect([...activeLoads.keys()]).toEqual(rows.slice(200, 300).map((row) => row.preview_url!));
  });

  it('keeps keyboard selection when crossing a page boundary', async () => {
    store.dispatch(ApiDataAction_SetActiveDatum({ apiDatum: rows[99] }));
    await render();
    component.keyPress(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await render();
    expect(component.pageIndex).toBe(1);
    expect(component.apiActiveDatum?.product_id).toBe(rows[100].product_id);
    expect(renderedProducts()[0]).toBe(rows[100].product_id);
    component.keyPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await render();
    expect(component.pageIndex).toBe(0);
    expect(component.apiActiveDatum?.product_id).toBe(rows[99].product_id);
    expect(activeLoads.size).toBe(100);
  });

  it('does not repeat sorting during row rendering', async () => {
    component.sort!.active = 'date';
    component.sort!.direction = 'desc';
    component.sort!.sortChange.emit({ active: 'date', direction: 'desc' });
    await render();
    const sort = spyOn(component.dataSource, 'sortData').and.callThrough();
    component.getSortedApiData();
    component.getSortedApiData();
    await render();
    await render();
    expect(sort).not.toHaveBeenCalled();
    expect(renderedProducts()[0]).toBe(rows[99].product_id);
  });

  it('keeps page numbers valid after filters, empty results and replacement data', async () => {
    component.goToPage('48');
    await render();
    component.updateSelectedSourceNames(['Other']);
    await render();
    expect(component.pageCount).toBe(24);
    expect(component.pageIndex).toBe(0);
    expect(activeLoads.size).toBe(100);
    component.updateNumberRangeFilter('exposure', { min: 99999, max: null });
    await render();
    expect(component.currentPageNumber).toBe(0);
    expect(renderedProducts()).toEqual([]);
    expect(activeLoads.size).toBe(0);
    expect(fixture.nativeElement.querySelector('.page-jump input').disabled).toBeTrue();
    component.clearTableFilters();
    await render();
    component.goToPage('48');
    await render();
    store.overrideSelector(selectApiData, rows.slice(0, 37));
    store.refreshState();
    await render();
    expect(component.pageIndex).toBe(0);
    expect(component.pageCount).toBe(1);
    expect(activeLoads.size).toBe(37);
  });

  it('handles page-size changes and a partial final page', async () => {
    component.paginator!.pageSize = 200;
    component.paginator!.page.emit({
      pageIndex: 0,
      previousPageIndex: 0,
      pageSize: 200,
      length: 4800,
    });
    await render();
    expect(component.pageCount).toBe(24);
    expect(activeLoads.size).toBe(200);
    store.overrideSelector(selectApiData, rows.slice(0, 4501));
    store.refreshState();
    await render();
    component.goToPage('23');
    await render();
    expect(renderedProducts().length).toBe(101);
    component.goToPage('1');
    await render();
    component.goToPage('23');
    await render();
    expect(component.apiActiveDatum).toBeDefined();
  });

  it('releases table subscriptions on destruction without touching another consumer', () => {
    const images = TestBed.inject(ThumbnailImageCacheService);
    const download = images.loadImage$({ url: rows[0].preview_url! }).subscribe();
    fixture.destroy();
    expect([...activeLoads.keys()]).toEqual([rows[0].preview_url!]);
    download.unsubscribe();
    expect(activeLoads.size).toBe(0);
  });
});
