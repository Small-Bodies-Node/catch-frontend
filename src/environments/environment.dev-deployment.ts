import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

export const environment: IEnvironment = {
  envName: 'dev',
  production: true,
  apiData: 'catch-dev',
  hmr: true,
  awsWafConfig,
};
