# CATCH Code Review Report - May 14, 2026

This is a read-only architecture and code-quality review of the current CATCH frontend after the recent data-table, filtering, Angular Material theme, CAT, and astrometry-centralization work.

I did not read or edit `.env`. I created this report as the only new file.

## Executive Summary

The app is in a workable, coherent state after a lot of rapid iteration. The recent direction is good: Angular Material theming is centralized, CAT astrometry state is product-keyed in NgRx, the table filters have been pulled into a separate filter area, and the overlay centralization now has a reasonable product guard.

The main risk is not that the app is conceptually wrong. The main risk is that several important UX flows are currently concentrated in very large components, especially the data table and image overlay. Those files now carry too much responsibility: display, state coordination, dialog orchestration, domain mapping, image queue resets, scrolling, geometry, and cross-feature side effects are living together. That makes the next round of features slower and riskier unless we carve out a few clean seams.

There are also several concrete bugs or likely bugs worth fixing before major new work:

- Fixed-target search appears to ignore the Radius control.
- Filters can produce zero rows, which violates the agreed "always have an active row" invariant.
- API effects dispatch `apiData[0]` even when no rows are returned.
- Numeric `0` renders as `N/A` in table cells.
- Image fetch queue reset can corrupt in-flight accounting.
- HTTP interceptors are duplicated and apparently not wired.
- URL query construction is ad hoc and does not encode values.
- Image orientation logic is duplicated and inconsistent across overlay/thumbnail/util code.

The codebase is not in bad shape, but it is at the point where another week of adding UI features without decomposition will make the data view uncomfortable to reason about.

## Verification Performed

Commands run:

```bash
npx tsc --noEmit
git diff --check
```

Both completed with no output/errors.

I did not run a full Angular build. The SSR/local server code imports dotenv configuration in places such as `src/server/local.api.ts` and `src/server/routes/horizons.ts`, and the project instructions explicitly say not to read `.env`. A future CI/build verification should be done in the normal dev environment with that constraint understood.

## Severity Guide

- `P1`: likely user-visible bug, invariant break, or high-risk state issue.
- `P2`: real defect, architecture risk, or near-term maintenance trap.
- `P3`: cleanup, clarity, consistency, or future-proofing.

## P1 Findings

### P1. Fixed-target search appears to ignore Radius

In `src/app/components/search-field/search-field.component.ts`, fixed-target query launch reads the radius from `padding_input_control`:

```ts
const radius = controls.padding_input_control.value;
```

But the fixed-target template binds the visible Radius field to `radius_input_control` in `src/app/components/search-field/search-field.component.html`.

Impact: fixed-target searches likely send the moving-target padding value as the fixed-target radius. If padding is zero/default, a user can enter a fixed radius and still get a different API query than expected.

Recommendation: change fixed-target launch to read `radius_input_control`, then add a tiny unit test or at least a query-builder test proving fixed target `radius` is honored.

Relevant files:

- `src/app/components/search-field/search-field.component.ts`
- `src/app/components/search-field/search-field.component.html`

### P1. Zero-result filters violate the selected-row invariant

The UX requirement is now: the app should always have a selected row. If a selected row is filtered out, select the first remaining row.

`src/app/pages/data-page/table-data/table-data.component.ts` has this logic:

```ts
const sortedApiData = this.getSortedApiData();
if (!sortedApiData?.length) return;
```

If the user applies a numeric/date filter that leaves zero rows, the function returns without changing the active datum. The active row can then point at a row that is not visible.

The source filter dialog avoids empty selection by disabling Apply when nothing is selected. Numeric range filters show a projected count and expose `isPreviewEmpty`, but `isApplyDisabled` only checks validation errors. Date filters do not have projected counts yet.

Product decision needed:

- Option A: zero-result filters are invalid. Disable Apply whenever projected count is zero. This preserves "always selected row".
- Option B: zero-result filters are valid. Then the invariant must change to "always selected row when rows exist", and CAT/overlay/title/table need empty-state handling.

Given the user's stated preference, Option A is probably right.

Relevant files:

