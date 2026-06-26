import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

export const environment: IEnvironment = {
  envName: 'stage',
  production: true,
  apiData: 'catch-stage',
  CAT_BASE_URL: 'http://sbn-cat-alb-2030771433.us-west-2.elb.amazonaws.com',
  hmr: true,
  awsWafConfig,
};
