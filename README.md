# CATCH GUI

## What's the `CATCH GUI`?

This is the presentation tool for the [CATCH APIs](https://github.com/dwd-umd/catch-apis) developed by the [SBN Group](https://pds-smallbodies.astro.umd.edu/) at the University of Maryland.

## Quick Start

Everything you need to operate this repo can be found in a bash script beginning with `_`. E.g., you'd run `./_dev_client` to start developing the angular app.

### Essentials

- `git clone https://github.com/dwd-umd/catch-gui.git; cd catch-gui; npm i`
- `cp .env-template .env` and edit the contents of `.env` in order to set unique names, passwords, endpoints, etc. for your app.

### Develop App Locally

- `./_dev_client` to start dev server at `http://localhost:4200`

### Provision AWS S3, Cloudfront and Lambda-Emailer Service

- Install `terraform` on your system. (Use homebrew on a Mac: `brew install terraform`).

- `./_run_terraform` to provision/update AWS resources.

### Deploy App

#### Build and run locally

- Run `./_build_client` to build local bundle at `dist-local`

- Run `dist-local` with local http server; e.g. `npm i -g http-server; cd dist-local; http-server` and open in port specified by `http-server`

#### Deploy to github pages

- Configure your cloned repo to a remote repo at github (with github username and repo set in `.env`)
- `./_deploy_github_pages` to deploy to pages for github repo

#### Versioned Linux Deployment

- In a remote create a dir (that you do not need sudo permissions for) soft-linked to `catch-gui` in the document root of e.g. an apache server
- Run `./_deploy_versioned_linux abc` to deploy to `http://yourdomain.com/catch-gui/abc`

#### Deploy to AWS

- `./_build_client` followed by `./_deploy_aws`.

## Issues And Things to Improve

- Previously we had used angular animations but these proved so finicky that I removed them entirely in favor of pure js/css animations form first principles

- Look into SSR with e.g. Angular Universal

- Improve ngrx; move from class-based action creators to ngrx-provided createAction function; see [here](https://medium.com/angular-in-depth/ngrx-action-creators-redesigned-d396960e46da)

- matTooltip isn't working :( Need it in settings.

- Consider get column labels/descriptions at build time

- JQueryStatic type not working :(