- `src/app/pages/data-page/table-data/table-data.component.ts`
- `src/app/pages/data-page/table-data/table-filters/table-range-filter-dialog/table-range-filter-dialog.component.ts`
- `src/app/pages/data-page/table-data/table-filters/table-date-filter-dialog/table-date-filter-dialog.component.ts`

### P1. API effects can dispatch an undefined active datum

In `src/app/ngrx/effects/api-data.effects.ts`, both fetch branches dispatch:

```ts
ApiDataAction_SetActiveDatum({ apiDatum: apiData[0] })
```

This happens even when `apiData.length === 0`. The same effect then sets status to `notfound`, but by then `SetActiveDatum` has already received `undefined` despite the action contract expecting an API datum.

Impact: no-result API searches can leave NgRx state internally inconsistent or crash code that assumes `apiActiveDatum` is a real row.

Recommendation:

- Do not dispatch `SetActiveDatum` when `apiData.length === 0`, or introduce an explicit `ClearActiveDatum` action.
- Make the active datum type honestly nullable if no-data is possible.
- Audit consumers for the "always selected row when data exists" invariant.

Relevant file:

- `src/app/ngrx/effects/api-data.effects.ts`

### P1. Image fetch queue reset can corrupt active request accounting

`src/app/core/services/fetch-image/fetch-image.service.ts` has:

```ts
resetQueue() {
  this.queue = [];
  this.activeRequests = 0;
}
```

But already-started fetches can still complete. When they do, `processTask()` decrements `activeRequests`. If `resetQueue()` was called while requests were in flight, `activeRequests` can go negative.

Impact: rapid sorting/filtering/pagination can make image loading behavior unreliable. This could present as missing thumbnails, odd queue delays, or excessive retries.

Recommendation:

- Do not reset `activeRequests` for in-flight work.
- Add a queue generation token so old completions do not schedule new work for obsolete generations.
- Consider using `AbortController` for fetches that should actually be cancelled.

Relevant file:

- `src/app/core/services/fetch-image/fetch-image.service.ts`

## P2 Findings

### P2. Numeric zero renders as `N/A`

`formatCellEntry()` in `src/app/pages/data-page/table-data/table-data.component.ts` starts with:

```ts
if (!colEntry) return 'N/A';
```

That treats `0` as missing. For scientific data, zero is often meaningful.

Recommendation:

```ts
if (colEntry === null || colEntry === undefined || colEntry === '') return 'N/A';
```

Relevant file:

- `src/app/pages/data-page/table-data/table-data.component.ts`

### P2. HTTP interceptors are duplicated and apparently not wired

The app has both:

- `src/app/core/interceptors/http-pipeline.interceptor.ts`
- `src/app/core/interceptors/pipelineInterceptor.ts`

They contain similar timeout/snackbar/error logic. But `src/app/app-root/app.config.ts` only provides:

```ts
provideHttpClient(withFetch())
```

There is no `withInterceptors([pipelineInterceptor])` and no `HTTP_INTERCEPTORS` provider visible.

Impact: the code looks like global HTTP timeout/error UX exists, but it likely does not run. This matters for API/CAT reliability and user feedback.

Recommendation:

- Keep only the functional interceptor for Angular 20.
- Register it explicitly:

```ts
provideHttpClient(withFetch(), withInterceptors([pipelineInterceptor]))
```

- Or delete both if global interception is no longer desired.

Relevant files:

- `src/app/app-root/app.config.ts`
- `src/app/core/interceptors/pipelineInterceptor.ts`
- `src/app/core/interceptors/http-pipeline.interceptor.ts`

### P2. URL query construction is ad hoc and not encoded

Examples:

- `src/utils/getUrlForFixedRoute.ts`
- `src/utils/getUrlForCatchRoute.ts`
- `src/app/core/services/object-name-match/object-name-match.service.ts`

These build URLs by interpolating raw values:

```ts
const targetStr = `target=${target}`;
const url = ROOT_URL + 'name?name=' + userSubmittedText;
```

Impact: spaces, plus signs, slashes, unusual target names, dates, or source values can produce malformed requests.

Recommendation:

- Use `HttpParams`, `URL`, or `URLSearchParams`.
- Keep one query-builder per API route and test it.
- Avoid treating falsy numeric values as absent. For example, `radius ? ... : ''` drops valid `0`.

