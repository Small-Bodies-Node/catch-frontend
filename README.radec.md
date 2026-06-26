# CATCH RA/Dec and Pixel Coordinate Notes

This note describes how the `/data` view currently maps sky coordinates, FITS
pixels, rendered JPG pixels, Pan-STARRS markers, astrometry centralization, and
centroidization.

The main implementation lives in:

- `src/app/pages/data-page/panstarrs-overlay/panstarrs-overlay.component.ts`
- `src/app/pages/data-page/cat-tools/cat-tools.component.ts`
- `src/app/pages/data-page/fits-click-coordinates.service.ts`
- `src/app/core/services/image-wcs/image-wcs.service.ts`
- `src/utils/avm.ts`
- `src/utils/image-orientation.ts`

## Coordinate Systems

There are several coordinate systems in play.

`RA/Dec`
: World coordinates on the sky, in degrees.

`FITS image coordinates`
: Pixel coordinates in the FITS file loaded into JS9. These are the coordinates
sent to `/centroid` as `target_x` and `target_y`.

`JPG native image coordinates`
: Pixel coordinates in the cutout JPG image before it is scaled into the UI.

`Rendered overlay coordinates`
: Browser CSS pixel coordinates inside the Pan-STARRS overlay container. These
include the displayed JPG size, the offset needed to center the JPG inside its
container, and any image scaling factor.

The critical scale/offset values are computed by
`PanstarrsOverlayComponent.calculateImageRenderDimensions()`:

- `nativeImageWidth`, `nativeImageHeight`
- `renderedImageWidth`, `renderedImageHeight`
- `imageOffsetX`, `imageOffsetY`
- `imageScaleX`, `imageScaleY`

Most overlay positions ultimately become:

```text
renderedX = imageOffsetX + nativeImageX * imageScaleX
renderedY = imageOffsetY + nativeImageY * imageScaleY
```

Some images are also visually flipped with CSS by
`getOverlaySurveyScaleTransform()`. That transform is applied to the JPG image.
This is a historical source of confusion because not every marker calculation is
driven from the same WCS-aware transform.

## Drawing Pan-STARRS Locations Over JPG Cutouts

The overlay first asks the Pan-STARRS API for nearby source locations around the
active row's RA/Dec. The returned source list is stored as `raDecs`, using
`raMean` and `decMean`.

There are two paths for drawing those sources.

### WCS Path: ATLAS and NEAT

For ATLAS and NEAT-like images, `isAtlasOrNeat` is true. In that case, CATCH
tries to use image WCS metadata rather than simple sky-plane approximation.

The flow is:

1. Fetch Pan-STARRS source RA/Dec values.
2. Ask `ImageWcsService.getPixelCoordinatesFromUrl()` to convert each source
   RA/Dec into image pixel coordinates.
3. `ImageWcsService` fetches the image, reads XMP metadata with `ExifReader`,
   builds a WCS object via `getWCSfromXMP()`, and converts world coordinates to
   pixels with `world_to_pixel()`.
4. The overlay renders each marker with:

```text
left = (wcsX + centralizationDx) * imageScaleX + imageOffsetX - markerRadius
top  = (wcsY + centralizationDy) * imageScaleY + imageOffsetY - markerRadius
```

This path uses `pixelCoordinatesWCS`, `getWcsDivLeft()`, and `getWcsDivTop()`.

### Brute-force Approximation Path: Other Sources

For non-WCS overlay sources, CATCH estimates positions directly from RA/Dec
offsets relative to the current display center.

The relevant methods are:

- `getDivLeft(ra)`
- `getDivTop(dec)`
- `getDivWidth(raErr)`
- `getDivHeight(decErr)`

The approximation assumes an angular field width of `0.0833` degrees, roughly
5 arcminutes, and maps offsets onto the rendered JPG:

```text
xOffset = ((sourceRa - centerRa) * cos(centerDec)) / angularFovWidth
yOffset = (sourceDec - centerDec) / angularFovWidth

renderedX = imageOffsetX + (xOffset + 0.5) * renderedImageWidth
renderedY = imageOffsetY + (0.5 - yOffset) * renderedImageHeight
```

In this path, changing the display center changes where all Pan-STARRS sources
land.

## Applying `/astrometry` Centralization

The `/astrometry` route returns a solved center:

- `center_ra_deg`
- `center_dec_deg`
- `pixel_scale`

When the user applies astrometry centralization, NgRx stores:

```text
productId
runId
centerRaDeg
centerDecDeg
```

The centralization is product-specific. The overlay only uses it when the active
row's `product_id` matches the centralization's `productId`.

### WCS Path

For ATLAS and NEAT-like images, the overlay computes a native-pixel WCS shift:

```text
originalCenter  = WCS(row RA/Dec)
correctedCenter = WCS(astrometry RA/Dec)

dx = originalCenter.x - correctedCenter.x
dy = originalCenter.y - correctedCenter.y
```

That shift is stored as `wcsCentralizationShift`.

Each WCS-derived Pan-STARRS marker is then shifted by the same `dx`/`dy` before
being scaled into rendered overlay coordinates:

