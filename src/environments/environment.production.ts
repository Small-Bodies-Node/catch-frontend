import { IEnvironment } from '../models/IEnvironment';

export const environment: IEnvironment = {
  envName: 'prod',
  production: true,
  // apiData: 'mock',
  // apiData: 'catch-dev',
  apiData: 'catch-prod',
  hmr: false,
  emailerEndpoint: '',
  recaptchaSiteKey: '',
};
