import { environment } from '../environments/environment';

// Define the time client will wait for API to return
export const apiDefaultTimeoutMs = 5000;

/**
 * There are two deployments: "prod" and "dev"
 *
 */
export const apiBaseUrl = ['catch-dev', 'mock'].includes(environment.apiData)
  ? `https://catch-dev-api.astro.umd.edu`
  : `https://catch-api.astro.umd.edu`;

console.log(`Using API base URL: ${apiBaseUrl}`);

/**
 * Limits time that can be spent listening for streaming results
 */
export const apiStreamTimeoutSecs = 60 * 20;

/**
 * Layout Constants
 */
export const headerHeightPx = 60;
export const footerHeightPx = 60;

/**
 * Color Constants
 */
export const pastelGreen = '#77DD77';
export const pastelPink = '#FFDAD6';

// Mock API params
export const mockNetworkDelayMs = 500;
export const mockMessageIntervalMs = 200;
