import { Component, OnInit } from '@angular/core';
import { DEPLOYMENT_ROOT_URL } from '@client/app/utils/constants';

@Component({
  selector: 'app-apis-page',
  templateUrl: './apis-page.component.html',
  styleUrls: ['./apis-page.component.scss']
})
export class ApisPageComponent implements OnInit {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  DATA_API_ROOT_URL = DEPLOYMENT_ROOT_URL + '/api';
  ROUTE1 = this.DATA_API_ROOT_URL + '/query/name?name=65P';
  ROUTE2 = this.DATA_API_ROOT_URL + '/query/moving?target=65P';
  ROUTE3 = this.DATA_API_ROOT_URL + '/caught/{job_id}';
  ROUTE4 = this.DATA_API_ROOT_URL + '/stream';

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
          target: '65P'
        },
        {
          body_type: 'asteroid',
          comparison_text: '657 Gunlod',
          display_text: '657 Gunlod',
          target: '657'
        }
        // ...
      ],
      name: '65p gunn'
    },
    null,
    2
  );

  return ('\n' + result).replace(`}\n  ],`, `}\n    ...,\n  ],`);
}
