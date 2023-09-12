import { environment } from 'src/environments/environment';

// Define the time client will wait for API to return
export const apiDefaultTimeoutMs = 5000;

//
/**
 * There are two deployments: "prod" and "dev"
 *
 */
export const apiBaseUrl =
  environment.apiData === 'catch-dev'
    ? `https://catch-v2-dev.astro-prod-it.aws.umd.edu`
    : `https://catch-v2.astro-prod-it.aws.umd.edu`;

/**
 * Limits time that can be spent listening for streaming results
 */
export const apiStreamTimeoutSecs = 90;
