import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

/**
 * Default config is for LOCAL DEVELOPMENT
 */
export const environment: IEnvironment = {
  //
  envName: 'local-default',
  production: false,
  // apiData: 'catch-dev',
  apiData: 'mock',
  hmr: true,
  awsWafConfig,
};
