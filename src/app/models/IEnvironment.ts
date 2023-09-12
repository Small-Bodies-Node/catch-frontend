export interface IEnvironment {
  production: boolean;
  apiData: 'mock' | 'catch-prod' | 'catch-dev';
  hmr: boolean;
  emailerEndpoint: string;
  recaptchaSiteKey: string;
}
