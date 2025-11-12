import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

export const environment: IEnvironment = {
  envName: 'stage',
  production: true,
  apiData: 'catch-stage',
  hmr: true,
  awsWafConfig,
};
