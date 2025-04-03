export interface IEnvironment {
  envName: string;
  production: boolean;
  apiData: 'mock' | 'catch-prod' | 'catch-dev';
  hmr: boolean;
  emailerEndpoint: string;
  // AWS WAF Captcha configuration replaces Google reCAPTCHA
  awsWafConfig: {
    webAclId: string;
    endpoint: string;
    apiKey: string;
  };
}
