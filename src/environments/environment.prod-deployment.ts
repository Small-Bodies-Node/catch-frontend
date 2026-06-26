import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

export const environment: IEnvironment = {
  envName: 'prod',
  production: true,
  apiData: 'catch-prod',
  CAT_BASE_URL: 'http://sbn-cat-alb-2030771433.us-west-2.elb.amazonaws.com',
  hmr: false,
  awsWafConfig,
};
