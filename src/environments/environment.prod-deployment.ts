import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

export const environment: IEnvironment = {
  envName: 'prod',
  production: true,
  apiData: 'catch-prod',
  hmr: false,
  awsWafConfig,
};