Relevant files:

- `src/utils/getUrlForFixedRoute.ts`
- `src/utils/getUrlForCatchRoute.ts`
- `src/app/core/services/object-name-match/object-name-match.service.ts`

### P2. Source image orientation is duplicated and inconsistent

Orientation/transform logic exists in at least three places:

- `src/utils/image-orientation.ts`
- `src/app/pages/data-page/panstarrs-overlay/panstarrs-overlay.component.ts`
- `src/app/pages/data-page/table-thumbnail/table-thumbnail.component.ts`

They disagree. For example:

- `image-orientation.ts` says `skymapper_dr4: null`.
- `panstarrs-overlay.component.ts` returns `scale(-1, 1)` for `skymapper`.
- `table-thumbnail.component.ts` returns `rotate(180deg)` for `skymapper_dr4` when `isReorientated` is true.

Also, table thumbnails define `@Input() isReorientated = false`, but the current table template does not appear to pass it, so some of that logic may be dormant.

Impact: this is directly adjacent to the astrometry centralization and marker movement feature. If orientation rules are spread out, future "it moves the wrong way for source X" bugs are likely.

Recommendation:

- Create one `image-orientation` utility with a typed source enum/key.
- Expose explicit outputs such as:
  - `cssTransform`
  - `raPixelDirection`
  - `decPixelDirection`
  - maybe `needsWcsProjection`
- Use it from overlay, thumbnails, and any FITS/JPG alignment code.
- Add tests for NEAT, ATLAS, SkyMapper, PanSTARRS, Catalina, Spacewatch, LONEOS.

Relevant files:

- `src/utils/image-orientation.ts`
- `src/app/pages/data-page/panstarrs-overlay/panstarrs-overlay.component.ts`
- `src/app/pages/data-page/table-thumbnail/table-thumbnail.component.ts`

### P2. Image fetch retry state is global instead of per request

`ImageFetchService` has one `retryCount` for the whole service.

Impact: one bad URL can consume retries for later unrelated URLs. This is especially risky in a paginated table where many thumbnails are requested.

Recommendation:

- Move retry count into `IFetchTask` or pass it through recursive `fetchImage(url, options, attempt)`.
- Consider bounding retries much lower than 200 per image unless there is a known server-throttling reason.

Relevant file:

- `src/app/core/services/fetch-image/fetch-image.service.ts`

### P2. Image URL mutation appends `&align=true` unsafely

`ImageFetchService` uses:

```ts
fetch(`${url}&align=true`)
```

and:

```ts
fetch(task.url + '&align=true')
```

Impact: if a URL has no query string, the result is malformed. If it already has `align`, it may duplicate the parameter.

Recommendation:

- Use the `URL` API where possible.
- If URLs can be nonstandard or relative, use a small helper:

```ts
appendQueryParam(url, 'align', 'true')
```

Relevant file:

- `src/app/core/services/fetch-image/fetch-image.service.ts`

### P2. CAT pixel-scale mapping is embedded in the CAT component

`getAstrometryPixelScale()` and Catalina type parsing live inside `src/app/pages/data-page/cat-tools/cat-tools.component.ts`.

The logic itself is valuable domain logic:

- ATLAS -> 1.86
- SkyMapper -> 0.5
- Spacewatch -> 1.0
- PanSTARRS -> 0.25
- NEAT Palomar Tri-Cam -> 1.01
- NEAT GEODSS -> 1.43
- LONEOS -> 2.53
- Catalina type mapping -> `703`, `V06`, `G96`, `I51`, `I52`

Impact: this is hard to test and easy to accidentally break during UI refactors.

Recommendation:

- Extract to `src/app/pages/data-page/cat-tools/astrometry-pixel-scale.ts` or a domain utility under `src/utils`.
- Add table-driven tests.
- Keep the component responsible for launching the dialog, not knowing survey calibration rules.

Relevant file:

- `src/app/pages/data-page/cat-tools/cat-tools.component.ts`

### P2. CAT detail state can become stale if an item is deselected

CAT tools correctly activate a row when opening an astrometry launcher/review. However, `activeDetailView` is local component state while the selected analysis items are derived from NgRx table selection.

