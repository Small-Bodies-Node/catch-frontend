# CATCH Frontend NG20

## What Is This?

This is the frontend for the CATCH tool by the [Small Bodies Node] at the [University of Maryland](https://pds-smallbodies.astro.umd.edu/). It is built in coordination with the [CATCH APIs](https://github.com/Small-Bodies-Node/catch-apis), which is an API wrapper around the [CATCH](https://github.com/Small-Bodies-Node/catch) tool itself developed by Dr Michael Kelley.

See: [catch.astro.umd.edu](https://catch.astro.umd.edu/).

## Quick Architecture Overview

- Angular v20 application using server-side rendering (SSR); the same express server supports endpoints for the following:
  - Pinging the Panstarrs API for star locations
  - Pinging the JPL Horizons API for ephemeris data
- State management is handled via NgRx
- This repo contains the `ngx-js9` library for FITS image viewing, and integrates it into the data display
- The npm package `sbn-solar-viewer` is used integrated into the data display
- The contact page uses AWS WAF Captcha and AWS Lambda to pass messages onto the admin's email address.

## Development

- Copy .env.template to .env and adjust any variables as needed
- Install dependencies: `npm install`
- Start the development server: `npm run dev`

## Environment Configuration

- `CAT_BASE_URL` sets the CAT data API base URL in the Angular environment files under `src/environments/*`. Local development points at `http://localhost:8000`.
- When the app is served over HTTPS and `CAT_BASE_URL` is HTTP-only, the browser uses the same-origin `/api/cat/*` proxy to avoid mixed-content blocking.

## Image orientation and paired views

The display convention is equatorial north up and east left. Thumbnails and
full previews use the same normalized image URLs. Preview/FITS selection uses
one astrometry revision, with no survey-specific CSS flips or translations of
an old preview. Older saved CAT runs without a paired preview retain the native
image pair; rerun astrometry to apply their replacement WCS visually.

| Source | Preview normalization |
| --- | --- |
| UMD and AWS cutout services | Request `align=true`; render an ICRS TAN view and embed its actual AVM WCS. |
| SkyMapper DR4 | Same-origin `/api/image-preview/skymapper` forwards to UMD. The adapter uses the exact IMAGE/POS/SIZE FITS header and corresponding PNG. |
| Pan-STARRS single-band cutouts | Preview geometry comes from the FITS URL, correcting older size=1199 versus size=720 pairs. `/api/image-preview/panstarrs` forwards to UMD for exact-header normalization. |
| CAT astrometry/photometry | Use the PNG published alongside that scientific FITS artifact. |

JS9 loads the untouched scientific FITS and derives a separate display layer
on the preview's AVM grid. Its native WCS handles distortions and parity;
`SetRotate('northisup')` resets the display orientation. The bundled Montage
reprojection crashes on the clipped SkyMapper TPV regression case, so display
resampling uses bounded inverse mapping through JS9's native WCS instead.
It yields every 16 rows, cancels obsolete selections, and accepts at most
4,194,304 output pixels. Native FITS arrays remain available for CAT coordinates
and scientific analysis. Rectangular cutouts retain their actual dimensions.
CAT lookups for a different, unapplied solution use a separate hidden WCS
viewer. Mappers are keyed by FITS URL and released with their owning viewer;
reviewing another solution cannot replace the visible Preview/FITS pair.

Preview, FITS, and Reset view controls share the image viewport. Switching to
Preview preserves JS9 pan, zoom, and manual rotation/flip, including overlays;
Reset view restores the fitted north-up view. CAT accepts zero-based native
array pixels; FITS WCS uses one-based pixel centers and browser coordinates
start at the upper-left image edge.

All preview, metadata, and on-demand FITS fetches use the shared loader.
Normalized SkyMapper/PS1 previews share the UMD limit of two active requests
with 300 ms between starts. Original SkyMapper FITS use three requests, PS1
FITS eight, and AWS four. Requests have a 45-second timeout and at most three
attempts for transient failures. Metadata reads reuse preview bytes. FITS are
loaded on demand and at most three FITS blobs remain in memory.

### Test the updated image service locally

Stop an existing `npm run dev`, then run this from the GUI repository:

```bash
npm run dev:images
```

This starts Angular on port 4000, the Node API on 3000, and a local preview
runner on 5010. It keeps `apiMockResultFixed.ts` and `apiMockResultMoving.ts`
unchanged. Open these existing samples:

- Fixed/NEAT/Pan-STARRS: <http://localhost:4000/data?ra=83.63333333333331&dec=22.013333333333332>
- Moving/SkyMapper: <http://localhost:4000/data?target=65P>

The runner loads the actual updated UMD renderer and SkyMapper/Pan-STARRS
adapters without starting the production app, loading its `.env`, or copying
its catalogue database. Owned UMD/AWS rows download their native FITS cutout
from the existing service once, render previews locally, and serve the same
unchanged FITS bytes to JS9. External adapters fetch the exact provider header
and PNG. The GUI retains its request queue; the runner also limits work to
two concurrent requests and deduplicates simultaneous owned cutouts.
Selecting an image promotes its existing queued thumbnail request rather than
adding a duplicate or waiting behind the rest of the page.

Files are stored in a new `tmp/catch-local-images-*` directory inside the GUI
checkout (`tmp/` is ignored by Git). This avoids small container `/tmp`
filesystems. Browser persistent preview caches are disabled in this
mode. Ctrl+C stops all three processes and removes that session's files;
restarting renders fresh previews. Upstream internet access is still required.
In the browser Network panel, local preview responses carry
`X-CATCH-Image-Mode: local` and `X-CATCH-Image-Renderer: north-up-v1`.

The sibling `../sbn-survey-image-service-NON-aws` checkout and `uv` must be
available. `uv` installs the small preview dependency set on first launch and
reuses it thereafter. Alternatively, set `CATCH_PREVIEW_PYTHON` to a Python
with that checkout's `requirements.preview.txt` installed. Set
`CATCH_SURVEY_IMAGE_SERVICE_DIR` if the checkout is elsewhere.

This verifies rendering and browser alignment. It does not verify the deployed
UMD catalogue/cutout pipeline or AWS Lambda packaging. CAT is not started;
the demo points CAT requests at `http://127.0.0.1:8000` unless `CAT_BASE_URL`
is explicitly supplied. Ordinary `npm run dev`, stage, and production retain
their existing configuration.

### Deployment order

1. Deploy `sbn-survey-image-service-NON-aws`, including both `/previews/*`
   routes and the corrected browse renderer. Verify each route returns PNG with AVM.
2. If live search results use the AWS service, rebuild and attach its dependency
   layer with `pyavm`, deploy it, and verify a JPEG/PNG requested with
   `align=true&renderer=north-up-v1`.
3. Install the updated CAT dependencies and deploy `sbn-catch-analysis-tools`.
   New calibration responses must include `preview_url` and `preview_s3_key`.
4. Deploy this GUI and its Express server. `SURVEY_IMAGE_SERVICE_BASE_URL`
   defaults to `https://sbnsurveys.astro.umd.edu/api/`; override it at runtime
   for a different UMD service. `/api/image-preview/*` must reach that server.

AWS browse requests opt into the new renderer and cache contract with
`renderer=north-up-v1`. Legacy AWS requests retain their existing behavior.

Renderer/cache version `north-up-v1` bypasses old server objects; browser cache
`catch-image-view-v3` bypasses old browse images. Pre-alignment CloudFront
filename fallbacks are removed. CAT uses a new result-cache version. No cache
deletion is required, but the first requests will regenerate previews.

### Provider checks and limits

Live SkyMapper requests honored `Range: bytes=0-2879` with HTTP 206, exact
Content-Range, and identity encoding. The adapter refuses full-download
responses, caps headers at 92,160 bytes and PNGs at 8 MiB, and supports the
documented PA=0/180 PNG transforms. Unknown transforms or mismatched dimensions
fail visibly. PA=180 is covered synthetically; the live samples had PA=0.
The regression fixture covers IMAGE=20180516174436-12 at
POS=344.31182,-16.20253 and SIZE=0.0833, including its TPV distortion and
576×606 clipped geometry.

Pan-STARRS generated cutouts returned HTTP 200 without range support.
Its adapter reads a bounded FITS header stream and closes it at END; it never
reads the scientific array, although PS1 may generate the full cutout upstream.
The `getWCS` endpoint describes the whole skycell rather than the exact cutout.
Supported adapters are single-band rings.v3.skycell cutouts up to 2048 pixels;
other external URLs keep their provider geometry rather than guessing a WCS.

SkyMapper contact is not required to implement the verified path. Contact
`skymapper@anu.edu.au` if their PNG transforms change, undocumented position
angles appear, or successful range reads stop. Provider references:
[SkyMapper access rules](https://skymapper.anu.edu.au/how-to-access/),
[PS1 cutout geometry](https://outerspace.stsci.edu/spaces/PANSTARRS/pages/298812251/PS1%2BImage%2BCutout%2BService),
[JS9 API](https://js9.si.edu/js9/help/publicapi.html).

## Dev Container

- Open the repo in VS Code and run `Dev Containers: Reopen in Container`.
- The devcontainer uses the shared `master-vscode-devcontainer:latest` image directly.
- The development container is named `catch-frontend-ng20`.
- The repo is bind-mounted at `/workspaces/catch-frontend-ng20`.
- Codex state is persisted on the project-specific Docker volume `catch-frontend-ng20-codex`.
- `node_modules` is persisted on the project-specific Docker volume `catch-frontend-ng20-node-modules` to isolate Linux packages from this checkout's macOS packages.
- Package-manager caches, Claude state, VS Code Server binaries, and remote extension installations are disposable.
- Dependencies are installed with `npm ci` during `postCreateCommand`; the app is not started automatically.
- See [`.devcontainer/README.md`](.devcontainer/README.md) for persistence and Codex recovery details.

## Docker (production)

- Update `.env` with the `PORT` you want the container to listen on and any other runtime variables (for production deployments, supply real secrets via your orchestrator rather than baking them into the image).
- Build the container image locally: `docker compose build`.
- Run it in the background: `docker compose up -d`.
- The container exposes port `${PORT}` (default `4000`) and starts the SSR server via `node dist/catch-frontend-ng20/server/server.mjs`. An Apache or ALB reverse proxy can forward traffic to this port.
- Check health locally with `curl http://localhost:${PORT}`; the compose healthcheck uses the same endpoint.
