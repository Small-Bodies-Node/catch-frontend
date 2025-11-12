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

## Docker (production)

- Update `.env` with the `PORT` you want the container to listen on and any other runtime variables (for production deployments, supply real secrets via your orchestrator rather than baking them into the image).
- Build the container image locally: `docker compose build`.
- Run it in the background: `docker compose up -d`.
- The container exposes port `${PORT}` (default `4000`) and starts the SSR server via `node dist/catch-frontend-ng20/server/server.mjs`. An Apache or ALB reverse proxy can forward traffic to this port.
- Check health locally with `curl http://localhost:${PORT}`; the compose healthcheck uses the same endpoint.