If the user opens a detail view and then deselects that product from the table, `getDetailItem()` can no longer find it. The detail panel can go blank while `activeDetailView` still points at the removed product.

Product decision needed:

- Close the detail view when its item is no longer selected.
- Or keep detail items visible even after table deselection.

Given the current "CAT panel contains selected rows" model, closing the detail view is probably simpler.

Relevant file:

- `src/app/pages/data-page/cat-tools/cat-tools.component.ts`

### P2. Data route query parsing leaves values weakly normalized

`src/app/pages/data-page/data-page.component.ts` reads query params and assigns values such as `padding`, `radius`, `ra`, and `dec` directly from `queryParams`. The fields are typed more narrowly than the runtime values.

Impact: string values can flow deeper into code that expects numbers. Invalid `intersection_type` shows an error but still continues through the route flow.

Recommendation:

- Add a pure `parseDataRouteQueryParams(queryParams): TApiDataSearch | ParseError`.
- Normalize numbers, booleans, dates, sources, and intersection type in one place.
- Unit test moving and fixed route parsing.

Relevant file:

- `src/app/pages/data-page/data-page.component.ts`

### P2. Angular build default configuration is stale

`angular.json` sets:

```json
"defaultConfiguration": "production"
```

for `build`, but the actual build configurations are:

- `prod-deployment`
- `stage-deployment`
- `local`

The npm scripts use explicit configurations, so this may not bite day-to-day. But plain `ng build` or tool-driven builds may try a nonexistent `production` configuration.

Recommendation: change build `defaultConfiguration` to `prod-deployment` or `local`, whichever matches the desired default.

Relevant file:

- `angular.json`

## P3 Findings

### P3. Data table component is carrying too many responsibilities

`src/app/pages/data-page/table-data/table-data.component.ts` is about 780 lines. It currently handles:

- Store subscriptions
- Active datum synchronization
- MatTableDataSource setup
- Sort/paginator behavior
- Auto-scroll/page jump
- Filter dialog orchestration
- Filter summaries
- Column visibility
- Analysis checkbox selection
- Image fetch queue reset
- Cell formatting
- Plotly dialog launch

This is the biggest maintainability hotspot in the app.

Recommendation: split by behavior, not by arbitrary line count.

Suggested decomposition:

- `table-filter.facade.ts`: owns `ITableFilterState`, opens dialogs, produces summary count/labels.
- `table-view-model.ts`: pure functions for filter/sort/page projection.
- `table-selection-coordinator.ts`: active datum, first visible row fallback, analysis checkbox state.
- `table-auto-scroll.controller.ts`: DOM scroll math and page-jump behavior.
- Presentational table component: inputs for rows/columns/filter state; outputs for row click/sort/filter/settings.

This would keep the current UX but reduce the chance that future filters or mobile behavior create table spaghetti.

### P3. PanSTARRS overlay component is also doing too much

`src/app/pages/data-page/panstarrs-overlay/panstarrs-overlay.component.ts` is about 750 lines. It combines:

- Active datum subscriptions
- PanSTARRS metadata fetching
- Image loading
- Rendered image geometry
- WCS pixel-coordinate fetching
- Astrometry centralization shift
- Marker placement
- Source-specific orientation
- Status chip logic
- Resize handling

Recommendation:

- Extract image/render geometry into a pure class or service.
- Extract marker projection into a service.
- Extract source orientation into the single shared utility mentioned above.
- Leave the component as orchestration plus template state.

### P3. API data effect has duplicated success handling

`src/app/ngrx/effects/api-data.effects.ts` has one branch for cached moving results and another for normal fetches. The action sequence and cache-persist logic are nearly duplicated.

Recommendation:

- Extract `buildApiDataSuccessActions(search, apiData, jobId, message, smallBodyType?)`.
- Extract `persistMovingCacheIfRequested(search, apiData, jobId)`.
- Use `concatLatestFrom` or `withLatestFrom` to read `smallBodyType` instead of subscribing inside the effect.

This will reduce risk around future API status/state changes.

### P3. Theme setup is now much clearer, but color ownership should be documented

The new Angular Material setup in `src/styles/styles.scss` is broadly sane:

