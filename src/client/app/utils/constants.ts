import { environment } from '@client/environments/environment';

// Define the time client will wait for API to return
export const apiDefaultTimeoutMs = 5000;

// Development proxy url used with https://www.npmjs.com/package/local-cors-proxy
// See _client_manager for origin of 8010 port
export const PROXY_ROOT_URL = 'http://localhost:8010/proxy';

// Determine Data-Api URL
export let DEPLOYMENT_ROOT_URL;
switch (environment.dataApi) {
  case 'mock':
    // Only used in links to images, etc.
    DEPLOYMENT_ROOT_URL = 'https://catchstage.astro.umd.edu/';
    break;
  case 'catch':
    DEPLOYMENT_ROOT_URL = 'https://catch.astro.umd.edu/';
    break;
  case 'catchstage':
    DEPLOYMENT_ROOT_URL = 'https://catchstage.astro.umd.edu/';
    break;
  case 'catchsandbox':
    DEPLOYMENT_ROOT_URL = 'https://catchsandbox.astro.umd.edu/';
    break;
  case 'musforti':
    DEPLOYMENT_ROOT_URL = 'https://musforti.astro.umd.edu/';
    break;
  default:
    throw new Error('Data-api options are not exhaustive!');
}
