export interface IEnvironment {
  envName: string;
  production: boolean;
  apiData: 'mock' | 'catch-prod' | 'catch-dev';
  hmr: boolean;
  awsWafConfig: {
    webAclId: string;
    endpoint: string;
    apiKey: string;
  };

  //
  serverApiBaseUrl: '/';
}