- `mat.theme(...)` is centralized.
- DOM classes distinguish system/light/dark and effective light/dark.
- Overlay container receives theme classes via `ThemeService`.
- Brand surface tokens exist: `--catch-brand-surface`, `--catch-on-brand-surface`, etc.

The remaining design question is that there are two color concepts:

- Angular Material primary = cyan palette.
- CATCH brand surface = custom deep teal.

This explains some of the recent cyan/teal drift. It is not inherently wrong, but it should be intentional.

Recommendation:

- Write a short comment near the theme tokens explaining:
  - Material primary is for interactive/action emphasis.
  - CATCH brand surface is for nav, selected rows, CAT selected item, and other branded surfaces.
- Or, if teal should be the true Material primary, move to a custom Material palette/tokens later.

Relevant files:

- `src/styles/styles.scss`
- `src/app/core/services/theme/theme.service.ts`

### P3. Theme preference validation only checks type

`LocalStorageService.verifyAndRepairLocalStorageState()` checks whether localStorage values have the right basic type. For `themePreference`, any string passes.

Impact: stale/corrupt localStorage could produce `catch-theme-banana` and invalid `color-scheme`.

Recommendation: validate enum-like values, especially `themePreference in ['system', 'light', 'dark']`.

Relevant files:

- `src/app/core/services/local-storage/local-storage.service.ts`
- `src/app/core/services/theme/theme.service.ts`

### P3. Home/background subscriptions lack cleanup

`HomePageComponent` and `BackgroundComponent` subscribe in constructors and do not unsubscribe. Background is root-ish and low risk. Home can be recreated on route churn.

Recommendation:

- Use `takeUntilDestroyed()` or `AsyncPipe`.
- Prefer constructor-free subscription setup unless there is a clear reason.

Relevant files:

- `src/app/pages/home-page/home-page.component.ts`
- `src/app/components/background/background.component.ts`

### P3. Routing animation service is coupled to API state

`DelayedRouterService` dispatches API status reset when navigating away from `/data`.

Impact: a navigation animation service now owns part of the data lifecycle. That makes route transitions and API cancellation harder to reason about independently.

Recommendation:

- Keep `DelayedRouterService` focused on delayed navigation.
- Move data reset/cancel behavior into an NgRx effect keyed off router navigation, or into a data-page lifecycle action.

Also, same-page detection uses:

```ts
if (this.presentRoute && this.presentRoute.includes(link)) return;
```

That is brittle. Compare normalized route paths instead.

Relevant file:

- `src/app/core/services/delayed-router/delayed-router.service.ts`

### P3. FITS viewer theme is hardcoded dark

`src/app/pages/data-page/fits-jpg-toggler/fits-jpg-toggler.component.html` passes:

```html
[siteTheme]="'DARK-THEME'"
```

Now that light/dark app theme is restored, this may be visually inconsistent in light mode.

Recommendation: if JS9 supports a light theme, drive this from `ThemeService.effectiveTheme$`. If not, document that FITS remains dark because the scientific viewer is intentionally dark-only.

### P3. Console logging and debug leftovers are scattered

Examples:

- `src/utils/constants.ts` logs the API base URL at import time.
- `src/utils/animation-constants.ts` logs during server/non-browser execution.
- `src/app/ngrx/effects/screen-device.effects.ts` logs resize/window fallback.
- `src/app/core/services/fetch-image/fetch-image.service.ts` logs retries even with `isDebug = false`.
- `src/app/core/interceptors/*` logs errors and "Being used?!".
- Several components have `!true`, `!false`, `if (!true)`, and commented debug blocks.

Recommendation:

- Introduce a tiny debug logger or environment-gated logging helper.
- Remove magic boolean toggles from production code.
- Keep scientific/debug utilities, but put them behind obvious flags.

### P3. Current test coverage does not protect the fast-moving parts

Existing specs are sparse and do not cover the data table, filter system, URL builders, image orientation, pixel-scale mapping, or astrometry centralization.

Recommended tests:

