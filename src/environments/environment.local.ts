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
  CAT_BASE_URL: 'http://sbn-cat-alb-2030771433.us-west-2.elb.amazonaws.com',
  hmr: true,
  awsWafConfig,
};
