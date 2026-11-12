import { IEnvironment } from '../models/IEnvironment';
import { awsWafConfig } from './awsWafConfig';

export const environment: IEnvironment = {
  envName: 'local-images',
  production: false,
  apiData: 'mock',
  CAT_BASE_URL: 'http://127.0.0.1:8000',
  hmr: true,
  awsWafConfig,
  localImageService: true,
};