- `table-filter.utils.spec.ts`: source/range/date filters, projected counts, N/A handling.
- `astrometry-pixel-scale.spec.ts`: source-to-pixel-scale mapping, Catalina type extraction.
- `url-builders.spec.ts`: moving/fixed route URL encoding, radius/padding, date values.
- `image-orientation.spec.ts`: every known source maps to the expected transform/direction metadata.
- `api-data.effects.spec.ts`: empty API result does not dispatch invalid active datum.
- A small table component/harness test: selected row survives sort/page/filter transitions.

## Key UX Flow Review

### Home/Search Flow

Current flow:

1. Search field handles target typing, source toggles, moving/fixed mode, advanced controls.
2. Object-name match calls the name-resolution service.
3. Query launch dispatches `ApiDataAction_SetStatus` with a `search` payload.
4. Effects perform API fetch/cache behavior.
5. Router moves to `/data` through delayed navigation/page animation.

Good:

- The home page remains mostly a composition shell.
- Search field owns its own form state.
- Moving/fixed modes are visually and structurally separated.

Risks:

- `SearchFieldComponent` is large and mixes UI controls, query launch, validation, autocomplete, dialog handling, source selection, and route initiation.
- Query builders do not encode values.
- Fixed-target radius bug is likely real.

Suggested direction:

- Keep the component, but extract:
  - `buildMovingSearchPayload(formValue)`
  - `buildFixedSearchPayload(formValue)`
  - URL/query builder tests
  - source selection helper

### Data Exploration Flow

Current flow:

1. `/data` parses query params.
2. API effects load/cached data into NgRx.
3. Data table applies local filters and Material sorting/pagination.
4. Active datum drives the overlay/toggler and CAT tools.
5. Analysis selection drives CAT item list and downloads.

Good:

- The active row as a shared NgRx concept is right. It coordinates table, image, and CAT.
- Filters are now distinct from core table display.
- Column controls are becoming consistent.
- The compact/expanded CAT tools layout has a clearer constants file.

Risks:

- The table component is too responsible for cross-feature coordination.
- Empty filter result semantics are unresolved.
- Auto-scroll/page-jump logic is subtle and should be isolated before more table work.
- Mobile layout is not yet a real UX; it is mostly a separate placeholder path.

Suggested direction:

- First fix invariants and bugs.
- Then extract table view-model/filter/selection/scroll logic.
- Then resume UX iteration.

### Image Inspection Flow

Current flow:

1. Active datum determines preview/FITS URLs.
2. JPG overlay shows fetched image and markers.
3. FITS toggler can swap to JS9.
4. Astrometry centralization can shift overlay markers for the active product.

Good:

- The overlay centralization is keyed by product id in NgRx, which is the right shared-state boundary.
- The latest WCS shift approach is cleaner than source-specific ad hoc pixel guessing.
- The FITS/JPG toggle state is local, which is appropriate.

Risks:

- Overlay geometry/orientation/WCS/image loading live in one component.
- Source orientation rules are inconsistent.
- Fetch queue has lifecycle/accounting issues.
- FITS theme is hardcoded dark.

Suggested direction:

- Consolidate source orientation before adding more overlay transforms.
- Extract projection/geometry logic to pure units that can be tested without DOM.
- Only then add richer astrometry visualizations.

### CAT Tools Flow

Current flow:

1. CAT panel lists selected analysis rows.
2. Opening astrometry activates the item/row.
3. Inputs are prefilled from datum/source mapping.
4. Runs are stored in NgRx keyed by product id.
5. Centralization state is stored in NgRx and consumed by overlay.

Good:

- Durable/shared astrometry state belongs in NgRx.
- Transient detail-panel state can stay local.
- Product-id scoping is the correct mental model.

Risks:

- Pixel-scale mapping is buried in component methods.
- Detail view can become stale if selection changes.
- CAT component will grow quickly if each tool repeats this pattern.

Suggested direction:

- Extract pixel-scale mapping and add tests.
- Add a small "detail state reconciler" for deselection.
- If more CAT tools arrive, create a generic analysis item/run pattern rather than cloning astrometry-specific structure.

### App Shell, Theme, and Page Transitions

Current flow:

1. LocalStorage is verified and loaded into NgRx.
2. Theme preference goes through store to `ThemeService`.
3. `ThemeService` applies theme classes to html/body/overlay.
4. Delayed router service schedules fade animations.
5. App component applies page fade styles.