```text
markerX = (sourceWcsX + dx) * imageScaleX + imageOffsetX
markerY = (sourceWcsY + dy) * imageScaleY + imageOffsetY
```

The green astrometry crosshair also shifts using the same `dx`/`dy`:

```text
crosshairX = imageCenterX + dx * imageScaleX
crosshairY = imageCenterY + dy * imageScaleY
```

The intent is to make the solved astrometric center line up with the image's
visual center / target frame.

### Brute-force Approximation Path

For non-WCS overlay images, astrometry changes the RA/Dec used as the display
center.

Without centralization:

```text
displayCenter = row RA/Dec
```

With centralization:

```text
displayCenter = astrometry RA/Dec
```

The Pan-STARRS markers are then redrawn relative to the solved center. The green
crosshair is placed at the original row RA/Dec within that solved-center frame.

### Why Some Non-WCS Astrometry Corrections Can Look Like Rotation

For sources on the brute-force approximation path, such as SkyMapper, an applied
astrometry correction is not rendered by taking the existing Pan-STARRS circles
and adding one identical pixel offset to every circle.

Instead, the overlay changes the assumed display center from the row RA/Dec to
the astrometry-corrected RA/Dec, then recomputes every Pan-STARRS marker from
its own sky-coordinate offset inside the assumed fixed-size angular field.

In simplified terms:

```text
before: marker = project(source RA/Dec relative to row RA/Dec)
after:  marker = project(source RA/Dec relative to astrometry RA/Dec)
```

The projection also scales RA offsets by `cos(centerDec)`. Because the center of
the projection changes, the mapping is not guaranteed to be a perfectly rigid
screen-space translation. Across a small field it is usually close to one, but
the difference can show up visually as a tiny shear or rotation.

So when a SkyMapper-like overlay appears to rotate slightly after astrometry is
applied, that is a consequence of the crude redraw-from-sky-coordinates path,
not evidence that `/astrometry` itself is returning a rotational correction.

## Applying `/astrometry` Plus `/centroid`

The `/centroid` route works in FITS image coordinates, not RA/Dec. It receives:

```text
file
target_x
target_y
search_radius
```

and returns:

```text
init_guess_x
init_guess_y
cent_x
cent_y
```

The CAT tools panel initializes the centroid request using JS9/FITS coordinate
helpers where possible:

1. `FitsJpgTogglerComponent` loads the FITS file into JS9.
2. On successful load, it registers a world-to-image mapper in
   `FitsClickCoordinatesService`.
3. `CatToolsComponent` asks that mapper to convert astrometry RA/Dec into FITS
   image coordinates.
4. If the user clicks in the FITS viewer, the click's FITS `imageX` and
   `imageY` override the default centroid target.

When the user applies a centroid run, NgRx stores:

```text
productId
astrometryRunId
centroidRunId
initX
initY
astrometryCenterX
astrometryCenterY
centX
centY
```

The overlay only uses the active centroidization if it belongs to the active
product and to the currently applied astrometry run.

### Current visual behavior

Astrometry centralization moves the Pan-STARRS markers and the green crosshair.

Centroidization currently does not apply a second shift to the Pan-STARRS
markers. Instead, it draws a second centroid crosshair. That crosshair starts
collapsed underneath the green astrometry crosshair and animates outward.

The current centroid crosshair formula is:

```text
base = astrometry crosshair position

centroidCrosshairX = baseX + (centX - initX) * imageScaleX
centroidCrosshairY = baseY + (centY - initY) * imageScaleY
```

This was the original implementation, and it only worked when `initX/initY` was
already near the astrometry-corrected center. The current implementation stores a
frontend-only astrometry-center FITS anchor and uses:

```text
base = astrometry crosshair position

centroidCrosshairX = baseX + (centX - astrometryCenterX) * imageScaleX
centroidCrosshairY = baseY + (centY - astrometryCenterY) * imageScaleY
```

That FITS-space delta is passed through a survey-specific FITS-to-JPG delta
orientation. For most sources this matches the visible JPG transform. SkyMapper
is a known exception: the visible JPG uses a horizontal CSS mirror, but the
centroid delta needs both X and Y flipped to map FITS movement onto the displayed
JPG. In that case, a FITS delta to the left/down becomes a rendered-overlay
delta to the right/up:

```text
nativeDeltaX = centX - astrometryCenterX
nativeDeltaY = centY - astrometryCenterY

overlayDelta = transformOverlaySurveyDelta(source, nativeDeltaX, nativeDeltaY)

centroidCrosshairX = baseX + overlayDelta.x * imageScaleX
centroidCrosshairY = baseY + overlayDelta.y * imageScaleY
```

`target_x/target_y` still go to `/centroid` exactly as before. The
`astrometryCenterX/Y` fields are frontend-only metadata stored with the
centroid run so the overlay can distinguish "where the user asked the backend to
search" from "where the astrometry-corrected center is."

This lets the magenta centroid crosshair move to an arbitrary clicked blob of
light while respecting the ad hoc survey flips already used by
`getOverlaySurveyScaleTransform()`.
