import { Component, OnInit } from '@angular/core';
import { apiBaseUrl } from '../../../utils/constants';

@Component({
  selector: 'app-apis-page',
  templateUrl: './apis-page.component.html',
  styleUrls: ['./apis-page.component.scss'],
})
export class ApisPageComponent implements OnInit {
  // --->>>

  DATA_API_ROOT_URL = apiBaseUrl;
  ROUTE1 = 'https://name-resolution.astro-prod-it.aws.umd.edu/name?name=gunn';
  ROUTE2 = this.DATA_API_ROOT_URL + '/catch?target=65P';
  ROUTE3 = this.DATA_API_ROOT_URL + '/caught/{job_id}';
  ROUTE4 = this.DATA_API_ROOT_URL + '/stream';

  GITHUB_DEMO_SCRIPTS =
    'https://github.com/Small-Bodies-Node/catch-demo-scripts';

  constructor() {}

  ngOnInit() {}

  demoJson = json();
}

function json() {
  const result = JSON.stringify(
    {
      matches: [
        {
          body_type: 'comet',
          comparison_text: '65P/Gunn',
          display_text: '65P/Gunn',
          target: '65P',
        },
        {
          body_type: 'asteroid',
          comparison_text: '657 Gunlod',
          display_text: '657 Gunlod',
          target: '657',
        },
        // ...
      ],
      name: 'gunn',
    },
    null,
    2
  );

  return ('\n' + result).replace(`}\n  ],`, `}\n    ...,\n  ],`);
}