Good:

- Material theme setup is much more understandable than before.
- Overlay theming is handled in the right place.
- System/light/dark preference is restored.

Risks:

- Route animation and API reset are coupled.
- Keyframes are global and duplicated in spirit across app/style concerns.
- Brand teal vs Material cyan needs a short design-token contract.

Suggested direction:

- Keep the current theme architecture.
- Document token roles.
- Move data reset away from the delayed router service when convenient.

## Recommended Cleanup Plan

### Phase 1: Small Bug Fixes

These are low-risk and high-value:

1. Fixed-target radius reads `radius_input_control`.
2. `formatCellEntry()` preserves numeric zero.
3. API effects do not dispatch active datum for empty results.
4. Numeric/date filter Apply is disabled when projected result count is zero, if we confirm that policy.
5. Register or delete the HTTP interceptor.
6. Fix `angular.json` build default configuration.
7. Validate `themePreference` as `system | light | dark`.

### Phase 2: Pure Utility Extraction

Extract logic that can be tested without Angular:

1. Search URL/query builders.
2. Route query param parser.
3. Astrometry pixel-scale mapping.
4. Image orientation/source transform mapping.
5. Table filter projection and projected counts.

This phase gives us confidence before touching the big components.

### Phase 3: Data Table Decomposition

Do this before adding many more filters or mobile table behavior.

Suggested order:

1. Extract filter facade and keep current UI unchanged.
2. Extract active-row/page/scroll coordinator.
3. Extract cell formatting/column label helpers.
4. Leave the Material table template mostly intact until behavior is covered.

Goal: the table component should read like "wire inputs to table and emit user intents", not "own the whole data-page nervous system".

### Phase 4: Overlay Decomposition

Suggested order:

1. Consolidate source orientation.
2. Extract image render geometry.
3. Extract marker projection.
4. Extract WCS centralization shift calculations.

Goal: adding support for a new survey/source should be a mapping/test change, not a hunt through overlay and thumbnail components.

### Phase 5: Mobile `/data` UX

The desktop `/data` view is now dense and powerful. Mobile needs its own design rather than a squeezed version.

Potential mobile direction:

- One visible primary surface at a time: image, table/list, CAT tools.
- Bottom navigation or segmented control for surfaces.
- Row cards instead of full table.
- Filter dialog can be reused.
- CAT detail can become a full-screen drawer/sheet.

This should be designed after the table state is decomposed, otherwise we will duplicate complexity.

## Open Questions For Tomorrow

1. Should zero-result filters be impossible, preserving "always selected row" absolutely?
2. If an analysis item is deselected while its CAT detail is open, should the detail close or remain visible?
3. Should CATCH teal be the true Angular Material primary color, or remain a separate brand surface token?
4. Should the FITS viewer follow light/dark mode, or remain intentionally dark?
5. Should navigation away from `/data` clear API status/data, or should data persist if the user returns?
6. Should fixed-target and moving-target URL construction be moved entirely out of components/effects?
7. Should image orientation be defined as visual CSS transforms only, or as scientific pixel-axis direction metadata too?
8. How much of `/data` mobile should reuse the desktop table versus become a separate row-card experience?

## Suggested First Commit Sequence

If we want to get the codebase stronger quickly, I would start with:

1. Fix radius/zero/empty-active-datum issues.
2. Decide zero-result filter policy and implement it.
3. Register or remove interceptors.
4. Extract and test pixel-scale mapping.
5. Extract and test URL builders.
6. Extract and test image orientation mapping.

That sequence is deliberately boring. It lowers risk before we refactor the large UI components.

## Bottom Line

CATCH is not shaky because the recent features were bad ideas. It is shaky because the important flows have outgrown a few central components. The most important cleanup is to preserve the current UX while moving domain rules and coordination logic into small, testable units.

The data table and overlay should be treated as the next architectural work sites. The Angular Material theme refactor is broadly on the right path; it mostly needs token documentation and a few remaining component-level cleanups.

Recommended next move in the morning: fix the P1 bugs first, then choose the table decomposition plan before adding more filter/plot/mobile behavior.
