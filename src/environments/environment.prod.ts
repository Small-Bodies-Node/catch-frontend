import { IEnvironment } from '../models/IEnvironment';

export const environment: IEnvironment = {
  envName: 'prod',
  production: true,
  apiData: 'catch-prod',
  hmr: false,
  awsWafConfig: {
    webAclId: '31f331b0-d1d0-482d-96c6-b5a99ec00596',
    endpoint:
      'https://sdo46iqni6.execute-api.us-east-1.amazonaws.com/prod/contact',
    apiKey:
      'dkTNECLVhhmS6tjfHtFS7P7Zl5BJLcG082GGCnF86pyviwfyS6E6pL2fcRoug8di2lU2PTJGkwqTkFjNkBjo/OtjIxLo2WzhvGU50hHFvn/7bYdAWxpUVas7thv6UMk6SP86lHVvdIh/BqB+aQDlJKKs8ZRUuPXXnvMwDmUYx/FgWSvJddGCH7Uf2MmOb3v/T0QS0IpccIdgNi+BG6kLI2rGsTyEn277pPW/eXc0y4JSPb5sB9tYlMEnpdBRt96oYs3bs2Sraa6qD30DouZuiaSmlYweKglSkFByAeQ8u1vhjiiK4bRc+anBBAGGBj7b46d0sJTB3UzocUaaP25Ej9uSwPng/3ajA4+e6bNpqhzrK5PTgWevYN5xA01lxZpqjUbqp4gxVCZnXPwyzx0Wi5uRBiydjrmv6EbcvwtHWszE52iyuVFy55Vug60R6FspdC8I8YQ0nXWx8e5cRuQW4yZ2LoXj5jlDSYR2cJstv9BcuutVG3N7iq+hCFAdnFobQWIzzABzJxrNYjWk290AV5zzssbZmnvPo5+ky5piHQpTS6fEEhrHYChrMXRf/EWNHrB74ryTbBRA62ofB25Z1hrSFfI1zEq0GOJ+x8iybS1HdDzMWwIrTOUMg5LvBgS0BZhihoBVsFiD4s8vyh157Hxe0jmMhMuucoGe+3YpRXg=_0_1',
  },
  serverApiBaseUrl: '/',
};
