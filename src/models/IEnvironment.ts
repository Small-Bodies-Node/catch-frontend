export interface IEnvironment {
  envName: string;
  production: boolean;
  apiData: 'mock' | 'catch-prod' | 'catch-stage';
  CAT_BASE_URL: string;
  hmr: boolean;
  /** Opt-in local renderer; ordinary development and deployed builds keep their routing. */
  localImageService?: boolean;
  awsWafConfig: {
    webAclId: string;
    endpoint: string;
    apiKey: string;
  };
}
