import { IEnvironment } from '../models/IEnvironment';

/**
 * Default config is for LOCAL DEVELOPMENT
 */
export const environment: IEnvironment = {
  //
  envName: 'local-default',
  production: false,
  // apiData: 'catch-dev',
  apiData: 'mock',
  hmr: true,
  // emailerEndpoint: '',
  awsWafConfig: {
    webAclId: '31f331b0-d1d0-482d-96c6-b5a99ec00596',
    endpoint:
      'https://sdo46iqni6.execute-api.us-east-1.amazonaws.com/prod/contact',
    apiKey:
      'pgNo668486xLhO6EjWkvxuAjNPUybkUhOT/ZhK07rWkDdN0vBQC3ysAM7luP9yv527Wds1sWZE9bDYHMIr1q8SE8jeoo1AkEiHY5ZaTTEnWLCzZHqeWdCt9HSD9TX7gxMgOthz3MQe5n7RTkTJ1vzhsWu2l33il0/HMfXdmiVw6TFlm/Gqdo/TljFrNbec4TKZzVuV1EEZx8rOwsTjsej9v4ndOiQ7RQealJqxh3KqfqeVVHyA32zWXPAr5ZWhri+actoHZIMAQKUrL2mPUCJzxfebhx31Pw3EC7BHXNHdOpoMhTYbCo1axRMLqCaJydHv9P7tzI8TOLNzSbCYiYkKUAOMH7THK4QasFatWodRPUTPHt56FNJsPWdCdHnTY0blcKaWdlcrnGtoLKQ9ODvtCBZt98ihaTLdCLI+aDSnRkd0M6Kpve96Dhl/O37I3gBgz1gdddZI5ZkyZ9DyXLL7hVvPdMhmEY15G2wsxNAkwEuqnXDDrCyynxMy+I3S8mCLAuo6Wazf+bhUJ7qH0ElYAtehg0+2Vws/vRvKRRRgyXiQRAPu0Jh2D4dYti6y/xwAizW3Ml3VwLX20WNWkpRT8FLAAac0MlDnC9Qf4cZI6QmFC4TJkNzOuYQplYVIlHdHeEjsMr+0oH7pp0W5nNq77xFE9o18hBRk9nHCEGS3g=_0_1',
  },
  serverApiBaseUrl: 'https://catch-dev.astro.umd.edu/',
};
